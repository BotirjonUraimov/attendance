import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { Employee } from "@/models/Employee";
import { z } from "zod";

const paramsSchema = z.object({
  start: z.string(),
  end: z.string(),
});

type TimesheetSummary = {
  employeeId: string;
  name: string;
  totalHours: number;
  overtimeHours: number;
  lateCount: number;
  earlyLeaveCount: number;
  missingPunchCount: number;
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
  const summaries: TimesheetSummary[] = [];

  for (const e of employees) {
    const entries = await Attendance.find({
      employee: e._id,
      date: { $gte: start, $lte: end },
    }).lean();
    let totalHours = 0;
    let overtimeHours = 0;
    const lateCount = 0;
    const earlyLeaveCount = 0;
    let missingPunchCount = 0;
    for (const entry of entries) {
      if (entry.checkIn && entry.checkOut) {
        const hours =
          (new Date(entry.checkOut).getTime() -
            new Date(entry.checkIn).getTime()) /
          (1000 * 60 * 60);
        totalHours += Math.max(0, hours);
        if (hours > 8) overtimeHours += hours - 8;
      } else {
        missingPunchCount += 1;
      }
    }
    summaries.push({
      employeeId: String(e._id),
      name: `${e.firstName} ${e.lastName}`,
      totalHours,
      overtimeHours,
      lateCount,
      earlyLeaveCount,
      missingPunchCount,
    });
  }

  return NextResponse.json(summaries);
}
