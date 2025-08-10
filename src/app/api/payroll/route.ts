import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { Employee } from "@/models/Employee";
import { z } from "zod";

const paramsSchema = z.object({
  start: z.string(),
  end: z.string(),
});

type PayrollItem = {
  employeeId: string;
  name: string;
  dailyRate: number;
  fullDays: number;
  halfDays: number;
  amount: number;
};

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const parsed = paramsSchema.safeParse({
    start: searchParams.get("start"),
    end: searchParams.get("end"),
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  const start = new Date(parsed.data.start);
  const end = new Date(parsed.data.end);

  const employees = await Employee.find().lean();
  const items: PayrollItem[] = [];

  for (const e of employees) {
    const entries = await Attendance.find({
      employee: e._id,
      date: { $gte: start, $lte: end },
    }).lean();
    let fullDays = 0;
    let halfDays = 0;
    for (const entry of entries) {
      if (entry.type === "present" || entry.type === "holiday") {
        if (entry.portion === "half") halfDays += 1;
        else fullDays += 1;
      }
    }
    const dailyRate = Number(e.basePay); // Interpret basePay as per-day rate now
    const amount = fullDays * dailyRate + halfDays * (dailyRate * 0.5);
    items.push({
      employeeId: String(e._id),
      name: `${e.firstName} ${e.lastName}`,
      dailyRate,
      fullDays,
      halfDays,
      amount,
    });
  }

  return NextResponse.json(items);
}
