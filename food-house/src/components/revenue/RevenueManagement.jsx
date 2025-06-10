import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaChartLine, 
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaSpinner
} from "react-icons/fa";
import { calculateRevenue, getTopOrderedItems, getAllOrders } from "../../redux/slices/orderSlice";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const RevenueManagement = ({ onBack }) => {
  const dispatch = useDispatch();
  const { orders, revenue, topItems, loading } = useSelector(state => state.order);
  

  const [dateRange, setDateRange] = useState("today");
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [completedOrders, setCompletedOrders] = useState([]);
  
  // Lấy dữ liệu khi component mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);
  
  // Lọc đơn hàng đã hoàn thành
  useEffect(() => {
    if (orders && orders.length > 0) {
      const completed = orders.filter(order => order.status === "COMPLETED");
      setCompletedOrders(completed);
    }
  }, [orders]);

  // Tính toán doanh thu dựa trên khoảng thời gian
  useEffect(() => {
    handleDateRangeChange(dateRange);
  }, [dateRange]);
  
  // Lấy dữ liệu các món ăn phổ biến
  useEffect(() => {
    dispatch(getTopOrderedItems());
  }, [dispatch]);
  
  // Xử lý thay đổi khoảng thời gian
  const handleDateRangeChange = (range) => {
    let start, end;
    const now = new Date();
    
    switch(range) {
      case "today":
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case "yesterday":
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
        break;
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "year":
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        start = startOfDay(now);
        end = endOfDay(now);
    }
    
    setStartDate(start);
    setEndDate(end);
    dispatch(calculateRevenue({ startDate: start, endDate: end }));
  };
  
  // Định dạng ngày
  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };
  
  // Tính tổng doanh thu từ danh sách đơn hàng đã hoàn thành
  // const calculateTotalRevenue = () => {
  //   if (completedOrders.length === 0) return 0;
    
  //   return completedOrders
  //     .filter(order => {
  //       const orderDate = new Date(order.completedAt || order.createdAt);
  //       return orderDate >= startDate && orderDate <= endDate;
  //     })
  //     .reduce((sum, order) => sum + order.totalAmount, 0);
  // };
const calculateTotalRevenue = () => {
  if (completedOrders.length === 0) return 0;
  
  return completedOrders
    .filter(order => {
      const orderDate = new Date(order.completedAt || order.createdAt);
      // Đảm bảo so sánh theo ngày không tính giờ
      return orderDate >= startOfDay(startDate) && orderDate <= endOfDay(endDate);
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
};

// Sử dụng một biến để debug
const apiRevenue = revenue ? revenue.revenue : 0;
const calculatedRevenue = calculateTotalRevenue();
console.log("API Revenue:", apiRevenue, "Calculated:", calculatedRevenue);

// Hiển thị calculatedRevenue để đảm bảo tính toán chính xác
const total = calculatedRevenue;

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Quản lý doanh thu</h1>
        </div>
        
        {/* Chọn khoảng thời gian */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Thời gian
          </h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setDateRange("today")}
              className={`px-4 py-2 rounded-lg ${dateRange === "today" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Hôm nay
            </button>
            <button 
              onClick={() => setDateRange("yesterday")}
              className={`px-4 py-2 rounded-lg ${dateRange === "yesterday" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Hôm qua
            </button>
            <button 
              onClick={() => setDateRange("week")}
              className={`px-4 py-2 rounded-lg ${dateRange === "week" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Tuần này
            </button>
            <button 
              onClick={() => setDateRange("month")}
              className={`px-4 py-2 rounded-lg ${dateRange === "month" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Tháng này
            </button>
            <button 
              onClick={() => setDateRange("year")}
              className={`px-4 py-2 rounded-lg ${dateRange === "year" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Năm nay
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
        
        {/* Hiển thị doanh thu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-green-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-blue-500 text-xl" />
              </div>
            ) : (
              <div className="text-3xl font-bold text-green-600">
                 {/* {(revenue ? revenue.revenue : calculateTotalRevenue()).toLocaleString()}đ */}
                {total.toLocaleString()}đ
              </div>
            )}
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <div className="flex items-center mb-2">
              <FaFileInvoiceDollar className="text-purple-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">Tổng hóa đơn</h3>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-purple-500 text-xl" />
              </div>
            ) : (
              <div className="text-3xl font-bold text-purple-600">
                {completedOrders.filter(order => {
                  const orderDate = new Date(order.completedAt || order.createdAt);
                  return orderDate >= startDate && orderDate <= endDate;
                }).length}
              </div>
            )}
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <div className="flex items-center mb-2">
              <FaChartLine className="text-orange-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">Trung bình/hóa đơn</h3>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-orange-500 text-xl" />
              </div>
            ) : (
              <div className="text-3xl font-bold text-orange-600">
                {(() => {
                  const filteredOrders = completedOrders.filter(order => {
                    const orderDate = new Date(order.completedAt || order.createdAt);
                    return orderDate >= startDate && orderDate <= endDate;
                  });
                  const total = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
                  const count = filteredOrders.length;
                  return count > 0 ? Math.round(total / count).toLocaleString() : 0;
                })()}đ
              </div>
            )}
          </div>
        </div>
        
        {/* Top món ăn */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Top món ăn được đặt nhiều nhất</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : topItems && topItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">STT</th>
                    <th className="py-3 px-4 text-left">Tên món</th>
                    <th className="py-3 px-4 text-right">Số lượng đã bán</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={item.menuItemId} className="border-t">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.menuItemName}</td>
                      <td className="py-3 px-4 text-right">{item.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Không có dữ liệu</p>
            </div>
          )}
        </div>
        
        {/* Danh sách hóa đơn */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Danh sách hóa đơn đã thanh toán</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : completedOrders.filter(order => {
              const orderDate = new Date(order.completedAt || order.createdAt);
              return orderDate >= startDate && orderDate <= endDate;
            }).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Mã HĐ</th>
                    <th className="py-3 px-4 text-left">Bàn</th>
                    <th className="py-3 px-4 text-left">Khách hàng</th>
                    <th className="py-3 px-4 text-left">Thời gian</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4 text-center">PT thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders
                    .filter(order => {
                      const orderDate = new Date(order.completedAt || order.createdAt);
                      return orderDate >= startDate && orderDate <= endDate;
                    })
                    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
                    .map(order => (
                      <tr key={order.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">Bàn {order.tableId}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">
                          {format(new Date(order.completedAt || order.createdAt), 'HH:mm - dd/MM/yyyy')}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          {order.totalAmount.toLocaleString()}đ
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.paymentMethod === 'cash' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Không có hóa đơn nào trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;