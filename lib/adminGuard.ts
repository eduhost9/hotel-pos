import { getCurrentRole } from "./auth";

export async function requireAdmin() {
  const role = await getCurrentRole();

  return role === "admin";
}
