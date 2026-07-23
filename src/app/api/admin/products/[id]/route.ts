import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        inventoryStock: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
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

    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.name) updateData.slug = slugify(body.name);
    if (body.sku) updateData.sku = body.sku;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.oldPrice !== undefined) updateData.oldPrice = parseFloat(body.oldPrice);
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
    if (body.usage !== undefined) updateData.usage = body.usage;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId ? parseInt(body.categoryId) : null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isBestSeller !== undefined) updateData.isBestSeller = body.isBestSeller;
    if (body.isNewArrival !== undefined) updateData.isNewArrival = body.isNewArrival;

    if (body.images?.length) {
      await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
      await prisma.productImage.createMany({
        data: body.images.map((url: string, i: number) => ({
          productId: parseInt(id),
          url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      });
    }

    if (body.stockQuantity !== undefined) {
      const stock = await prisma.inventoryStock.findUnique({
        where: { productId: parseInt(id) },
      });
      if (stock) {
        await prisma.inventoryStock.update({
          where: { productId: parseInt(id) },
          data: {
            quantity: parseFloat(body.stockQuantity),
            lowStockThreshold: body.lowStockThreshold !== undefined ? parseFloat(body.lowStockThreshold) : stock.lowStockThreshold,
          },
        });
      } else {
        await prisma.inventoryStock.create({
          data: {
            productId: parseInt(id),
            quantity: parseFloat(body.stockQuantity),
            lowStockThreshold: body.lowStockThreshold ? parseFloat(body.lowStockThreshold) : 10,
          },
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        inventoryStock: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
