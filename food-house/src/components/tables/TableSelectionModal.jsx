import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { getAllTables, updateTableStatus } from "../../redux/slices/tableSlice";

const TableSelectionModal = ({ show, handleClose, onSelectTable }) => {
  const dispatch = useDispatch();
  const { tables, loading, error } = useSelector(state => state.tables);
  
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Fetch tables khi modal mở
  useEffect(() => {
    if (show) {
      dispatch(getAllTables());
    }
  }, [dispatch, show]);

  // Hiển thị thông báo lỗi nếu có
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

  // Chuyển đổi từ TableStatus enum của backend sang trạng thái UI
  const mapBackendStatusToUI = (status) => {
    switch(status) {
      case "AVAILABLE": return "available";
      case "RESERVED": return "reserved";
      case "IN_USE": return "inUse";
      default: return "available";
    }
  };

  const handleTableClick = (table) => {
    const uiStatus = mapBackendStatusToUI(table.status);
    if (uiStatus === "available") {
      setSelectedTable(table);
      setShowNameInput(true);
    }
  };

  const handleSave = () => {
    if (selectedTable && customerName.trim()) {
      // Cập nhật trạng thái bàn thông qua API
      const statusData = {
        status: "RESERVED",
        customerName: customerName
      };
      
      dispatch(updateTableStatus({ id: selectedTable.id, statusData }))
        .unwrap()
        .then(() => {
          // Trả về thông tin bàn cho component cha
          onSelectTable({
            tableId: selectedTable.id,
            customerName: customerName
          });
          
          // Reset form và đóng modal
          setSelectedTable(null);
          setCustomerName("");
          setShowNameInput(false);
          handleClose();
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

  const handleCancel = () => {
    setSelectedTable(null);
    setCustomerName("");
    setShowNameInput(false);
  };

  const getTableClassName = (table) => {
    const uiStatus = mapBackendStatusToUI(table.status);
    let className = "rounded-lg p-4 h-24 flex flex-col items-center justify-center transition-all";
    
    if (uiStatus === "available") 
      className += " bg-blue-50 text-primary border-2 border-transparent cursor-pointer hover:-translate-y-0.5 hover:shadow-md";
    if (uiStatus === "reserved") 
      className += " bg-amber-50 text-secondary cursor-not-allowed";
    if (uiStatus === "inUse") 
      className += " bg-red-50 text-red-500 cursor-not-allowed";
    if (selectedTable && selectedTable.id === table.id) 
      className += " border-2 border-primary shadow-md";
    
    return className;
  };

  const getTableStatusText = (status) => {
    const uiStatus = mapBackendStatusToUI(status);
    switch(uiStatus) {
      case "available": return "Trống";
      case "reserved": return "Đã đặt";
      case "inUse": return "Đang sử dụng";
      default: return "";
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-neutral-800/60 transition-opacity" onClick={handleClose}></div>
        
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-60 p-4 rounded-lg shadow-lg ${
            notification.type === "success" 
              ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
              : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}>
            <p>{notification.message}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-soft w-full max-w-4xl relative z-10">
          <div className="flex justify-between items-center p-5 border-b border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-800">Chọn bàn</h3>
            <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-700">
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {!showNameInput ? (
              <>
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-50 border border-primary mr-2"></div>
                    <span className="text-sm text-neutral-700">Trống</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-50 border border-secondary mr-2"></div>
                    <span className="text-sm text-neutral-700">Đã đặt</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-50 border border-red-500 mr-2"></div>
                    <span className="text-sm text-neutral-700">Đang sử dụng</span>
                  </div>
                </div>
                
                {/* Loading Indicator */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-blue-500 text-3xl" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className={getTableClassName(table)}
                        onClick={() => handleTableClick(table)}
                      >
                        <div className="font-bold text-lg">{table.id}</div>
                        <div className="text-xs">{getTableStatusText(table.status)}</div>
                        {table.customerName && (
                          <div className="text-xs truncate w-full text-center">{table.customerName}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-4">
                <label className="block mb-2 font-medium text-gray-700">Tên khách hàng</label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  autoFocus
                />
                <div className="text-gray-500 text-sm mt-2">
                  Bạn đã chọn bàn số {selectedTable?.id}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            {showNameInput ? (
              <>
                <button 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  onClick={handleCancel}
                >
                  Quay lại
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  onClick={handleSave}
                  disabled={!customerName.trim() || loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : "Xác nhận"}
                </button>
              </>
            ) : (
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                onClick={handleClose}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSelectionModal;