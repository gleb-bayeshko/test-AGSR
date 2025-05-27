import { createSlice } from "@reduxjs/toolkit";

interface LoadingOverlayState {
  isVisible: boolean;
}

const initialState: LoadingOverlayState = {
  isVisible: false,
};

const loadingOverlaySlice = createSlice({
  name: "loadingOverlay",
  initialState,
  reducers: {
    showLoadingOverlay: (state) => {
      state.isVisible = true;
    },
    hideLoadingOverlay: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showLoadingOverlay, hideLoadingOverlay } =
  loadingOverlaySlice.actions;
const loadingOverlayReducer = loadingOverlaySlice.reducer;
export default loadingOverlayReducer;
