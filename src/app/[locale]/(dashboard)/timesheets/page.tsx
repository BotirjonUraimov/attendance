import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
// import { getTranslations } from "next-intl/server";

export default async function TimesheetsPage({
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
      <h1 className="text-xl font-semibold">Ish vaqtlari</h1>
      <p>Review exceptions and approve timesheets here.</p>
    </div>
  );
}
