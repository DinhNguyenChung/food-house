import axios from "axios";

const API_URL = "http://localhost:8080/api/menu";

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

export const menuApi = {
  // API cho danh mục
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error("Get categories error:", error.response?.data);
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get category error:", error.response?.data);
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error("Create category error:", error.response?.data);
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Update category error:", error.response?.data);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete category error:", error.response?.data);
      throw error;
    }
  },
  
  // API cho món ăn
  getAllMenuItems: async () => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      console.error("Get menu items error:", error.response?.data);
      throw error;
    }
  },
  
  searchMenuItems: async (keyword) => {
    try {
      const response = await api.get(`/items/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error("Search menu items error:", error.response?.data);
      throw error;
    }
  },
  
  getAvailableMenuItems: async () => {
    try {
      const response = await api.get('/items/available');
      return response.data;
    } catch (error) {
      console.error("Get available menu items error:", error.response?.data);
      throw error;
    }
  },
  
  getMenuItemsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/items`);
      return response.data;
    } catch (error) {
      console.error("Get menu items by category error:", error.response?.data);
      throw error;
    }
  },
  
  getMenuItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get menu item error:", error.response?.data);
      throw error;
    }
  },
  
  createMenuItem: async (menuItemData) => {
    try {
      const response = await api.post('/items', menuItemData);
      return response.data;
    } catch (error) {
      console.error("Create menu item error:", error.response?.data);
      throw error;
    }
  },
  
  updateMenuItem: async (id, menuItemData) => {
    try {
      const response = await api.put(`/items/${id}`, menuItemData);
      return response.data;
    } catch (error) {
      console.error("Update menu item error:", error.response?.data);
      throw error;
    }
  },
  
  deleteMenuItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete menu item error:", error.response?.data);
      throw error;
    }
  },
  
  updateMenuItemStatus: async (id, status) => {
    try {
      const response = await api.patch(`/items/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Update menu item status error:", error.response?.data);
      throw error;
    }
  }
};