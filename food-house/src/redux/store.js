import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';
import tableReducer from './slices/tableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    order: orderReducer,
    tables: tableReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;