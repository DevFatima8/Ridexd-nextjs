import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ridexd_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "Admin@123";
}

function adminSecret(): string {
  return process.env.ADMIN_SECRET ?? "ridexd-admin-secret";
}

export function adminToken(): string {
  return createHash("sha256").update(`${adminPassword()}::${adminSecret()}`).digest("hex");
}

export function checkPassword(input: string): boolean {
  return input.trim() === adminPassword();
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
