import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AttendanceType = "present" | "absent" | "leave" | "holiday";
export type DayPortion = "full" | "half";

export interface AttendanceDocument extends Document {
  employee: Types.ObjectId;
  date: Date; // day resolution
  checkIn?: Date;
  checkOut?: Date;
  type: AttendanceType;
  portion?: DayPortion;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<AttendanceDocument>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    type: {
      type: String,
      enum: ["present", "absent", "leave", "holiday"],
      default: "present",
    },
    portion: { type: String, enum: ["full", "half"], default: "full" },
    notes: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance: Model<AttendanceDocument> =
  mongoose.models.Attendance ||
  mongoose.model<AttendanceDocument>("Attendance", AttendanceSchema);
