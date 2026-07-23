import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const orderStatusDistribution = orders.map((o: any) => ({
      status: o.status,
      count: o._count.status,
    }));

    const topSellingProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const productIds = topSellingProducts.map((p: any) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true },
    });

    const productMap = new Map(products.map((p: any) => [p.id, p]));

    const topProducts = topSellingProducts.map((p: any) => ({
      product: productMap.get(p.productId) || null,
      totalSold: p._sum.quantity || 0,
      totalRevenue: p._sum.totalPrice || 0,
    }));

    const ordersWithCategory = await prisma.orderItem.findMany({
      include: {
        product: { select: { categoryId: true, category: { select: { name: true } } } },
      },
    });

    const categorySalesMap = new Map<string, number>();
    for (const item of ordersWithCategory) {
      const catName = item.product.category?.name || "Uncategorized";
      categorySalesMap.set(catName, (categorySalesMap.get(catName) || 0) + item.totalPrice);
    }

    const categorySalesBreakdown = Array.from(categorySalesMap.entries())
      .map(([category, totalSales]) => ({ category, totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales);

    return NextResponse.json({
      orderStatusDistribution,
      topSellingProducts: topProducts,
      categorySalesBreakdown,
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
