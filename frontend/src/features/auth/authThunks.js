import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest } from "../../api/authApi";

const extractAuthPayload = (response) => ({
  token:
    response?.data?.token ||
    response?.token ||
    response?.accessToken ||
    response?.jwt ||
    null,
  user: response?.data?.user || response?.user || null
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerRequest(formData);
      const payload = extractAuthPayload(response);
      if (!payload.token) {
        return rejectWithValue("Registration succeeded but token was not returned.");
      }
      return payload;
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed.";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await loginRequest(formData);
      const payload = extractAuthPayload(response);
      if (!payload.token) {
        return rejectWithValue("Login failed: token missing in response.");
      }
      return payload;
    } catch (error) {
      const message = error?.response?.data?.message || "Invalid email or password.";
      return rejectWithValue(message);
    }
  }
);
