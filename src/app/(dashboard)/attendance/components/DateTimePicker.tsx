"use client";
import { useId, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function DateTimePicker({ name, label }: { name: string; label: string }) {
  const id = useId();
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div>
      <label className="block text-sm mb-1" htmlFor={id}>{label}</label>
      <DatePicker
        id={id}
        selected={value}
        onChange={(d) => setValue(d)}
        showTimeSelect
        timeIntervals={5}
        dateFormat="yyyy-MM-dd HH:mm"
        className="border rounded px-2 py-1 w-full"
        placeholderText="Select date and time"
      />
      <input type="hidden" name={name} value={value ? value.toISOString() : ""} />
    </div>
  );
}
