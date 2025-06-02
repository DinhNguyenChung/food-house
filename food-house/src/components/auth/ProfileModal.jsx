import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaUserAlt, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaKey, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { changePassword } from "../../redux/slices/authSlice";

const ProfileModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const userData = user?.user || user || {}; // Handle nested structure if exists

  const [activeTab, setActiveTab] = useState("info");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    dispatch(changePassword({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      email: userData.email
    }))
    .unwrap()
    .then(() => {
      setNotification({
        show: true,
        message: "Đổi mật khẩu thành công!",
        type: "success"
      });
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    })
    .catch((err) => {
      setNotification({
        show: true,
        message: err || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
        type: "error"
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === "info" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === "password" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("password")}
          >
            Đổi mật khẩu
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-lg ${
              notification.type === "success" 
                ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            }`}>
              <div className="flex items-center">
                {notification.type === "success" 
                  ? <FaCheck className="mr-3" /> 
                  : <FaExclamationTriangle className="mr-3" />}
                <span>{notification.message}</span>
              </div>
            </div>
          )}
          
          {/* Personal Information Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-5xl">
                  {userData.name?.charAt(0).toUpperCase() || <FaUserAlt />}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Họ tên</div>
                  <div className="flex items-center text-gray-800">
                    <FaUserAlt className="mr-3 text-gray-400" />
                    <span className="text-lg">{userData.name || "N/A"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="flex items-center text-gray-800">
                    <FaEnvelope className="mr-3 text-gray-400" />
                    <span className="text-lg">{userData.email || "N/A"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Số điện thoại</div>
                  <div className="flex items-center text-gray-800">
                    <FaPhone className="mr-3 text-gray-400" />
                    <span className="text-lg">{userData.phone || "N/A"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Vai trò</div>
                  <div className="flex items-center text-gray-800">
                    <FaUserAlt className="mr-3 text-gray-400" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {userData.role === "ADMIN" ? "Quản lý" : "Nhân viên"}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Bộ phận</div>
                  <div className="flex items-center text-gray-800">
                    <FaBuilding className="mr-3 text-gray-400" />
                    <span className="text-lg">
                      {userData.department === "SERVER" ? "Phục vụ" : 
                       userData.department === "MANAGER" ? "Quản lý" :
                       userData.department === "KITCHEN" ? "Bếp" :
                       userData.department === "CASHIER" ? "Thu ngân" :
                       userData.department || "N/A"}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Trạng thái</div>
                  <div className="flex items-center text-gray-800">
                    <FaCalendarAlt className="mr-3 text-gray-400" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.workStatus === "WORKING" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {userData.workStatus === "WORKING" ? "Đang làm việc" : "Đã nghỉ việc"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Ngày bắt đầu</div>
                  <div className="flex items-center text-gray-800">
                    <FaCalendarAlt className="mr-3 text-gray-400" />
                    <span className="text-lg">{formatDate(userData.startDate)}</span>
                  </div>
                </div>
                
                {userData.endDate && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Ngày kết thúc</div>
                    <div className="flex items-center text-gray-800">
                      <FaCalendarAlt className="mr-3 text-gray-400" />
                      <span className="text-lg">{formatDate(userData.endDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Password Change Tab */}
          {activeTab === "password" && (
            <form onSubmit={handleSubmitPasswordChange} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;