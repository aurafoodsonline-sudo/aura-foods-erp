import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const where: Record<string, unknown> = {};
    if (productId) where.productId = parseInt(productId);

    const transactions = await prisma.inventoryTransaction.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Get inventory transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
