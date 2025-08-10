"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
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
      callbackUrl: "/",
    });
    if (res?.error) setError("Invalid credentials");
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
          Admin Login
        </h1>
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Password</label>
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
          Sign in
        </button>
      </form>
    </div>
  );
}
