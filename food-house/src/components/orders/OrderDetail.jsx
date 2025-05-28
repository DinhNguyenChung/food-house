import React, { useState } from "react";
import { FaTimes, FaPrint, FaCreditCard, FaMoneyBill } from "react-icons/fa";

// Sample order items data
const sampleOrderItems = [
  { id: 1, name: "Gà rán sốt cay", price: 85000, quantity: 2, discount: 0, totalPrice: 170000 },
  { id: 2, name: "Kimbap truyền thống", price: 55000, quantity: 1, discount: 10, totalPrice: 49500 },
  { id: 3, name: "Tokbokki phô mai", price: 65000, quantity: 2, discount: 0, totalPrice: 130000 },
];

const OrderDetail = ({ table, onClose, onPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items] = useState(sampleOrderItems);
  const [tipAmount, setTipAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Calculate discount amount
  const discountAmount = (subtotal * discountPercent) / 100;
  
  // Calculate total with tip and discount
  const total = subtotal - discountAmount + tipAmount;

  const handleDiscountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDiscountPercent(Math.min(100, Math.max(0, value)));
  };

  const handleTipChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setTipAmount(Math.max(0, value));
  };

  const handlePayment = () => {
    onPayment(table.id);
  };

  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes className="text-xl" />
          </button>
          
          <h2 className="text-2xl font-bold">
            Chi tiết hóa đơn - Bàn {table.id}
          </h2>
          <div className="mt-2 text-gray-600">
            {table.customerName && (
              <p>Khách hàng: <span className="font-medium">{table.customerName}</span></p>
            )}
            <p>Thời gian: <span className="font-medium">{table.timeElapsed}</span></p>
          </div>
        </div>
        
        <div className="p-6 max-h-[50vh] overflow-y-scroll scrollbar-hide rounded-lg">
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Danh sách món</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Món
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảm
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.price.toLocaleString()}đ</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.quantity}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.discount}%</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900">{item.totalPrice.toLocaleString()}đ</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Thanh toán</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Phương thức thanh toán:
                  </label>
                  <div className="flex space-x-4">
                    <div 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        paymentMethod === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <FaMoneyBill className={`mr-2 ${paymentMethod === "cash" ? "text-blue-500" : "text-gray-500"}`} />
                      <span>Tiền mặt</span>
                    </div>
                    <div 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <FaCreditCard className={`mr-2 ${paymentMethod === "card" ? "text-blue-500" : "text-gray-500"}`} />
                      <span>Thẻ</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Giảm giá (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={handleDiscountChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tiền tip (đ):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tipAmount}
                    onChange={handleTipChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
           <div>
              <h3 className="font-bold text-lg mb-3">Tổng cộng</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{subtotal.toLocaleString()}đ</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Giảm giá ({discountPercent}%):</span>
                      <span>-{discountAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip:</span>
                      <span className="font-medium">{tipAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
        </div>
        <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" /> Thanh toán
                </button>
                <button
                  onClick={() => {}}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <FaPrint className="mr-2" /> In hóa đơn
                </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;