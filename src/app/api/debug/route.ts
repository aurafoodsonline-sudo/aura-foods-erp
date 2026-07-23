import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const env = {
      TURSO_DB_URL: process.env.TURSO_DB_URL ? "set" : "not set",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "set" : "not set",
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "not set",
      NODE_ENV: process.env.NODE_ENV,
    };

    let dbStatus = "unknown";
    let dbError = null;
    let categories = null;

    try {
      const start = Date.now();
      categories = await prisma.category.findMany({ take: 1 });
      const elapsed = Date.now() - start;
      dbStatus = `ok (${elapsed}ms, ${categories.length} cats)`;
    } catch (e: any) {
      dbStatus = "error";
      dbError = { message: e.message, stack: e.stack?.split("\n").slice(0, 5).join("\n") };
    }

    return NextResponse.json({ env, dbStatus, dbError, categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.split("\n").slice(0, 5) }, { status: 500 });
  }
}
