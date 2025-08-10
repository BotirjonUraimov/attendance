'use server'

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Employee } from "@/models/Employee";

export async function addEmployee(formData: FormData) {
  await connectToDatabase();
  const firstName = String(formData.get('firstName') || '');
  const lastName = String(formData.get('lastName') || '');
  const email = String(formData.get('email') || '');
  const basePay = Number(formData.get('basePay') || 0);
  await Employee.create({ firstName, lastName, email, basePay, status: 'active' });
  revalidatePath('/employees');
}
