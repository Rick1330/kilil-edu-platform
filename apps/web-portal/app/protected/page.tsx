import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ProtectedPage() {
  const session = await getServerSession();
  if (!session) {
    return <div className="p-6">Please <Link href="/api/auth/signin">login</Link> to continue.</div>;
  }
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">Protected</h1>
      <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}