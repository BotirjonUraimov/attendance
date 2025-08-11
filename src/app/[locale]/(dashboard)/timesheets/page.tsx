import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { getTranslations } from "@/lib/translations";

export default async function TimesheetsPage({
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
      <h1 className="text-xl font-semibold">{t("timesheets.title")}</h1>
      <p>Review exceptions and approve timesheets here.</p>
    </div>
  );
}
