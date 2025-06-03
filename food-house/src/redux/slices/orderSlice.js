import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../../api/orderApi";

// Async thunks
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderApi.getAllOrders();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách đơn hàng."
      );
    }
  }
);

export const getOrdersByStatus = createAsyncThunk(
  "order/getOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const data = await orderApi.getOrdersByStatus(status);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Không thể lấy đơn hàng với trạng thái ${status}.`
      );
    }
  }
);

export const getOrdersByTable = createAsyncThunk(
  "order/getOrdersByTable",
  async (tableId, { rejectWithValue }) => {
    try {
      const data = await orderApi.getOrdersByTable(tableId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Không thể lấy đơn hàng cho bàn ${tableId}.`
      );
    }
  }
);

export const getRecentOrders = createAsyncThunk(
  "order/getRecentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderApi.getRecentOrders();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy đơn hàng gần đây."
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderApi.getOrderById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Không thể lấy thông tin đơn hàng có ID ${id}.`
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderApi.createOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tạo đơn hàng mới."
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const data = await orderApi.updateOrderStatus(id, statusData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật trạng thái đơn hàng."
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể xóa đơn hàng."
      );
    }
  }
);

export const calculateRevenue = createAsyncThunk(
  "order/calculateRevenue",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await orderApi.calculateRevenue(startDate, endDate);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tính toán doanh thu."
      );
    }
  }
);

export const getTopOrderedItems = createAsyncThunk(
  "order/getTopOrderedItems",
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderApi.getTopOrderedItems();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách món ăn phổ biến."
      );
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  ordersByTable: {},
  recentOrders: [],
  loading: false,
  error: null,
  success: false,
  revenue: null,
  topItems: []
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    resetSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllOrders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getOrdersByStatus
      .addCase(getOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getOrdersByTable
      .addCase(getOrdersByTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByTable.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersByTable[action.meta.arg] = action.payload;
      })
      .addCase(getOrdersByTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getRecentOrders
      .addCase(getRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(getRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getOrderById
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        if (state.recentOrders.length > 0) {
          state.recentOrders.unshift(action.payload);
        }
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
        
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        
        if (state.recentOrders.length > 0) {
          state.recentOrders = state.recentOrders.map(order => 
            order.id === action.payload.id ? action.payload : order
          );
        }
        
        state.success = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // deleteOrder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        
        if (state.recentOrders.length > 0) {
          state.recentOrders = state.recentOrders.filter(order => order.id !== action.payload);
        }
        
        state.success = true;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // calculateRevenue
      .addCase(calculateRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(calculateRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getTopOrderedItems
      .addCase(getTopOrderedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopOrderedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.topItems = action.payload;
      })
      .addCase(getTopOrderedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearOrderErrors, 
  resetOrderSuccess, 
  resetSelectedOrder 
} = orderSlice.actions;

export default orderSlice.reducer;