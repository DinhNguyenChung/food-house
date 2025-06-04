import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tables';

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

export const tableApi = {
  // Lấy tất cả bàn
  getAllTables: async () => {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      console.error("Get all tables error:", error.response?.data);
      throw error;
    }
  },

  // Tạo bàn mới
  createTable: async (tableData) => {
    try {
      const response = await api.post('', tableData);
      return response.data;
    } catch (error) {
      console.error("Create table error:", error.response?.data);
      throw error;
    }
  },

  // Cập nhật trạng thái bàn
  updateTableStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error("Update table status error:", error.response?.data);
      throw error;
    }
  }
};