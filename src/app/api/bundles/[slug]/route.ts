import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const bundle = await prisma.bundle.findUnique({
      where: { slug },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, price: true, oldPrice: true, weight: true, tagline: true },
            },
          },
        },
      },
    });

    if (!bundle || !bundle.isActive) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Get bundle error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
