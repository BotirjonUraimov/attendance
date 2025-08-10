"use client";

import { useRouter, usePathname } from "next/navigation";

export function SimpleLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.startsWith("/en") ? "en" : "uz";

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/(en|uz)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLanguage("uz")}
        className={`px-2 py-1 text-xs rounded ${
          currentLocale === "uz"
            ? "bg-white/20 text-white font-medium"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        O&apos;Z
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-1 text-xs rounded ${
          currentLocale === "en"
            ? "bg-white/20 text-white font-medium"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        EN
      </button>
    </div>
  );
}
