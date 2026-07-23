import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const bundles = await prisma.bundle.findMany({
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Get bundles error:", error);
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
    const { name, tagline, description, price, oldPrice, image, isFeatured, productIds } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const slug = slugify(name);
    const bundle = await prisma.bundle.create({
      data: {
        name,
        slug,
        tagline: tagline || "",
        description: description || "",
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : 0,
        image: image || "",
        isFeatured: isFeatured || false,
        items: productIds?.length
          ? {
              create: productIds.map((p: { productId: number; quantity: number }) => ({
                productId: p.productId,
                quantity: p.quantity || 1,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, price: true } } },
        },
      },
    });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (error) {
    console.error("Create bundle error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
