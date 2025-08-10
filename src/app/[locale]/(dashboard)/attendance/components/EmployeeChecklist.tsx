"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { toggleEmployee } from "@/store/selectionSlice";

export function EmployeeChecklist({
  employees,
}: {
  employees: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.selection.selectedEmployeeIds);
  return (
    <div className="space-y-2">
      {employees.map((e) => {
        const id = e.id;
        const checked = selected.includes(id);
        return (
          <label key={id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => dispatch(toggleEmployee(id))}
            />
            <span>
              {e.firstName} {e.lastName} · {e.email}
            </span>
            <input type="hidden" name="employeeIds" value={checked ? id : ""} />
          </label>
        );
      })}
    </div>
  );
}
