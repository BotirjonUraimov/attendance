import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";

export default async function TimesheetsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Timesheets</h1>
      <p>Review exceptions and approve timesheets here.</p>
    </div>
  );
}
