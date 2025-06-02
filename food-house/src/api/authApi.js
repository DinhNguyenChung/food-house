// import axios from "axios";

// const API_URL = "http://localhost:8080/api/auth";

// // Create an axios instance with default headers
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add request interceptor to include auth token
// api.interceptors.request.use(config => {
//   const user = localStorage.getItem('user');
//   if (user) {
//     const userData = JSON.parse(user);
//     console.log("User data from localStorage:", userData);
    
//     if (userData.user) {
//       // config.headers.Authorization = `Bearer ${userData.token}`;
//       console.log("Authorization header set:", userData.token);
//     }
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });
// export const authApi = {
//   login: async (credentials) => {
//     const response = await axios.post(`${API_URL}/login`, credentials);
//     return response.data;
//   },

//   register: async (userData) => {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     return response.data;
//   },
//   getAllUsers: async () => {
//     const response = await axios.get(`${API_URL}/users`);
//     return response.data;
//   },

//   changePassword: async (passwordData) => {
//     const response = await axios.put(`${API_URL}/change-password`, passwordData);
//     return response.data;
//   },

//   updateUser: async (id, userData) => {
//     const response = await axios.put(`${API_URL}/users/${id}`, userData);
//     return response.data;
//   },
// };
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Based on your login response structure
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
        console.log("Authorization header set with token");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const authApi = {
  login: async (credentials) => {
    // Use api instance instead of axios directly
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    // Use api instance instead of axios directly
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  getAllUsers: async () => {
    // Use api instance instead of axios directly
    const response = await api.get('/users');
    return response.data;
  },

  changePassword: async (passwordData) => {
    // Use api instance instead of axios directly
    const response = await api.put('/change-password', passwordData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    // Use api instance instead of axios directly
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};