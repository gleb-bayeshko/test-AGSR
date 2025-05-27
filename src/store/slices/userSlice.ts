import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: number | null;
  email: string;
}

const initialState: UserState = {
  userId: null,
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return { userId: null, email: "" };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
