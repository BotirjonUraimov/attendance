"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getTranslations } from "@/lib/translations";

export default function LoginPage() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "uz";
  const t = getTranslations(locale);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/uz",
    });
    if (res?.error) setError(t("auth.invalidCredentials"));
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--color-neutral-50)" }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4 border"
      >
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--color-neutral-900)" }}
        >
          {t("auth.adminLogin")}
        </h1>
        <div className="space-y-2">
          <label className="block text-sm">{t("auth.email")}</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">{t("auth.password")}</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded px-3 py-2 text-white"
          style={{ background: "var(--color-primary)" }}
        >
          {t("auth.signIn")}
        </button>
      </form>
    </div>
  );
}
