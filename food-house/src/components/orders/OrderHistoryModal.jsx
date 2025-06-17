import React from "react";
import { FaCheck, FaTimes, FaHistory } from "react-icons/fa";

const OrderHistoryModal = ({ open, orders, onClose, onConfirm, loadingId }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><FaHistory /> Lịch sử đơn mới</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl"><FaTimes /></button>
        </div>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Không có đơn mới nào.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Bàn {order.tableId} - {order.customerName || 'Khách hàng'}</div>
                  <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-sm">Tổng: <span className="font-bold text-blue-600">{order.totalAmount?.toLocaleString()}đ</span></div>
                  <div className="text-xs">Trạng thái: <span className={order.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}>{order.status === 'PENDING' ? 'Chờ xác nhận' : 'Đã hủy'}</span></div>
                </div>
                {order.status === 'PENDING' ? (
                  <button
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                    onClick={() => onConfirm(order)}
                    disabled={loadingId === order.id}
                  >
                    <FaCheck /> Xác nhận
                  </button>
                ) : (
                  <span className="ml-4 px-3 py-1 bg-gray-300 text-gray-600 rounded cursor-not-allowed">Đã hủy</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;
