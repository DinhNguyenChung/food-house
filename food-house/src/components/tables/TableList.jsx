import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaSync, FaSpinner, FaCheck, FaTimesCircle, FaPlus } from "react-icons/fa";
import { getAllTables, updateTableStatus, createTable } from "../../redux/slices/tableSlice";
import CreateTableModal from "./CreateTableModal";

const TableList = () => {
  const dispatch = useDispatch();
  const { tables, loading, error } = useSelector(state => state.tables);
  // Lấy thông tin user để kiểm tra role admin
  const auth = useSelector(state => state.auth);
  const user = auth?.user?.user || {};
  const isAdmin = user?.role === "ADMIN";
  
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(getAllTables());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setNotification({
        show: true,
        message: typeof error === "string" ? error : "Lỗi khi tải danh sách bàn. Vui lòng thử lại.",
        type: "error"
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(getAllTables());
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "AVAILABLE": return "bg-green-100 text-green-800";
      case "RESERVED": return "bg-amber-100 text-amber-800";
      case "IN_USE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "AVAILABLE": return "Trống";
      case "RESERVED": return "Đã đặt";
      case "IN_USE": return "Đang sử dụng";
      default: return "Không xác định";
    }
  };

  const resetTable = (tableId) => {
    if (window.confirm("Bạn có chắc muốn đặt lại trạng thái bàn này thành trống?")) {
      const statusData = {
        status: "AVAILABLE",
        customerName: null
      };
      
      dispatch(updateTableStatus({ id: tableId, statusData }))
        .unwrap()
        .then(() => {
          setNotification({
            show: true,
            message: "Đặt lại trạng thái bàn thành công!",
            type: "success"
          });
          
          setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
          }, 3000);
        })
        .catch((err) => {
          setNotification({
            show: true,
            message: typeof err === "string" ? err : "Lỗi khi cập nhật trạng thái bàn. Vui lòng thử lại.",
            type: "error"
          });
          
          setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
          }, 3000);
        });
    }
  };

  const handleCreateTable = (tableData) => {
    dispatch(createTable(tableData))
      .unwrap()
      .then(() => {
        setNotification({
          show: true,
          message: "Tạo bàn mới thành công!",
          type: "success"
        });
        
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
        
        // Đóng modal và refresh danh sách bàn
        setShowCreateModal(false);
        dispatch(getAllTables());
      })
      .catch((err) => {
        setNotification({
          show: true,
          message: typeof err === "string" ? err : "Lỗi khi tạo bàn mới. Vui lòng thử lại.",
          type: "error"
        });
        
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" 
            ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
            : "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Danh sách bàn</h2>
        <div className="flex items-center space-x-2">
          {/* Nút tạo bàn mới - chỉ hiển thị cho admin */}
          {isAdmin && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50 flex items-center"
              title="Thêm bàn mới"
            >
              <FaPlus className="mr-1" />
              <span>Thêm bàn</span>
            </button>
          )}
          <button 
            onClick={handleRefresh}
            className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
            disabled={loading}
            title="Làm mới"
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSync />
            )}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables.length > 0 ? (
                tables.map(table => (
                  <tr key={table.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Bàn {table.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(table.status)}`}>
                        {getStatusText(table.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {table.status !== "AVAILABLE" && (
                        <button 
                          onClick={() => resetTable(table.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Đặt lại trạng thái"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có bàn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo bàn mới */}
      <CreateTableModal 
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onCreateTable={handleCreateTable}
      />
    </div>
  );
};

export default TableList;