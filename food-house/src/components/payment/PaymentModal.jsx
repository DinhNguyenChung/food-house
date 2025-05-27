import React from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

const PaymentModal = ({ show, handleClose, remainingTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
        
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 text-green-500">
            <FaCheckCircle className="w-full h-full" />
          </div>
          <h3 className="text-xl font-bold mb-2">Đã gọi thanh toán</h3>
          <p className="text-gray-600 mb-4">
            Nhân viên của chúng tôi sẽ đến bàn của bạn trong thời gian sớm nhất. Vui lòng chờ trong:
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatTime(remainingTime)}
          </div>
          <p className="text-sm text-gray-500">
            Bạn không thể gọi lại cho đến khi hết thời gian chờ
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;