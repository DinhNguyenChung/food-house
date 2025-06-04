import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tableApi } from '../../api/tableApi';

// Async thunks
export const getAllTables = createAsyncThunk(
  'tables/getAllTables',
  async (_, { rejectWithValue }) => {
    try {
      const data = await tableApi.getAllTables();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách bàn."
      );
    }
  }
);

export const createTable = createAsyncThunk(
  'tables/createTable',
  async (tableData, { rejectWithValue }) => {
    try {
      const data = await tableApi.createTable(tableData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tạo bàn mới."
      );
    }
  }
);

export const updateTableStatus = createAsyncThunk(
  'tables/updateTableStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const data = await tableApi.updateTableStatus(id, statusData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật trạng thái bàn."
      );
    }
  }
);

const initialState = {
  tables: [],
  loading: false,
  error: null,
  success: false
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    clearTableErrors: (state) => {
      state.error = null;
    },
    resetTableSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllTables
      .addCase(getAllTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(getAllTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // createTable
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
        state.success = true;
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // updateTableStatus
      .addCase(updateTableStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearTableErrors, resetTableSuccess } = tableSlice.actions;
export default tableSlice.reducer;