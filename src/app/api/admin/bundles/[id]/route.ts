import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bundle = await prisma.bundle.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, slug: true, price: true, weight: true } } },
        },
      },
    });

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Get bundle error:", error);
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

    const existing = await prisma.bundle.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.name) updateData.slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-");
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.oldPrice !== undefined) updateData.oldPrice = parseFloat(body.oldPrice);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    if (body.productIds) {
      await prisma.bundleItem.deleteMany({ where: { bundleId: parseInt(id) } });
      await prisma.bundleItem.createMany({
        data: body.productIds.map((p: { productId: number; quantity: number }) => ({
          bundleId: parseInt(id),
          productId: p.productId,
          quantity: p.quantity || 1,
        })),
      });
    }

    const bundle = await prisma.bundle.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, price: true } } },
        },
      },
    });

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Update bundle error:", error);
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
    await prisma.bundle.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete bundle error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
