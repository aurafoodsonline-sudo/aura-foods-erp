import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalProducts, totalCategories, totalOrders, totalCustomers] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.customer.count(),
    ]);

    const pendingOrders = await prisma.order.count({
      where: { status: "Pending" },
    });

    const deliveredOrders = await prisma.order.findMany({
      where: { status: "Delivered" },
      select: { total: true },
    });
    const totalSales = deliveredOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    const stockItems = await prisma.inventoryStock.findMany({
      include: { product: { select: { price: true } } },
    });
    const inventoryValue = stockItems.reduce((sum: number, s: any) => sum + Number(s.quantity) * Number(s.product.price), 0);

    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        inventoryStock: {
          quantity: { lte: 10 },
        },
      },
      include: {
        inventoryStock: true,
      },
    });

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true, phone: true } },
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesDataRaw = await prisma.order.findMany({
      where: {
        status: "Delivered",
        createdAt: { gte: sevenDaysAgo },
      },
      select: { total: true, createdAt: true },
    });

    const salesMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      salesMap.set(d.toISOString().split("T")[0], 0);
    }
    for (const sale of salesDataRaw) {
      const dateKey = sale.createdAt.toISOString().split("T")[0];
      salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + sale.total);
    }
    const salesData = Array.from(salesMap.entries())
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalSales,
      inventoryValue,
      lowStockProducts,
      recentOrders,
      salesData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
