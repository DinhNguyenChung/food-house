import React, { useState } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

const ProductQuantityModal = ({ show, handleClose, item, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  if (!show || !item) return null;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalItemPrice = item.price * quantity;
    addToCart({
      ...item,
      quantity,
      note,
      totalItemPrice
    });
    handleClose();
    resetForm();
  };

  const resetForm = () => {
    setQuantity(1);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
          <button 
            onClick={() => {
              handleClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex mb-6">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-lg" 
              />
              <div className="ml-4 flex-1">
                <p className="text-accent font-bold text-xl mb-1">
                  {item.price.toLocaleString()}đ
                </p>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Số lượng
              </label>
              <div className="flex items-center">
                <button 
                  type="button"
                  onClick={decreaseQuantity}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <FaMinus />
                </button>
                <span className="mx-4 font-bold text-lg w-8 text-center">{quantity}</span>
                <button 
                  type="button"
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ghi chú
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yêu cầu đặc biệt, ví dụ: ít cay, không hành..."
              ></textarea>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Tổng cộng:</p>
                <p className="text-xl font-bold text-accent">
                  {(item.price * quantity).toLocaleString()}đ
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductQuantityModal;