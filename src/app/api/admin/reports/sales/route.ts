import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = { status: "Delivered" };

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.createdAt = dateFilter;
    }

    const orders = await prisma.order.findMany({
      where,
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyMap = new Map<string, { sales: number; count: number }>();

    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split("T")[0];
      const entry = dailyMap.get(dateKey) || { sales: 0, count: 0 };
      entry.sales += order.total;
      entry.count += 1;
      dailyMap.set(dateKey, entry);
    }

    const dailySales = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        totalSales: data.sales,
        orderCount: data.count,
        averageOrderValue: data.count > 0 ? data.sales / data.count : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalSales = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return NextResponse.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      dailySales,
    });
  } catch (error) {
    console.error("Sales report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
