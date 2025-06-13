import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};

const initialState = {
  isAuthenticated: !!sessionStorage.getItem("token"),
  isLoading: false,
  user: getStoredUser(),
  token: sessionStorage.getItem("token") || null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token || sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unauthorized");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    },
    resetTokenAndCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user, success = true } = action.payload;

        state.isLoading = false;
        state.isAuthenticated = success;
        state.user = success ? user : null;
        state.token = token;

        if (token && user) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;

        if (action.payload.success) {
          sessionStorage.setItem("token", action.payload.token);
          sessionStorage.setItem("user", JSON.stringify(action.payload.user));
          state.token = action.payload.token;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;

        if (action.payload === "Unauthorized") {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
        }
      });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;
