import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaUpload, FaExclamationTriangle, FaSpinner, FaPlus } from "react-icons/fa";
import { createMenuItem, getAllCategories } from "../../../redux/slices/menuSlice";
import AddCategoryModal from "./AddCategoryModal";

const AddMenuItemModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { categories, loading, error, success } = useSelector(state => state.menu);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    categoryId: "",
    status: "AVAILABLE" // Mặc định là có sẵn
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // State for add category modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  // Handlers for add category modal
  const handleOpenAddCategoryModal = () => {
    setShowAddCategoryModal(true);
  };
  
  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    // Refresh categories after adding a new one
    dispatch(getAllCategories());
  };
  
  useEffect(() => {
    if (success) {
      setNotification({
        show: true,
        message: "Thêm món ăn mới thành công!",
        type: "success"
      });
      
      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        categoryId: "",
        status: "AVAILABLE"
      });
      setImagePreview(null);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [success, handleClose]);
  
  useEffect(() => {
    if (error) {
      setNotification({
        show: true,
        message: typeof error === "string" ? error : "Thêm món ăn thất bại. Vui lòng thử lại.",
        type: "error"
      });
    }
  }, [error]);
  
  if (!show) return null;
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên món ăn";
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả món ăn";
    }
    
    if (!formData.image) {
      newErrors.image = "Vui lòng nhập URL hình ảnh";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      image: value
    });
    
    // Set preview
    setImagePreview(value);
    
    // Clear error
    if (errors.image) {
      setErrors({
        ...errors,
        image: ""
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert price to number and categoryId to Long
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId)
      };
      
      dispatch(createMenuItem(menuItemData));
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Thêm món ăn mới</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        {/* Notification */}
        {notification.show && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${
            notification.type === "success" 
              ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
              : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}>
            <p>{notification.message}</p>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên món */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên món <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  placeholder="Nhập tên món ăn"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  placeholder="Nhập giá món ăn"
                  min="0"
                  step="1000"
                  disabled={loading}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              
              {/* Danh mục với nút thêm mới */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`flex-1 p-3 border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    disabled={loading}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleOpenAddCategoryModal}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    disabled={loading}
                    title="Thêm danh mục mới"
                  >
                    <FaPlus className="mr-1" />
                    <span className="hidden sm:inline">Danh mục mới</span>
                  </button>
                </div>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
                )}
              </div>
              
              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled={loading}
                >
                  <option value="AVAILABLE">Có sẵn</option>
                  <option value="SOLDOUT">Hết hàng</option>
                </select>
              </div>
              
              {/* URL hình ảnh */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Hình ảnh <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleImageChange}
                    className={`w-full p-3 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    placeholder="Nhập URL hình ảnh"
                    disabled={loading}
                  />
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="md:col-span-2 flex justify-center">
                  <div className="w-48 h-48 border rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                </div>
              )}
              
              {/* Mô tả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg h-24`}
                  placeholder="Nhập mô tả món ăn"
                  disabled={loading}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </div>
            
            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : "Thêm món"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Add Category Modal */}
      <AddCategoryModal
        show={showAddCategoryModal}
        handleClose={handleCloseAddCategoryModal}
      />
    </div>
  );
};

export default AddMenuItemModal;