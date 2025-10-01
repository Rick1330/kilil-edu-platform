"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function UserBadge() {
  const { data: session, status } = useSession();
  if (status === "loading") return <span>…</span>;
  if (!session) return <button onClick={() => signIn()}>Login</button>;
  const name = session.user?.name || "User";
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Hello, {name}</span>
      <button className="text-xs underline" onClick={() => signOut()}>Logout</button>
    </div>
  );
}