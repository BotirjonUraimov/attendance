"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLanguage("uz")}
        className={`px-2 py-1 text-xs rounded ${
          locale === "uz"
            ? "bg-white/20 text-white font-medium"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        O&apos;Z
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-1 text-xs rounded ${
          locale === "en"
            ? "bg-white/20 text-white font-medium"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        EN
      </button>
    </div>
  );
}
