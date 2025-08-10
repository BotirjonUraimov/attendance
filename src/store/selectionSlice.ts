import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  selectedEmployeeIds: string[];
}

const initialState: SelectionState = {
  selectedEmployeeIds: [],
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    toggleEmployee(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedEmployeeIds.includes(id)) {
        state.selectedEmployeeIds = state.selectedEmployeeIds.filter((x) => x !== id);
      } else {
        state.selectedEmployeeIds.push(id);
      }
    },
    setEmployees(state, action: PayloadAction<string[]>) {
      state.selectedEmployeeIds = action.payload;
    },
    clearEmployees(state) {
      state.selectedEmployeeIds = [];
    },
  },
});

export const { toggleEmployee, setEmployees, clearEmployees } = selectionSlice.actions;
export default selectionSlice.reducer;
