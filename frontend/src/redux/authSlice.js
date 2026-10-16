import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { loading: false, authReady: false, user: null, isResume: false },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setAuthReady: (state, action) => { state.authReady = action.payload; },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isResume = Boolean(action.payload?.profile?.resume);
    },
    setIsResume: (state, action) => { state.isResume = action.payload; },
  },
});

export const { setLoading, setAuthReady, setUser, setIsResume } = authSlice.actions;
export default authSlice.reducer;
