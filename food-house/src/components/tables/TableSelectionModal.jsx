import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const TableSelectionModal = ({ show, handleClose, onSelectTable }) => {
  console.log("Modal show status:", show);
  const [tables, setTables] = useState(
    Array(20)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        status: Math.random() > 0.7 ? (Math.random() > 0.5 ? "reserved" : "inUse") : "available",
        name: "",
      }))
  );

  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleTableClick = (table) => {
    if (table.status === "available") {
      setSelectedTable(table);
      setShowNameInput(true);
    }
  };

  const handleSave = () => {
    if (selectedTable && customerName.trim()) {
      const updatedTables = tables.map((table) =>
        table.id === selectedTable.id
          ? { ...table, status: "reserved", name: customerName }
          : table
      );
      setTables(updatedTables);
      
      onSelectTable({
        tableId: selectedTable.id,
        customerName: customerName
      });
      
      setSelectedTable(null);
      setCustomerName("");
      setShowNameInput(false);
      handleClose();
    }
  };

  const handleCancel = () => {
    setSelectedTable(null);
    setCustomerName("");
    setShowNameInput(false);
  };

  const getTableClassName = (table) => {
    let className = "rounded-lg p-3 h-20 flex flex-col items-center justify-center transition-all";
    
    if (table.status === "available") 
      className += " bg-blue-50 text-blue-800 border-2 border-transparent cursor-pointer hover:-translate-y-1";
    if (table.status === "reserved") 
      className += " bg-amber-50 text-amber-800 cursor-not-allowed";
    if (table.status === "inUse") 
      className += " bg-red-50 text-red-800 cursor-not-allowed";
    if (selectedTable && selectedTable.id === table.id) 
      className += " border-2 border-blue-500 transform scale-105 shadow-md";
    
    return className;
  };

  const getTableStatusText = (status) => {
    switch(status) {
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
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`
                    rounded-lg p-4 h-24 flex flex-col items-center justify-center transition-all
                    ${table.status === "available" ? "bg-blue-50 text-primary border-2 border-transparent cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""}
                    ${table.status === "reserved" ? "bg-amber-50 text-secondary cursor-not-allowed" : ""}
                    ${table.status === "inUse" ? "bg-red-50 text-red-500 cursor-not-allowed" : ""}
                    ${selectedTable && selectedTable.id === table.id ? "border-2 border-primary shadow-md" : ""}
                  `}
                  onClick={() => handleTableClick(table)}
                >
                  <div className="font-bold text-lg">{table.id}</div>
                  <div className="text-xs">{getTableStatusText(table.status)}</div>
                  {table.name && (
                    <div className="text-xs truncate w-full text-center">{table.name}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) :(
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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleSave}
                  disabled={!customerName.trim()}
                >
                  Xác nhận
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