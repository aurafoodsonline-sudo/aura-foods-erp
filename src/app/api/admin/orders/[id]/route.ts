import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, price: true, images: { take: 1 } },
            },
          },
        },
        customer: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    if (body.status === "Delivered" && existing.status !== "Delivered") {
      const items = await prisma.orderItem.findMany({
        where: { orderId: parseInt(id) },
      });

      for (const item of items) {
        const stock = await prisma.inventoryStock.findUnique({
          where: { productId: item.productId },
        });

        if (stock) {
          await prisma.inventoryStock.update({
            where: { productId: item.productId },
            data: { quantity: stock.quantity - item.quantity },
          });
        }

        await prisma.inventoryTransaction.create({
          data: {
            productId: item.productId,
            userId: user.id,
            type: "SALE",
            quantity: item.quantity,
            reference: existing.orderNumber,
            notes: `Sale via order ${existing.orderNumber}`,
          },
        });
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
