import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaArrowLeft, 
  FaSearch,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaBan,
  FaSpinner,
  FaBell
} from "react-icons/fa";
import OrderDetail from "./OrderDetail";
import ConfirmOrderModal from "./ConfirmOrderModal";
import OrderHistoryModal from "./OrderHistoryModal";
import { 
  getAllOrders, 
  clearOrderErrors,
  resetOrderSuccess,
  updateOrderStatus,
  getOrderById
} from "../../redux/slices/orderSlice";
import WebsocketService from '../../services/WebSocketService';
import { Howl } from 'howler';
import { useAuth } from '../../hooks/useAuth';

// Helper để format thời gian
const formatTimeElapsed = (dateString) => {
  if (!dateString) return "00:00";
  
  const createdAt = new Date(dateString);
  const now = new Date();
  const diffInMillis = now - createdAt;
  
  const hours = Math.floor(diffInMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};


const OrderManagement = ({ onBack }) => {
  const dispatch = useDispatch();
  const { orders, loading, error, success } = useSelector(state => state.order);
  
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showEmptyTableMessage, setShowEmptyTableMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState("all");
  const [tables, setTables] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [confirmModal, setConfirmModal] = useState({ open: false, order: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoadingId, setHistoryLoadingId] = useState(null);
  // Get auth state from Redux
    const auth = useSelector(state => state.auth);
    // const isAuthenticated = auth?.isAuthenticated && auth?.user.user;
    const user = auth?.user?.user || {};
  const { isAdmin } = useAuth();
    // Kiểm tra xem có phải là nhân viên có là quản lý hay không
     const isManager = user?.role === "STAFF" && user?.department === "MANAGER";
    // Lấy dữ liệu orders khi component mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Xử lý notification khi có success/error
  useEffect(() => {
    if (success) {
      setNotification({
        show: true,
        message: "Thao tác thành công!",
        type: "success"
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        dispatch(resetOrderSuccess());
      }, 3000);
      
      // Refresh data
      dispatch(getAllOrders());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setNotification({
        show: true,
        message: typeof error === "string" ? error : "Đã xảy ra lỗi. Vui lòng thử lại.",
        type: "error"
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        dispatch(clearOrderErrors());
      }, 3000);
    }
  }, [error, dispatch]);

  // Xử lý orders để tạo danh sách bàn
  useEffect(() => {
    if (orders.length > 0) {
      // Lấy danh sách các bàn duy nhất từ orders
      const uniqueTables = [...new Set(orders.map(order => order.tableId))];
      
      // Tạo danh sách các bàn với thông tin từ orders
      const tablesList = uniqueTables.map(tableId => {
        // Lấy order mới nhất cho bàn này
        const tableOrders = orders
          .filter(order => order.tableId === tableId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const latestOrder = tableOrders[0];
        
        if (latestOrder && (latestOrder.status === "CONFIRMED" || latestOrder.status === "PROCESSING")) {
          return {
            id: tableId,
            status: "occupied",
            customerName: latestOrder.customerName || "Khách hàng",
            orderAmount: latestOrder.totalAmount,
            items: latestOrder.items ? latestOrder.items.length : 0,
            timeElapsed: formatTimeElapsed(latestOrder.createdAt),
            orderId: latestOrder.id
          };
        } else {
          return {
            id: tableId,
            status: "available",
            customerName: null,
            orderAmount: 0,
            items: 0,
            timeElapsed: "00:00"
          };
        }
      });
      
      setTables(tablesList);
    }
  }, [orders]);

  // Cập nhật lịch sử đơn hàng mới nhất (tối đa 5, trạng thái PENDING hoặc CANCELLED)
  useEffect(() => {
    if (orders && orders.length > 0) {
      const sorted = [...orders]
        .filter(o => o.status === "PENDING" || o.status === "CANCELLED")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setOrderHistory(sorted);
    }
  }, [orders]);

  const pendingCount = orderHistory.filter(o => o.status === "PENDING").length;

  // Lọc bàn theo tìm kiếm và trạng thái
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.customerName 
      ? table.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        table.id.toString().includes(searchTerm)
      : table.id.toString().includes(searchTerm);
      
    const matchesStatus = filterStatus === "all" || table.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleTableClick = (table) => {
    if (table.status === "occupied") {
      setSelectedTable(table);
      setShowOrderDetail(true);
    } else {
      // Hiển thị thông báo nếu bàn trống
      setShowEmptyTableMessage(true);
      setTimeout(() => {
        setShowEmptyTableMessage(false);
      }, 3000);
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedTable(null);
  };

  const handlePayment = () => {
    // Sau khi thanh toán, đóng modal và cập nhật lại dữ liệu
    setShowOrderDetail(false);
    setSelectedTable(null);
    
    // Refresh data
    dispatch(getAllOrders());
  };
  // Đăng ký WebSocket để nhận thông báo
  useEffect(() => {
  const setupWebsocket = async () => {
    try {
      await WebsocketService.subscribeToTopic('orders', handleNotification);
      if (isAdmin) {
        await WebsocketService.subscribeToRole('ADMIN', handleNotification);
      }
      if (isManager) {
        await WebsocketService.subscribeToRole('MANAGER', handleNotification);
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket', error);
    }
  };
  setupWebsocket();
  return () => {
    WebsocketService.unsubscribe('orders');
    if (isAdmin) WebsocketService.unsubscribe('role_ADMIN');
    if (isManager) WebsocketService.unsubscribe('role_MANAGER');
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAdmin, isManager]);
// Hàm xử lý khi nhận thông báo
const handleNotification = async (notification) => {
  console.log('Received notification:', notification);
  if (notification.type === 'NEW_ORDER') {
    dispatch(getAllOrders());
    const sound = new Howl({ src: ['/sounds/notification.mp3'], volume: 1.0 });
    sound.play();
    // Only show modal for admin/manager
    if (isAdmin || isManager) {
      try {
        // Fetch order details if not included
        let order = notification.order || notification.data;
        if (!order && notification.data.id) {
          const res = await dispatch(getOrderById(notification.orderId));
          order = res.payload;
        }
        console.log('Order for modal:', notification.data);
        if (order) {
          setConfirmModal({ open: true, order });
          setModalError("");
        } else {
          setModalError("Không thể lấy thông tin đơn hàng mới.");
        }
      } catch {
        setModalError("Không thể lấy thông tin đơn hàng mới.");
      }
    }
  }
};

const handleConfirmOrder = async () => {
  if (!confirmModal.order) return;
  setModalLoading(true);
  setModalError("");
  try {
    await dispatch(updateOrderStatus({ id: confirmModal.order.id, statusData: { status: "CONFIRMED" } })).unwrap();
    setConfirmModal({ open: false, order: null });
  } catch (e) {
    setModalError(e?.message || "Lỗi xác nhận đơn hàng.");
  } finally {
    setModalLoading(false);
  }
};

const handleCancelOrder = async () => {
  if (!confirmModal.order) return;
  setModalLoading(true);
  setModalError("");
  try {
    await dispatch(updateOrderStatus({ id: confirmModal.order.id, statusData: { status: "CANCELLED" } })).unwrap();
    setConfirmModal({ open: false, order: null });
  } catch (e) {
    setModalError(e?.message || "Lỗi hủy đơn hàng.");
  } finally {
    setModalLoading(false);
  }
};

const handleHistoryConfirm = async (order) => {
  setHistoryLoadingId(order.id);
  try {
    await dispatch(updateOrderStatus({ id: order.id, statusData: { status: "CONFIRMED" } })).unwrap();
    setHistoryLoadingId(null);
  } catch {
    setHistoryLoadingId(null);
  }
};

  return (
    <div className="container mx-auto py-6 max-w-7xl">
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
      
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Quản lý đặt bàn</h1>
          {/* Bell notification icon */}
          <div className="relative ml-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-yellow-100 transition-colors focus:outline-none"
              onClick={() => setHistoryModalOpen(true)}
              title="Thông báo đơn mới"
            >
              <FaBell className="text-2xl" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FaSearch className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm bàn hoặc tên khách hàng..."
              className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50 text-neutral-800 placeholder-neutral-500"
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
            <button 
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-3 rounded-lg font-medium ${
                filterStatus === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterStatus("occupied")}
              className={`px-4 py-3 rounded-lg font-medium ${
                filterStatus === "occupied" 
                  ? "bg-blue-600 text-white" 
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Đang sử dụng
            </button>
            <button 
              onClick={() => setFilterStatus("available")}
              className={`px-4 py-3 rounded-lg font-medium ${
                filterStatus === "available" 
                  ? "bg-blue-600 text-white" 
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Trống
            </button>
          </div>
        </div>
      </div>

      {/* Thông báo bàn trống */}
      {showEmptyTableMessage && (
        <div className="fixed top-5 right-5 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md z-50 animate-fade-in-down">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>Bàn này chưa có đơn hàng nào!</span>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="text-blue-500 text-4xl animate-spin" />
        </div>
      )}
      
      {/* Tables grid */}
      {!loading && filteredTables.length === 0 ? (
        <div className="text-center p-8 bg-neutral-50 rounded-lg my-6">
          <p className="text-lg text-neutral-600 mb-4">Không tìm thấy bàn phù hợp</p>
          <button 
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            onClick={clearSearch}
          >
            Xóa tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <div 
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                table.status === "occupied" 
                  ? "border-blue-500 cursor-pointer hover:shadow-lg transition-shadow" 
                  : "border-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Bàn {table.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.status === "occupied" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {table.status === "occupied" ? "Đang sử dụng" : "Trống"}
                </span>
              </div>
              
              {table.status === "occupied" ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Khách hàng:</span>
                      <span className="font-medium">{table.customerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số món:</span>
                      <span className="font-medium">{table.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-medium">{table.timeElapsed}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Tổng tiền:</span>
                      <span className="text-blue-600 font-bold">{table.orderAmount.toLocaleString()}đ</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                  <FaBan className="text-gray-300 text-xl mb-2" />
                  <span>Bàn trống</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      {showOrderDetail && selectedTable && (
        <OrderDetail 
          table={selectedTable}
          orderId={selectedTable.orderId}
          onClose={handleCloseOrderDetail}
          onPayment={handlePayment}
        />
      )}

      {/* Confirm Order Modal for NEW_ORDER notification */}
      <ConfirmOrderModal
        order={confirmModal.order}
        open={confirmModal.open}
        onConfirm={handleConfirmOrder}
        onCancel={handleCancelOrder}
        loading={modalLoading}
        error={modalError}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        open={historyModalOpen}
        orders={orderHistory}
        onClose={() => setHistoryModalOpen(false)}
        onConfirm={handleHistoryConfirm}
        loadingId={historyLoadingId}
      />
    </div>
  );
};

export default OrderManagement;