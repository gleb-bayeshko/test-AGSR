import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalConfirmationState {
  isOpen: boolean;
  text: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const initialState: ModalConfirmationState = {
  isOpen: false,
  text: "Вы точно уверены?",
};

const modalConfirmationSlice = createSlice({
  name: "modalConfirmation",
  initialState,
  reducers: {
    openModalConfirmation: (
      state,
      action: PayloadAction<{
        text?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.text = action.payload.text || "Вы точно уверены?";
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    closeModalConfirmation: (state) => {
      state.isOpen = false;
      state.text = "Вы точно уверены?";
      state.onConfirm = undefined;
      state.onCancel = undefined;
    },
  },
});

export const { openModalConfirmation, closeModalConfirmation } =
  modalConfirmationSlice.actions;
const modalConfirmationReducer = modalConfirmationSlice.reducer;
export default modalConfirmationReducer;
