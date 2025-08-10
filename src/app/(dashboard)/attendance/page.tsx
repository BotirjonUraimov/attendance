import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { upsertAttendance } from "./actions";
import { connectToDatabase } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { EmployeeChecklist } from "./components/EmployeeChecklist";

function todayIsoDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type PlainEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type LeanEmployeeDoc = {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
};

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  await connectToDatabase();
  const docs = (await Employee.find()
    .sort({ firstName: 1, lastName: 1 })
    .lean()) as unknown as LeanEmployeeDoc[];
  const employees: PlainEmployee[] = docs.map((e) => ({
    id: String(e._id),
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <form
        action={upsertAttendance}
        className="grid grid-cols-1 lg:grid-cols-6 gap-4"
      >
        <div className="lg:col-span-2 border rounded p-3 max-h-72 overflow-auto">
          <div className="text-sm font-medium mb-2">Select employees</div>
          <EmployeeChecklist employees={employees} />
          <input type="hidden" name="employeeId" />
        </div>
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-3 content-start">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              name="date"
              type="date"
              defaultValue={todayIsoDate()}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select name="type" className="border rounded px-2 py-1 w-full">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Portion</label>
            <select
              name="portion"
              defaultValue="full"
              className="border rounded px-2 py-1 w-full"
            >
              <option value="full">Full day</option>
              <option value="half">Half day</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              className="text-white rounded px-3 py-2"
              style={{ background: "var(--color-primary)" }}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
