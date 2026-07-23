import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: { select: { orders: true } },
        orders: { select: { total: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = customers.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      city: c.city,
      notes: c.notes,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      orderCount: c._count?.orders || 0,
      totalSpent: c.orders ? c.orders.reduce((sum: number, o: any) => sum + (o.status === "Delivered" ? o.total : 0), 0) : 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
