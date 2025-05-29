import React, { useState, useEffect } from "react";
import { 
  FaArrowLeft, 
  FaSearch, 
  FaTimes, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter, 
  FaSort, 
  FaCheck, 
  FaExclamationTriangle 
} from "react-icons/fa";
import StaffForm from "./StaffForm";

// Dữ liệu mẫu nhân viên
const sampleStaffData = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@foodhouse.com", phone: "0901234567", role: "ADMIN", department: "Quản lý", startDate: "2022-01-15", status: "active" },
  { id: 2, name: "Trần Thị B", email: "tranthib@foodhouse.com", phone: "0912345678", role: "STAFF", department: "Phục vụ", startDate: "2022-02-20", status: "active" },
  { id: 3, name: "Lê Văn C", email: "levanc@foodhouse.com", phone: "0923456789", role: "STAFF", department: "Bếp", startDate: "2022-03-10", status: "active" },
  { id: 4, name: "Phạm Thị D", email: "phamthid@foodhouse.com", phone: "0934567890", role: "STAFF", department: "Thu ngân", startDate: "2022-04-05", status: "inactive" },
  { id: 5, name: "Hoàng Văn E", email: "hoangvane@foodhouse.com", phone: "0945678901", role: "STAFF", department: "Phục vụ", startDate: "2022-05-12", status: "active" },
  { id: 6, name: "Đỗ Thị F", email: "dothif@foodhouse.com", phone: "0956789012", role: "STAFF", department: "Bếp", startDate: "2022-06-18", status: "active" },
  { id: 7, name: "Ngô Văn G", email: "ngovang@foodhouse.com", phone: "0967890123", role: "STAFF", department: "Phục vụ", startDate: "2022-07-22", status: "inactive" },
  { id: 8, name: "Vũ Thị H", email: "vuthih@foodhouse.com", phone: "0978901234", role: "ADMIN", department: "Quản lý", startDate: "2022-08-30", status: "active" },
];

const StaffManagement = ({ onBack }) => {
  const [staffList, setStaffList] = useState(sampleStaffData);
  const [filteredStaff, setFilteredStaff] = useState(staffList);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Filter and sort staff when any filter/sort parameter changes
  useEffect(() => {
    let result = [...staffList];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)
      );
    }
    
    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter(staff => staff.role === filterRole);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(staff => staff.status === filterStatus);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStaff(result);
  }, [staffList, searchTerm, filterRole, filterStatus, sortField, sortDirection]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle add/edit staff
  const handleAddStaff = () => {
    setCurrentStaff(null);
    setShowStaffForm(true);
  };

  const handleEditStaff = (staff) => {
    setCurrentStaff(staff);
    setShowStaffForm(true);
  };

  const handleCloseStaffForm = () => {
    setShowStaffForm(false);
    setCurrentStaff(null);
  };

  const handleSaveStaff = (staffData) => {
    if (currentStaff) {
      // Update existing staff
      setStaffList(prevStaff => 
        prevStaff.map(staff => 
          staff.id === currentStaff.id ? { ...staffData, id: staff.id } : staff
        )
      );
      showNotification("Cập nhật thông tin nhân viên thành công!", "success");
    } else {
      // Add new staff
      const newStaff = {
        ...staffData,
        id: staffList.length > 0 ? Math.max(...staffList.map(s => s.id)) + 1 : 1
      };
      setStaffList(prevStaff => [...prevStaff, newStaff]);
      showNotification("Thêm nhân viên mới thành công!", "success");
    }
    
    setShowStaffForm(false);
    setCurrentStaff(null);
  };

  // Handle delete staff
  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setStaffList(prevStaff => prevStaff.filter(staff => staff.id !== staffToDelete.id));
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
    showNotification("Đã xóa nhân viên thành công!", "success");
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
  };

  // Notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-5 right-5 p-4 rounded shadow-md z-50 animate-fade-in-down ${
          notification.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" :
          notification.type === "error" ? "bg-red-100 border-l-4 border-red-500 text-red-700" :
          "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
        }`}>
          <div className="flex items-center">
            {notification.type === "success" ? <FaCheck className="mr-2" /> : 
             notification.type === "error" ? <FaExclamationTriangle className="mr-2" /> : null}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Quản lý nhân viên</h1>
          <button
            onClick={handleAddStaff}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Thêm nhân viên
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FaSearch className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-50 text-neutral-800 placeholder-neutral-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-4"
                onClick={clearSearch}
              >
                <FaTimes className="text-neutral-500 hover:text-neutral-700" />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Nhân viên</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="inactive">Đã nghỉ việc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Họ tên
                    {sortField === "name" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === "email" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Vai trò
                    {sortField === "role" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center">
                    Bộ phận
                    {sortField === "department" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        staff.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {staff.role === 'ADMIN' ? 'Admin' : 'Nhân viên'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(staff)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy nhân viên phù hợp với tiêu chí tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Form Modal */}
      {showStaffForm && (
        <StaffForm
          staff={currentStaff}
          onClose={handleCloseStaffForm}
          onSave={handleSaveStaff}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="mb-6 text-gray-700">
              Bạn có chắc chắn muốn xóa nhân viên <span className="font-semibold">{staffToDelete?.name}</span>? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;