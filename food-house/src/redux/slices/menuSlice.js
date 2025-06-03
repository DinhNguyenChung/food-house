import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { menuApi } from "../../api/menuApi";

// Async thunks cho danh mục
export const getAllCategories = createAsyncThunk(
  "menu/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await menuApi.getAllCategories();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách danh mục."
      );
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "menu/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await menuApi.getCategoryById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy thông tin danh mục."
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "menu/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await menuApi.createCategory(categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tạo danh mục mới."
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "menu/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const data = await menuApi.updateCategory(id, categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật danh mục."
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "menu/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await menuApi.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể xóa danh mục."
      );
    }
  }
);

// Async thunks cho món ăn
export const getAllMenuItems = createAsyncThunk(
  "menu/getAllMenuItems",
  async (_, { rejectWithValue }) => {
    try {
      const data = await menuApi.getAllMenuItems();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách món ăn."
      );
    }
  }
);

export const searchMenuItems = createAsyncThunk(
  "menu/searchMenuItems",
  async (keyword, { rejectWithValue }) => {
    try {
      const data = await menuApi.searchMenuItems(keyword);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tìm kiếm món ăn."
      );
    }
  }
);

export const getAvailableMenuItems = createAsyncThunk(
  "menu/getAvailableMenuItems",
  async (_, { rejectWithValue }) => {
    try {
      const data = await menuApi.getAvailableMenuItems();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách món ăn khả dụng."
      );
    }
  }
);

export const getMenuItemsByCategory = createAsyncThunk(
  "menu/getMenuItemsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await menuApi.getMenuItemsByCategory(categoryId);
      return { categoryId, items: data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy danh sách món ăn theo danh mục."
      );
    }
  }
);

export const getMenuItemById = createAsyncThunk(
  "menu/getMenuItemById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await menuApi.getMenuItemById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể lấy thông tin món ăn."
      );
    }
  }
);

export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (menuItemData, { rejectWithValue }) => {
    try {
      const data = await menuApi.createMenuItem(menuItemData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể tạo món ăn mới."
      );
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, menuItemData }, { rejectWithValue }) => {
    try {
      const data = await menuApi.updateMenuItem(id, menuItemData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật món ăn."
      );
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id, { rejectWithValue }) => {
    try {
      await menuApi.deleteMenuItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể xóa món ăn."
      );
    }
  }
);

export const updateMenuItemStatus = createAsyncThunk(
  "menu/updateMenuItemStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await menuApi.updateMenuItemStatus(id, status);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Không thể cập nhật trạng thái món ăn."
      );
    }
  }
);

const initialState = {
  categories: [],
  menuItems: [],
  availableMenuItems: [],
  itemsByCategory: {},
  selectedCategory: null,
  selectedMenuItem: null,
  loading: false,
  error: null,
  success: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuErrors: (state) => {
      state.error = null;
    },
    resetMenuSuccess: (state) => {
      state.success = false;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    resetSelectedMenuItem: (state) => {
      state.selectedMenuItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllCategories
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getCategoryById
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        );
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // getAllMenuItems
      .addCase(getAllMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload;
      })
      .addCase(getAllMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // searchMenuItems
      .addCase(searchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload;
      })
      .addCase(searchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAvailableMenuItems
      .addCase(getAvailableMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.availableMenuItems = action.payload;
      })
      .addCase(getAvailableMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMenuItemsByCategory
      .addCase(getMenuItemsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuItemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsByCategory[action.payload.categoryId] = action.payload.items;
      })
      .addCase(getMenuItemsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMenuItemById
      .addCase(getMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMenuItem = action.payload;
      })
      .addCase(getMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createMenuItem
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems.push(action.payload);
        state.success = true;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // updateMenuItem
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = state.menuItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        );
        if (state.availableMenuItems.length > 0) {
          state.availableMenuItems = state.availableMenuItems.map(item => 
            item.id === action.payload.id ? action.payload : item
          );
        }
        state.success = true;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // deleteMenuItem
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = state.menuItems.filter(item => item.id !== action.payload);
        if (state.availableMenuItems.length > 0) {
          state.availableMenuItems = state.availableMenuItems.filter(item => item.id !== action.payload);
        }
        state.success = true;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // updateMenuItemStatus
      .addCase(updateMenuItemStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenuItemStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = state.menuItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        );
        if (state.availableMenuItems.length > 0 && action.payload.status === "AVAILABLE") {
          state.availableMenuItems.push(action.payload);
        } else if (state.availableMenuItems.length > 0) {
          state.availableMenuItems = state.availableMenuItems.filter(item => item.id !== action.payload.id);
        }
        state.success = true;
      })
      .addCase(updateMenuItemStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { 
  clearMenuErrors, 
  resetMenuSuccess, 
  setSelectedCategory,
  resetSelectedMenuItem
} = menuSlice.actions;

export default menuSlice.reducer;