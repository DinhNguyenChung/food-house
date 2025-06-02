import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import StaffForm from "./StaffForm";
import { getAllUsers, updateUser, registerUser, resetUpdateSuccess } from "../../redux/slices/authSlice";

// Department mapping for display
const departmentMap = {
  SERVER: "Phục vụ",
  MANAGER: "Quản lý",
  KITCHEN: "Bếp",
  CASHIER: "Thu ngân"
};

// WorkStatus mapping for display
const statusMap = {
  WORKING: "active",
  RESIGNED: "inactive"
};

const StaffManagement = ({ onBack }) => {
  const dispatch = useDispatch();
  const { users, loading, error, updateSuccess } = useSelector(state => state.auth);
  
  const [filteredStaff, setFilteredStaff] = useState([]);
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

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Show notification when update is successful
  useEffect(() => {
    if (updateSuccess) {
      showNotification(
        currentStaff ? "Cập nhật thông tin nhân viên thành công!" : "Thêm nhân viên mới thành công!", 
        "success"
      );
      setShowStaffForm(false);
      setCurrentStaff(null);
      dispatch(resetUpdateSuccess());
    }
  }, [updateSuccess, currentStaff, dispatch]);

  // Show error notification if there's an error
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
    }
  }, [error]);

  // Transform API data for display
    const transformedUsers = useMemo(() => {
        return users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: departmentMap[user.department] || user.department,
          status: statusMap[user.workStatus] || "inactive",
          startDate: user.startDate,
          endDate: user.endDate,
          // Store original values for API updates
          _original: {
            department: user.department,
            workStatus: user.workStatus
          }
        }));
  }, [users]);

  // Filter and sort staff when any filter/sort parameter changes
  useEffect(() => {
    let result = [...transformedUsers];
    
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
  }, [transformedUsers, searchTerm, filterRole, filterStatus, sortField, sortDirection]);

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

  // Convert UI data to API format
  const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  // Lấy ISO format và bỏ phần milliseconds + timezone
  return date.toISOString().split(".")[0]; // "2025-06-02T00:00:00"
};

const convertToApiFormat = (staffData) => {
  const departmentKey = Object.entries(departmentMap)
    .find(([, value]) => value === staffData.department)?.[0] || staffData.department;
  
  const workStatus = staffData.status === "active" ? "WORKING" : "RESIGNED";

  return {
    name: staffData.name,
    email: staffData.email,
    phone: staffData.phone,
    role: staffData.role,
    department: departmentKey,
    workStatus: workStatus,
    password: staffData.password, // Optional
    startDate: formatDateTime(staffData.startDate),
    endDate: formatDateTime(staffData.endDate)
  };
};


const handleSaveStaff = (staffData) => {
  const apiData = convertToApiFormat(staffData);
  console.log("API Data to save:", apiData);
  
  if (currentStaff) {
    console.log("Updating staff with ID:", currentStaff.id);
    dispatch(updateUser({
      id: currentStaff.id,
      userData: apiData
    }))
    .unwrap()
    .then(result => {
      console.log("Update success:", result);
      // Form will be closed by the useEffect that watches updateSuccess
    })
    .catch(err => {
      console.error("Update error:", err);
    });
  } else {
    console.log("Registering new staff");
    dispatch(registerUser(apiData))
    .unwrap()
    .then(result => {
      console.log("Register success:", result);
      // Form will be closed by the useEffect that watches updateSuccess
       setShowStaffForm(false);
        setCurrentStaff(null);
        dispatch(getAllUsers()); // Refresh data
    })
    .catch(err => {
      console.error("Register error:", err);
    });
  }
};

  // Handle delete staff
  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    showNotification("API for delete is not implemented yet.", "error");
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
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
useEffect(() => {
  if (updateSuccess) {
    // Refresh the data after a successful update or registration
    dispatch(getAllUsers());
  }
}, [updateSuccess, dispatch]);

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

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        </div>
      )}

      {/* Staff table */}
      {!loading && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
             <div className="max-h-[50vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
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
        </div>
      )}

      {/* Staff Form Modal */}
      {showStaffForm && (
        <StaffForm
          staff={currentStaff}
          onClose={handleCloseStaffForm}
          onSave={handleSaveStaff}
          departments={Object.values(departmentMap)}
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