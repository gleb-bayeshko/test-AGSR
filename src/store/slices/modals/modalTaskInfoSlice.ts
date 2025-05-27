import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "@/utils/types/api";

type UpdatedData = Partial<Task>;

interface ModalTaskInfoState {
  isOpen: boolean;
  data?: Task;
  isLoading?: boolean;  
  onEdit?: (updatedData: UpdatedData) => void;
  onCancel?: () => void;
}

const initialState: ModalTaskInfoState = {
  isOpen: false,
};

const modalTaskInfoSlice = createSlice({
  name: "modalTaskInfo",
  initialState,
  reducers: {
    openModalTaskInfo: (
      state,
      action: PayloadAction<{
        data: Task;
        onEdit?: (updatedData: UpdatedData) => void;
        onCancel?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.data = action.payload.data;
      state.onEdit = action.payload.onEdit;
      state.onCancel = action.payload.onCancel;
    },
    closeModalTaskInfo: (state) => {
      state.isOpen = false;
      state.data = undefined;
      state.onEdit = undefined;
      state.onCancel = undefined;
    },
    updateInfoModalTaskInfo: (state, action: PayloadAction<Task>) => {
      state.data = action.payload;
    },
    setLoadingModalTaskInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openModalTaskInfo,
  closeModalTaskInfo,
  updateInfoModalTaskInfo,
  setLoadingModalTaskInfo,
} = modalTaskInfoSlice.actions;
const modalTaskInfoReducer = modalTaskInfoSlice.reducer;
export default modalTaskInfoReducer;
