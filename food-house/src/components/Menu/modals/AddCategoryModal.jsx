import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { createCategory } from "../../../redux/slices/menuSlice";

const AddCategoryModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.menu);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: ""
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  useEffect(() => {
    if (success) {
      setNotification({
        show: true,
        message: "Thêm danh mục mới thành công!",
        type: "success"
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        image: ""
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
        message: typeof error === "string" ? error : "Thêm danh mục thất bại. Vui lòng thử lại.",
        type: "error"
      });
    }
  }, [error]);
  
  if (!show) return null;
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên danh mục";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả danh mục";
    }
    
if (!formData.image) {
      newErrors.image = "Vui lòng nhập URL hình ảnh";
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "URL hình ảnh không hợp lệ";
      }
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
      dispatch(createCategory(formData));
    }
  };
  
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Thêm danh mục mới</h2>
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
            <div className="space-y-6">
              {/* Tên danh mục */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  placeholder="Nhập tên danh mục"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* URL hình ảnh */}
              <div>
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
                <div className="flex justify-center">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg h-24`}
                  placeholder="Nhập mô tả danh mục"
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
                ) : "Thêm danh mục"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;