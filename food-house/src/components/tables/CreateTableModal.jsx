import React, { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const CreateTableModal = ({ show, handleClose, onCreateTable }) => {
  const [formData, setFormData] = useState({
    status: "AVAILABLE",
    customerName: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Tạo bàn mới thông qua props callback
    onCreateTable(formData);
    
    // Reset loading state sau 1s để đảm bảo UX mượt mà
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-neutral-800/60 transition-opacity" onClick={handleClose}></div>
        
        <div className="bg-white rounded-lg shadow-soft w-full max-w-md relative z-10">
          <div className="flex justify-between items-center p-5 border-b border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-800">Thêm bàn mới</h3>
            <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-700">
              <FaTimes size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AVAILABLE">Trống</option>
                  <option value="RESERVED">Đã đặt</option>
                  <option value="IN_USE">Đang sử dụng</option>
                </select>
              </div>
              
              {(formData.status === "RESERVED" || formData.status === "IN_USE") && (
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Tên khách hàng</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Nhập tên khách hàng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.status !== "AVAILABLE"}
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                Tạo bàn mới sẽ tự động được gán ID tiếp theo trong hệ thống.
              </p>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                disabled={loading || (formData.status !== "AVAILABLE" && !formData.customerName.trim())}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : "Tạo bàn"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;