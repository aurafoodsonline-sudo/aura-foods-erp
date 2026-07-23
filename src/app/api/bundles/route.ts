import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, price: true, weight: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Get bundles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
