import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { ids } = (await request.json()) as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    if (ids.some((id) => typeof id !== "number" || !Number.isInteger(id))) {
      return NextResponse.json(
        { error: "All ids must be integers" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products by ids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}