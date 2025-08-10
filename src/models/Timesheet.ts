import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface TimesheetDocument extends Document {
  employee: Types.ObjectId;
  periodStart: Date; // inclusive
  periodEnd: Date;   // inclusive
  totalHours: number;
  overtimeHours: number;
  lateCount: number;
  earlyLeaveCount: number;
  missingPunchCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TimesheetSchema = new Schema<TimesheetDocument>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    periodStart: { type: Date, required: true, index: true },
    periodEnd: { type: Date, required: true, index: true },
    totalHours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
    earlyLeaveCount: { type: Number, default: 0 },
    missingPunchCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TimesheetSchema.index({ employee: 1, periodStart: 1, periodEnd: 1 }, { unique: true });

export const Timesheet: Model<TimesheetDocument> =
  mongoose.models.Timesheet || mongoose.model<TimesheetDocument>("Timesheet", TimesheetSchema);
