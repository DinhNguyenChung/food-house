import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const ConfirmOrderModal = ({ order, open, onConfirm, onCancel, loading, error }) => {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4 text-center">Xác nhận đơn hàng mới</h2>
        <div className="mb-4">
          <p><span className="font-semibold">Bàn:</span> {order.tableId}</p>
          <p><span className="font-semibold">Khách hàng:</span> {order.customerName || 'Khách hàng'}</p>
          <p><span className="font-semibold">Tổng tiền:</span> {order.totalAmount?.toLocaleString()}đ</p>
          <p><span className="font-semibold">Số món:</span> {order.items?.length}</p>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            <FaCheck /> Xác nhận
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            <FaTimes /> Hủy đơn
          </button>
        </div>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ConfirmOrderModal;
