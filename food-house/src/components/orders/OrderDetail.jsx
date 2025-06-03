import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaPrint, FaCreditCard, FaMoneyBill, FaSpinner } from "react-icons/fa";
import { getOrderById, updateOrderStatus } from "../../redux/slices/orderSlice";

const OrderDetail = ({ table, orderId, onClose, onPayment }) => {
  const dispatch = useDispatch();
  const { selectedOrder, loading } = useSelector(state => state.order);  
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Lấy chi tiết đơn hàng
  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);
  
  const handleDiscountChange = (e) => {
    const value = parseInt(e.target.value);
    setDiscountPercent(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };
  
  const handleTipChange = (e) => {
    const value = parseInt(e.target.value);
    setTipAmount(isNaN(value) ? 0 : Math.max(0, value));
  };
  
  // Tính toán
  const subtotal = selectedOrder?.totalAmount || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount + tipAmount;
  
  const handlePayment = () => {
    setProcessingPayment(true);
    
    const statusData = {
      status: "COMPLETED",
      paymentMethod: paymentMethod,
      discountPercent: discountPercent,
      tipAmount: tipAmount
    };
    
    dispatch(updateOrderStatus({ id: orderId, statusData }))
      .unwrap()
      .then(() => {
        onPayment(table.id);
      })
      .catch((err) => {
        console.error("Thanh toán thất bại:", err);
        setProcessingPayment(false);
      });
  };
  
  if (!selectedOrder && loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <FaSpinner className="animate-spin text-blue-500 text-3xl mx-auto" />
          <p className="text-center mt-4">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }
  
  if (!selectedOrder && !loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-center text-red-500">Không thể tải thông tin đơn hàng. Vui lòng thử lại.</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={processingPayment}
          >
            <FaTimes className="text-xl" />
          </button>
          
          <h2 className="text-2xl font-bold">
            Chi tiết hóa đơn - Bàn {selectedOrder.tableId}
          </h2>
          <div className="mt-2 text-gray-600">
            {selectedOrder.customerName && (
              <p>Khách hàng: <span className="font-medium">{selectedOrder.customerName}</span></p>
            )}
            <p>Thời gian: <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
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
                  {selectedOrder.items && selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.menuItemName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.price.toLocaleString()}đ</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.quantity}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{item.discount || 0}%</div>
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
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <div className="mt-6 space-y-3">
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              {processingPayment ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaCreditCard className="mr-2" /> Thanh toán
                </>
              )}
            </button>
            <button
              onClick={() => {}}
              disabled={processingPayment}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FaPrint className="mr-2" /> In hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;