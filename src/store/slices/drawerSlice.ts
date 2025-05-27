import { createSlice } from "@reduxjs/toolkit";

interface DrawerState {
  isOpen: boolean;
}

const initialState: DrawerState = {
  isOpen: true,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggleDrawer(state) {
      state.isOpen = !state.isOpen;
    },
    openDrawer(state) {
      state.isOpen = true;
    },
    closeDrawer(state) {
      state.isOpen = false;
    },
  },
});

export const { toggleDrawer, openDrawer, closeDrawer } = drawerSlice.actions;
const drawerReducer = drawerSlice.reducer;
export default drawerReducer;
