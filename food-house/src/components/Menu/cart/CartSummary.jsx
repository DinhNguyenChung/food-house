import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaTrash, FaRegSadTear, FaSpinner } from "react-icons/fa";
import { createOrder } from "../../../redux/slices/orderSlice";

const CartSummary = ({ cart, tableInfo, removeFromCart, placeOrder, clearCart }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.order);
  const auth = useSelector(state => state.auth);
  const user = auth?.user?.user || {};
  
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Tính tổng số tiền
  const totalAmount = cart.reduce((total, item) => total + item.totalItemPrice, 0);
  
  // Tính tổng số món
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handlePlaceOrder = () => {
    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
      placeOrder(); // Gọi hàm thông báo giỏ hàng trống
      return;
    }

    // Kiểm tra nếu chưa chọn bàn
    if (!tableInfo || !tableInfo.tableId) {
      placeOrder(); // Gọi hàm thông báo chưa chọn bàn
      return;
    }
    
    // Kiểm tra nếu chưa đăng nhập
    if (!user.id) {
      placeOrder(); // Gọi hàm thông báo cần đăng nhập
      return;
    }
    
    // Tạo dữ liệu đơn hàng
    const orderData = {
      tableId: tableInfo.tableId,
      customerName: tableInfo.customerName,
      staffId: user.id, // Lấy ID từ người dùng đăng nhập
      items: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        discount: item.discount || 0,
        note: item.note || ""
      }))
    };
    
    // Gửi yêu cầu tạo đơn hàng
    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        setOrderPlaced(true);
        // Hiển thị thông báo thành công
        placeOrder();
        // Xóa giỏ hàng
        clearCart();
        // Đóng cart
        setTimeout(() => {
          setShowCart(false);
          setOrderPlaced(false);
        }, 1500);
      })
      .catch((err) => {
        // Xử lý lỗi nếu có
        console.error("Đặt món thất bại:", err);
      });
  };

  return (
    <div className="relative">
      {/* Icon giỏ hàng */}
      <button 
        className="fixed top-4 right-4 z-40 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setShowCart(!showCart)}
      >
        <FaShoppingCart className="text-xl" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>

      {/* Dropdown giỏ hàng */}
      {showCart && (
        <div className="fixed top-16 right-4 w-80 md:w-96 bg-white rounded-lg shadow-xl z-40 max-h-[80vh] overflow-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Giỏ hàng của bạn</h3>
          </div>

          {/* Thông tin bàn */}
          <div className="p-4 bg-blue-50">
            <div className="flex justify-between">
              <span className="font-medium">Bàn:</span>
              <span>{tableInfo.tableId ? `Bàn ${tableInfo.tableId}` : "Chưa chọn bàn"}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">Khách hàng:</span>
              <span>{tableInfo.customerName}</span>
            </div>
          </div>

          {/* Danh sách món */}
          <div className="p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <FaRegSadTear className="mx-auto text-4xl text-gray-300 mb-2" />
                <p className="text-gray-500">Giỏ hàng đang trống</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-gray-700">{item.quantity}x</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.discount > 0 && `Giảm giá: ${item.discount}%`}
                        {item.note && <div className="italic">Ghi chú: {item.note}</div>}
                      </div>
                    </div>
                    <div className="flex items-start ml-2">
                      <span className="font-medium">{item.totalItemPrice.toLocaleString()}đ</span>
                      <button 
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(index)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tổng tiền và nút đặt hàng */}
          {cart.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{totalAmount.toLocaleString()}đ</span>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
                  {typeof error === "string" ? error : "Lỗi khi đặt món. Vui lòng thử lại."}
                </div>
              )}
              
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                disabled={!tableInfo.tableId || loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : tableInfo.tableId ? (
                  orderPlaced ? "Đặt món thành công!" : "Đặt món"
                ) : (
                  "Vui lòng chọn bàn trước"
                )}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Overlay để đóng giỏ hàng khi click ra ngoài */}
      {showCart && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowCart(false)}
        ></div>
      )}
    </div>
  );
};

export default CartSummary;