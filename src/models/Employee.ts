import mongoose, { Schema, Document, Model } from "mongoose";

export type EmploymentStatus = "active" | "inactive" | "on_leave";

export interface EmployeeDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  basePay: number; // per hour
  status: EmploymentStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    department: { type: String },
    role: { type: String },
    basePay: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive", "on_leave"], default: "active" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export const Employee: Model<EmployeeDocument> =
  mongoose.models.Employee || mongoose.model<EmployeeDocument>("Employee", EmployeeSchema);
