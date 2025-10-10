import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  } as { token: string | null },
  reducers: {
    setAuthData: (state, action: PayloadAction<{ token: string }>) => {
      return { ...state, ...action.payload };
    },
    clearAuthData: (state) => {
      state.token = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
