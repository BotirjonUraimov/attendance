import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { getTranslations } from "@/lib/translations";

export default async function PayrollPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/login`);

  const t = getTranslations(locale);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("payroll.title")}</h1>
      <p>Calculate per-period payroll with allowances and deductions here.</p>
    </div>
  );
}
