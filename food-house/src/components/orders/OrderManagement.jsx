import React, { useState, useEffect } from "react";
import { 
  FaArrowLeft, 
  FaSearch,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaBan
} from "react-icons/fa";
import OrderDetail from "./OrderDetail";

// Dữ liệu mẫu cho các bàn
const sampleTables = [
  { id: 1, status: "occupied", customerName: "Nguyễn Văn A", orderAmount: 350000, items: 4, timeElapsed: "00:45" },
  { id: 2, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" },
  { id: 3, status: "occupied", customerName: "Trần Thị B", orderAmount: 520000, items: 6, timeElapsed: "01:20" },
  { id: 4, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" },
  { id: 5, status: "occupied", customerName: "Lê Văn C", orderAmount: 180000, items: 2, timeElapsed: "00:15" },
  { id: 6, status: "occupied", customerName: "Phạm Thị D", orderAmount: 425000, items: 5, timeElapsed: "00:55" },
  { id: 7, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" },
  { id: 8, status: "occupied", customerName: "Hoàng Văn E", orderAmount: 295000, items: 3, timeElapsed: "00:30" },
  { id: 9, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" },
  { id: 10, status: "occupied", customerName: "Đỗ Thị F", orderAmount: 630000, items: 7, timeElapsed: "01:45" },
  { id: 11, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" },
  { id: 12, status: "occupied", customerName: "Ngô Văn G", orderAmount: 410000, items: 4, timeElapsed: "01:05" },
];

const OrderManagement = ({ onBack }) => {
  const [tables, setTables] = useState(sampleTables);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTables, setFilteredTables] = useState(tables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, occupied, available
  const [showEmptyTableMessage, setShowEmptyTableMessage] = useState(false);

  // Filter tables based on search and status
  useEffect(() => {
    let result = tables;
    
    if (searchTerm) {
      result = result.filter(table => 
        table.id.toString().includes(searchTerm) ||
        (table.customerName && table.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterStatus !== "all") {
      result = result.filter(table => table.status === filterStatus);
    }
    
    setFilteredTables(result);
  }, [searchTerm, tables, filterStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
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
      }, 3000); // Tự động ẩn thông báo sau 3 giây
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
  };

  const handlePayment = (tableId) => {
    // Handle payment logic here
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status: "available", customerName: null, orderAmount: 0, items: 0, timeElapsed: "00:00" }
          : table
      )
    );
    setShowOrderDetail(false);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Quản lý hóa đơn</h1>
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

      {/* Tables grid */}
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

      {/* Order detail modal */}
      {showOrderDetail && selectedTable && (
        <OrderDetail 
          table={selectedTable}
          onClose={handleCloseOrderDetail}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
};

export default OrderManagement;