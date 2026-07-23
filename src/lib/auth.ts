import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "aura_admin_session";
const SESSION_PREFIX = "admin_";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const token = SESSION_PREFIX + Buffer.from(`${userId}:${Date.now()}`).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE);
  if (!token) return null;

  try {
    const decoded = Buffer.from(token.value.replace(SESSION_PREFIX, ""), "base64").toString();
    const userId = parseInt(decoded.split(":")[0]);
    if (isNaN(userId)) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export function canAccess(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    Viewer: 0,
    SalesStaff: 1,
    InventoryStaff: 2,
    Admin: 3,
    SuperAdmin: 4,
  };
  return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[requiredRole] ?? 0);
}
