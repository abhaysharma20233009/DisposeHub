import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateWallet: (state, action) => {
      if (state.user) {
        state.user.walletBalance = action.payload;
      }
    },
  },
});

export const { loginSuccess, logout, updateWallet } = authSlice.actions;
export default authSlice.reducer;
