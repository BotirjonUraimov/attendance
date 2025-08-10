import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";

export default async function PayrollPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Payroll</h1>
      <p>Calculate per-period payroll with allowances and deductions here.</p>
    </div>
  );
}
