import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    await prisma.setting.create({
      data: {
        key: `contact_${Date.now()}`,
        value: JSON.stringify({ name, email, phone, message, timestamp }),
      },
    });

    return NextResponse.json({ success: true, message: "Thank you for your message. We will get back to you soon." });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
