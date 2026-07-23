import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock");

    const where: Record<string, unknown> = {};
    if (lowStock === "true") {
      where.quantity = { lte: prisma.inventoryStock.fields.lowStockThreshold };
    }

    const stock = await prisma.inventoryStock.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, sku: true, price: true, isActive: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ stock });
  } catch (error) {
    console.error("Get inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, type, quantity, notes } = body;

    if (!productId || !type || quantity === undefined) {
      return NextResponse.json({ error: "Product ID, type, and quantity are required" }, { status: 400 });
    }

    if (!["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"].includes(type)) {
      return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ error: "Quantity must be a positive number" }, { status: 400 });
    }

    const stock = await prisma.inventoryStock.findUnique({
      where: { productId: parseInt(productId) },
    });

    if (!stock) {
      return NextResponse.json({ error: "Product not found in inventory" }, { status: 404 });
    }

    let newQuantity = stock.quantity;
    if (type === "STOCK_IN") newQuantity += parsedQuantity;
    else if (type === "STOCK_OUT") newQuantity = Math.max(0, newQuantity - parsedQuantity);
    else if (type === "ADJUSTMENT") newQuantity = parsedQuantity;

    await prisma.inventoryStock.update({
      where: { productId: parseInt(productId) },
      data: { quantity: newQuantity },
    });

    const transaction = await prisma.inventoryTransaction.create({
      data: {
        productId: parseInt(productId),
        userId: user.id,
        type,
        quantity: parsedQuantity,
        notes: notes || "",
      },
    });

    return NextResponse.json({ transaction, newQuantity }, { status: 201 });
  } catch (error) {
    console.error("Create inventory transaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
