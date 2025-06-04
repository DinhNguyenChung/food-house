import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

// Tạo instance axios với headers mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để đính kèm token xác thực
api.interceptors.request.use(config => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const orderApi = {
  // Lấy tất cả đơn hàng
  getAllOrders: async () => {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      console.error("Get all orders error:", error.response?.data);
      throw error;
    }
  },

  // Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (status) => {
    try {
      const response = await api.get(`/status/${status}`);
      return response.data;
    } catch (error) {
      console.error("Get orders by status error:", error.response?.data);
      throw error;
    }
  },

  // Lấy đơn hàng theo bàn
  getOrdersByTable: async (tableId) => {
    try {
      const response = await api.get(`/table/${tableId}`);
      return response.data;
    } catch (error) {
      console.error("Get orders by table error:", error.response?.data);
      throw error;
    }
  },

  // Lấy đơn hàng gần đây
  getRecentOrders: async () => {
    try {
      const response = await api.get('/recent');
      return response.data;
    } catch (error) {
      console.error("Get recent orders error:", error.response?.data);
      throw error;
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get order by id error:", error.response?.data);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post('', orderData);
      return response.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error("Update order status error:", error.response?.data);
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete order error:", error.response?.data);
      throw error;
    }
  },

  // Tính toán doanh thu trong khoảng thời gian
  calculateRevenue: async (startDate, endDate) => {
    try {
      const response = await api.get('/revenue', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Calculate revenue error:", error.response?.data);
      throw error;
    }
  },

  // Lấy top món ăn được đặt nhiều nhất
  getTopOrderedItems: async () => {
    try {
      const response = await api.get('/top-items');
      return response.data;
    } catch (error) {
      console.error("Get top ordered items error:", error.response?.data);
      throw error;
    }
  }
};