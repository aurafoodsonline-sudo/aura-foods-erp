import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerAddress, customerCity, notes, items } = body;

    if (!customerName || !customerPhone || !customerAddress || !customerCity) {
      return NextResponse.json({ error: "Name, phone, address, and city are required" }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }

    let customer = customerPhone
      ? await prisma.customer.findFirst({ where: { phone: customerPhone } })
      : null;

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail || "",
          phone: customerPhone || "",
          address: customerAddress,
          city: customerCity,
        },
      });
    }

    const orderNumber = generateOrderNumber();

    const subtotal = items.reduce((sum: number, item: { productId: number; quantity: number; unitPrice: number }) => sum + item.unitPrice * item.quantity, 0);
    const deliveryCharge = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "Pending",
        subtotal,
        deliveryCharge,
        total,
        notes: notes || "",
        customerName,
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        customerAddress,
        customerCity,
        items: {
          create: items.map((item: { productId: number; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    try {
      await prisma.cartItem.deleteMany({ where: { sessionId: customerPhone || customerEmail || "" } });
    } catch {
      // Cart clearing is best-effort
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
