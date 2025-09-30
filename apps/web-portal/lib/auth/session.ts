import { getServerSession } from "next-auth";

export async function getSession() {
  // NextAuth default config will be picked from route handler
  return getServerSession();
}