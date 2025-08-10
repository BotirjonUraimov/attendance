import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div
      className="min-h-screen grid grid-rows-[56px_1fr]"
      style={{
        background: "var(--color-neutral-50)",
        color: "var(--color-neutral-900)",
        width: "100vw",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <header
        className="border-b flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-3"
        style={{
          background: "var(--color-primary)",
          color: "#fff",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        <div className="font-semibold shrink-0 text-sm sm:text-base">Admin</div>
        <nav className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
          <Link
            className="hover:underline text-white/90 hover:text-white"
            href="/"
          >
            Dashboard
          </Link>
          <Link
            className="hover:underline text-white/90 hover:text-white"
            href="/employees"
          >
            Employees
          </Link>
          <Link
            className="hover:underline text-white/90 hover:text-white"
            href="/attendance"
          >
            Attendance
          </Link>
          <Link
            className="hover:underline text-white/90 hover:text-white"
            href="/timesheets"
          >
            Timesheets
          </Link>
          <Link
            className="hover:underline text-white/90 hover:text-white"
            href="/payroll"
          >
            Payroll
          </Link>
        </nav>
        <form action="/api/auth/signout" method="post" className="shrink-0">
          <Button type="submit" variant="secondary" size="sm">
            Sign out
          </Button>
        </form>
      </header>
      <main
        className="grid grid-cols-1 lg:grid-cols-[260px_1fr]"
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        <aside
          className="hidden lg:block border-r p-4 space-y-2"
          style={{ background: "var(--color-accent)" }}
        >
          <div className="text-sm text-neutral-700">Navigation</div>
          <div className="space-y-1 text-sm">
            <Link className="block hover:underline" href="/">
              Dashboard
            </Link>
            <Link className="block hover:underline" href="/employees">
              Employees
            </Link>
            <Link className="block hover:underline" href="/attendance">
              Attendance
            </Link>
            <Link className="block hover:underline" href="/timesheets">
              Timesheets
            </Link>
            <Link className="block hover:underline" href="/payroll">
              Payroll
            </Link>
          </div>
        </aside>
        <section
          className="p-3 sm:p-6"
          style={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {children}
        </section>
      </main>
    </div>
  );
}
