import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CallStaffModal = ({ show, handleClose }) => {
  const [reason, setReason] = useState("");

  const handleSendRequest = () => {
    console.log("Lý do gọi nhân viên:", reason);
    setReason("");
    handleClose();
  };

  if (!show) return null;

  return (
   <div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen px-4">
    <div className="fixed inset-0 bg-neutral-800/60 transition-opacity" onClick={handleClose}></div>
    
    <div className="bg-white rounded-lg shadow-soft w-full max-w-md relative z-10">
      <div className="flex justify-between items-center p-5 border-b border-neutral-200">
        <h3 className="text-xl font-semibold text-neutral-800">Gọi nhân viên</h3>
        <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-700">
          <FaTimes size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block mb-2 font-medium text-neutral-700">Lý do gọi nhân viên</label>
          <input
            type="text"
            placeholder="Ví dụ: Lấy thêm bát đũa, dọn bàn..."
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-neutral-50"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-neutral-700">Chọn nhanh lý do</label>
          <div className="space-y-3">
            {["Gọi thêm món", "Bổ sung dụng cụ ăn uống", "Thanh toán", "Yêu cầu khác"].map((text) => (
              <button
                key={text}
                className="w-full p-3 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-700 transition-colors"
                onClick={() => setReason(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-neutral-200">
        <button
          className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          onClick={handleSendRequest}
        >
          Gửi yêu cầu
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default CallStaffModal;