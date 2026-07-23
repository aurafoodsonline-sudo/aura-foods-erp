import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stockItems = await prisma.inventoryStock.findMany({
      include: {
        product: { select: { id: true, name: true, sku: true, price: true, isActive: true } },
      },
    });

    const totalValue = stockItems.reduce((sum: number, s: any) => sum + Number(s.quantity) * Number(s.product.price), 0);
    const totalItems = stockItems.reduce((sum: number, s: any) => sum + Number(s.quantity), 0);

    const lowStockItems = stockItems
      .filter((s: any) => s.quantity <= s.lowStockThreshold)
      .map((s: any) => ({
        product: s.product,
        currentStock: s.quantity,
        lowStockThreshold: s.lowStockThreshold,
        value: s.quantity * s.product.price,
      }));

    const transactionSummary = await prisma.inventoryTransaction.groupBy({
      by: ["type"],
      _count: { type: true },
      _sum: { quantity: true },
    });

    const stockMovementSummary = transactionSummary.map((t: any) => ({
      type: t.type,
      count: t._count.type,
      totalQuantity: t._sum.quantity || 0,
    }));

    const recentTransactions = await prisma.inventoryTransaction.findMany({
      take: 20,
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      inventoryValuation: {
        totalValue,
        totalItems,
        itemCount: stockItems.length,
      },
      lowStockItems,
      stockMovementSummary,
      recentTransactions,
    });
  } catch (error) {
    console.error("Inventory report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
