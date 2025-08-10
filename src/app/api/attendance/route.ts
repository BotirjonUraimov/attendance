import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { z } from "zod";

const payloadSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  type: z.enum(["present", "absent", "leave", "holiday"]).default("present"),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const employee = searchParams.get("employee");
  const query: Record<string, unknown> = {};
  if (start && end) query.date = { $gte: new Date(start), $lte: new Date(end) };
  if (employee) query.employee = employee;
  const entries = await Attendance.find(query).sort({ date: 1 });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  const { employeeId, date, checkIn, checkOut, type, notes } = parsed.data;
  const upsert = await Attendance.findOneAndUpdate(
    { employee: employeeId, date: new Date(date) },
    {
      $set: {
        employee: employeeId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        type,
        notes,
      },
    },
    { upsert: true, new: true }
  );
  return NextResponse.json(upsert);
}
