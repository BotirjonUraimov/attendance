import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface PayrollItem {
  description: string;
  amount: number;
  type: "allowance" | "deduction";
}

export interface PayrollDocument extends Document {
  employee: Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  baseHours: number;
  overtimeHours: number;
  hourlyRate: number; // employee.basePay snapshot
  items: PayrollItem[];
  grossPay: number;
  netPay: number;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollItemSchema = new Schema<PayrollItem>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["allowance", "deduction"], required: true },
});

const PayrollSchema = new Schema<PayrollDocument>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    baseHours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    hourlyRate: { type: Number, required: true },
    items: { type: [PayrollItemSchema], default: [] },
    grossPay: { type: Number, required: true },
    netPay: { type: Number, required: true },
  },
  { timestamps: true }
);

PayrollSchema.index({ employee: 1, periodStart: 1, periodEnd: 1 }, { unique: true });

export const Payroll: Model<PayrollDocument> =
  mongoose.models.Payroll || mongoose.model<PayrollDocument>("Payroll", PayrollSchema);
