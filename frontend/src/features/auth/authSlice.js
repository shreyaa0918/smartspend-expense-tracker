import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authThunks";

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");
let parsedUser = null;

try {
  parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
} catch (_error) {
  localStorage.removeItem("user");
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  token: tokenFromStorage || null,
  isAuthenticated: Boolean(tokenFromStorage),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Registration should not auto-login; user proceeds to login page.
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user || null));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      });
  }
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
