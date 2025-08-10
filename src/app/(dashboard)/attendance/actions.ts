"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Attendance } from "@/models/Attendance";

export type AttendanceType = "present" | "absent" | "leave" | "holiday";
export type DayPortion = "full" | "half";

export async function upsertAttendance(formData: FormData) {
  await connectToDatabase();
  const selectedIds = formData
    .getAll("employeeIds")
    .map((v) => String(v))
    .filter(Boolean);
  const fallbackId = String(formData.get("employeeId") || "");
  const employeeIds =
    selectedIds.length > 0 ? selectedIds : fallbackId ? [fallbackId] : [];

  const dateStr = String(formData.get("date") || "");
  const type = String(formData.get("type") || "present") as AttendanceType;
  const portion = String(formData.get("portion") || "full") as DayPortion;

  if (employeeIds.length === 0 || !dateStr) {
    revalidatePath("/attendance");
    return;
  }

  const day = new Date(`${dateStr}T00:00:00`);
  if (isNaN(day.getTime())) {
    revalidatePath("/attendance");
    return;
  }

  await Promise.all(
    employeeIds.map((employeeId) =>
      Attendance.findOneAndUpdate(
        { employee: employeeId, date: day },
        {
          $set: {
            employee: employeeId,
            date: day,
            type,
            portion,
          },
        },
        { upsert: true, new: true }
      )
    )
  );

  revalidatePath("/attendance");
}
