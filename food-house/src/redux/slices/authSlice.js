import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      // Lưu thông tin user vào localStorage để duy trì đăng nhập khi refresh
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể đăng nhập. Vui lòng thử lại."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể đăng ký. Vui lòng thử lại."
      );
    }
  }
);

// Khởi tạo state từ localStorage (nếu có)
const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      });
  },
});

export const { logout, clearErrors, resetRegistration } = authSlice.actions;
export default authSlice.reducer;
