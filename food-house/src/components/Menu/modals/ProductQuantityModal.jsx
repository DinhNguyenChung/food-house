import React, { useState, useEffect } from "react";
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";

const ProductQuantityModal = ({ show, handleClose, item, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(item?.price || 0);

  useEffect(() => {
    if (item) {
      const discountAmount = (item.price * quantity * discount) / 100;
      setTotalPrice(item.price * quantity - discountAmount);
    }
  }, [item, quantity, discount]);

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleDiscountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDiscount(Math.min(100, Math.max(0, value)));
  };

  const handleSubmit = () => {
    const finalPrice = totalPrice;
    addToCart({
      ...item,
      quantity,
      discount,
      note,
      finalPrice,
      totalItemPrice: finalPrice
    });
    handleClose();
    setQuantity(1);
    setDiscount(0);
    setNote("");
  };

  if (!show || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
        
        <h3 className="text-xl font-bold mb-4">{item.name}</h3>
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">Đơn giá: {item.price.toLocaleString()}đ</span>
        </div>
        
        {/* Số lượng */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số lượng:
          </label>
          <div className="flex items-center border rounded-md">
            <button 
              onClick={handleDecrease}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md"
            >
              <FaMinus />
            </button>
            <span className="flex-1 text-center py-2">{quantity}</span>
            <button 
              onClick={handleIncrease}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        
        {/* Giảm giá */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Giảm giá (%):
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={handleDiscountChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        {/* Ghi chú */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ghi chú:
          </label>
          <textarea
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ví dụ: Ít cay, nhiều rau..."
          />
        </div>
        
        {/* Thành tiền */}
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thành tiền:</span>
            <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}đ</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-500">Đã giảm:</span>
              <span className="text-red-500">-{(item.price * quantity * discount / 100).toLocaleString()}đ</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductQuantityModal;