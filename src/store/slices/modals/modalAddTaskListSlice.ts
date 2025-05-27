import { createSlice } from "@reduxjs/toolkit";

interface ModalAddTaskListState {
  isOpen: boolean;
}

const initialState: ModalAddTaskListState = {
  isOpen: false,
};

const modalAddTaskListSlice = createSlice({
  name: "modalAddTaskList",
  initialState,
  reducers: {
    openModalAddTaskList: (state) => {
      state.isOpen = true;
    },
    closeModalAddTaskList: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModalAddTaskList, closeModalAddTaskList } = modalAddTaskListSlice.actions;
const modalAddTaskListReducer = modalAddTaskListSlice.reducer;
export default modalAddTaskListReducer;
