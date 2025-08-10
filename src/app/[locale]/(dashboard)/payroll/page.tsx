import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
// import { getTranslations } from "next-intl/server";

export default async function PayrollPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/login`);

  // const t = await getTranslations();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Oylik hisob</h1>
      <p>Calculate per-period payroll with allowances and deductions here.</p>
    </div>
  );
}
