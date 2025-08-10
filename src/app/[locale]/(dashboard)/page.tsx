import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { Attendance } from "@/models/Attendance";
// import { getTranslations } from "next-intl/server";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

function colorFromString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++)
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 40%)`;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/login`);
  await connectToDatabase();

  // const t = await getTranslations();

  const totalEmployees = await Employee.countDocuments();

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );
  const presentToday = await Attendance.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay },
    type: { $ne: "absent" },
  });

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const monthEntries = await Attendance.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).lean();
  const fullDays = monthEntries.filter(
    (e) =>
      (e.type === "present" || e.type === "holiday") && e.portion !== "half"
  ).length;
  const halfDays = monthEntries.filter(
    (e) =>
      (e.type === "present" || e.type === "holiday") && e.portion === "half"
  ).length;

  const pendingExceptions = monthEntries.reduce((acc, e) => {
    if (e.type === "present" && (!e.checkIn || !e.checkOut)) return acc + 1;
    return acc;
  }, 0);

  // Per-employee KPIs for this month
  const employees = await Employee.find()
    .sort({ firstName: 1, lastName: 1 })
    .lean();
  const statsByEmployee = new Map<
    string,
    { fullDays: number; halfDays: number; absences: number; leaves: number }
  >();
  for (const e of employees) {
    statsByEmployee.set(String(e._id), {
      fullDays: 0,
      halfDays: 0,
      absences: 0,
      leaves: 0,
    });
  }
  for (const entry of monthEntries) {
    const id = String(entry.employee);
    const s = statsByEmployee.get(id);
    if (!s) continue;
    if (entry.type === "present" || entry.type === "holiday") {
      if (entry.portion === "half") s.halfDays += 1;
      else s.fullDays += 1;
    } else if (entry.type === "absent") {
      s.absences += 1;
    } else if (entry.type === "leave") {
      s.leaves += 1;
    }
  }

  return (
    <div className="space-y-6 min-w-0">
      <h1 className="text-2xl font-semibold">Boshqaruv paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-0">
        <div
          className="p-4 rounded min-w-0"
          style={{ background: "var(--color-accent)" }}
        >
          <div className="text-sm text-neutral-700">Xodimlar</div>
          <div className="text-2xl font-semibold">{totalEmployees}</div>
        </div>
        <div
          className="p-4 rounded border min-w-0"
          style={{ borderColor: "var(--color-secondary)" }}
        >
          <div className="text-sm text-neutral-700">Bugun kelganlar</div>
          <div className="text-2xl font-semibold">{presentToday}</div>
        </div>
        <div
          className="p-4 rounded border min-w-0"
          style={{ borderColor: "var(--color-secondary)" }}
        >
          <div className="text-sm text-neutral-700">Kunlar (Bu oy)</div>
          <div className="text-2xl font-semibold break-words">
            {fullDays} to'liq · {halfDays} yarim
          </div>
        </div>
        <div
          className="p-4 rounded border min-w-0"
          style={{ borderColor: "var(--color-warning)" }}
        >
          <div className="text-sm text-neutral-700">
            Kutilayotgan istisnolar
          </div>
          <div className="text-2xl font-semibold">{pendingExceptions}</div>
        </div>
      </div>

      <div className="space-y-2 min-w-0">
        <div className="text-sm text-neutral-600">Xodimlar (Bu oy)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 min-w-0">
          {employees.map((e) => {
            const name = `${e.firstName} ${e.lastName}`;
            const stats = statsByEmployee.get(String(e._id))!;
            const bg = colorFromString(name);
            const init = initialsOf(name);
            return (
              <div
                key={String(e._id)}
                className="p-4 border rounded flex items-center gap-3 min-w-0"
                style={{ borderColor: "var(--color-secondary)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                  style={{ background: bg }}
                  aria-label={name}
                  title={name}
                >
                  {init}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{name}</div>
                  <div className="text-xs text-neutral-600 truncate">
                    {e.email}
                  </div>
                  <div className="text-sm mt-1">
                    {stats.fullDays} to'liq · {stats.halfDays} yarim ·{" "}
                    {stats.absences} yo'q · {stats.leaves} ta'til
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
