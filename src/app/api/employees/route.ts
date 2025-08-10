import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { z } from "zod";

const employeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  basePay: z.number().nonnegative(),
  status: z.enum(["active", "inactive", "on_leave"]).default("active"),
});

export async function GET() {
  await connectToDatabase();
  const employees = await Employee.find().sort({ createdAt: -1 });
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const json = await req.json();
  const parsed = employeeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const exists = await Employee.findOne({ email: parsed.data.email });
  if (exists) return NextResponse.json({ error: "Employee already exists" }, { status: 409 });
  const created = await Employee.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
