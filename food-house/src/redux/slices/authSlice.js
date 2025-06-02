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
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách người dùng."
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể đổi mật khẩu. Vui lòng thử lại."
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const data = await authApi.updateUser(id, userData);
      // Nếu đang cập nhật user hiện tại đang đăng nhập, cập nhật lại localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.id === id) {
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật thông tin người dùng."
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
  users: [],
  passwordChangeSuccess: false,
  updateSuccess: false,
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
      state.passwordChangeSuccess = false;
      state.error = null;
    },
     resetUpdateSuccess: (state) => {
    state.updateSuccess = false;
  }
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
        // Add this line to set updateSuccess
        state.updateSuccess = true;
        // Add the new user to the users array
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })
      // Get all users reducers
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change password reducers
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeSuccess = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.passwordChangeSuccess = false;
      })
      // Update user reducers
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        // Cập nhật user hiện tại nếu đó là user đang đăng nhập
        if (state.user && state.user.id === action.payload.id) {
          state.user = action.payload;
        }
        // Cập nhật trong danh sách users nếu đã có
        if (state.users.length > 0) {
          state.users = state.users.map(user => 
            user.id === action.payload.id ? action.payload : user
          );
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { 
  logout, 
  clearErrors, 
  resetRegistration, 
  resetPasswordChange,
  resetUpdateSuccess ,
} = authSlice.actions;

export default authSlice.reducer;
