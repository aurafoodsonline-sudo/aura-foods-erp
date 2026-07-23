import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        inventoryStock: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
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
    const { sku, name, price, categoryId, images, stockQuantity, lowStockThreshold } = body;

    if (!sku || !name || price === undefined) {
      return NextResponse.json({ error: "SKU, name, and price are required" }, { status: 400 });
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        slug,
        price: parseFloat(price),
        oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : 0,
        tagline: body.tagline || "",
        description: body.description || "",
        ingredients: body.ingredients || "",
        usage: body.usage || "",
        weight: body.weight || "",
        unit: body.unit || "",
        isActive: true,
        isFeatured: body.isFeatured || false,
        isBestSeller: body.isBestSeller || false,
        isNewArrival: body.isNewArrival || false,
        categoryId: categoryId ? parseInt(categoryId) : null,
        images: images?.length
          ? {
              create: images.map((url: string, i: number) => ({
                url,
                isPrimary: i === 0,
                sortOrder: i,
              })),
            }
          : undefined,
        inventoryStock: stockQuantity !== undefined
          ? {
              create: {
                quantity: parseFloat(stockQuantity),
                lowStockThreshold: lowStockThreshold ? parseFloat(lowStockThreshold) : 10,
              },
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        inventoryStock: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
