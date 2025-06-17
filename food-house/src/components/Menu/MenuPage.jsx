import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaArrowLeft, FaList, FaSearch, FaTimes, FaUtensils, FaSpinner } from "react-icons/fa";
import MenuSidebar from "./sidebar/MenuSidebar";
import ProductQuantityModal from "./modals/ProductQuantityModal";
import CartSummary from "./cart/CartSummary";
import AddMenuItemModal from "./modals/AddMenuItemModal";
import { 
  getAllMenuItems, 
  getAllCategories,
  searchMenuItems,
  getMenuItemsByCategory,
  resetMenuSuccess,
  clearMenuErrors
} from "../../redux/slices/menuSlice";

const MenuPage = ({ onBack, tableInfo }) => {
  const dispatch = useDispatch();
  const { 
    menuItems, 
    categories, 
    loading, 
    error, 
    success 
  } = useSelector(state => state.menu);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Lấy thông tin user từ Redux store để kiểm tra quyền admin
  const auth = useSelector(state => state.auth);
  const userData = auth?.user || {};
  const user = userData?.user || {};
  const isAdmin = user?.role === "ADMIN";

  // Tải dữ liệu khi component mount
  useEffect(() => {
    dispatch(getAllMenuItems());
    dispatch(getAllCategories());
  }, [dispatch]);

  // Theo dõi thành công/lỗi từ Redux
  useEffect(() => {
    if (success) {
      setNotification({
        show: true,
        message: "Thao tác thành công!",
        type: "success"
      });
      
      // Auto hide notification
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        dispatch(resetMenuSuccess());
      }, 3000);
      
      // Refresh data
      dispatch(getAllMenuItems());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setNotification({
        show: true,
        message: typeof error === "string" ? error : "Đã xảy ra lỗi. Vui lòng thử lại.",
        type: "error"
      });
      
      // Auto hide notification
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        dispatch(clearMenuErrors());
      }, 3000);
    }
  }, [error, dispatch]);

  // Lọc dữ liệu theo tìm kiếm/danh mục
  useEffect(() => {
    if (menuItems.length > 0) {
      setFilteredItems(menuItems);
    }
  }, [menuItems]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      dispatch(searchMenuItems(e.target.value));
    } else {
      dispatch(getAllMenuItems());
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    dispatch(getAllMenuItems());
  };

  const selectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowSidebar(false);
    
    // Lấy categoryId từ tên
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      dispatch(getMenuItemsByCategory(category.id));
    } else {
      dispatch(getAllMenuItems());
    }
  };
  
  const openQuantityModal = (item) => {
    setSelectedItem(item);
    setShowQuantityModal(true);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleAddMenuItem = () => {
    setShowAddItemModal(true);
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const placeOrder = () => {
    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
      setNotification({
        show: true,
        message: "Giỏ hàng của bạn đang trống!",
        type: "error"
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      return;
    }

    // Kiểm tra nếu chưa chọn bàn
    if (!tableInfo || !tableInfo.tableId) {
      setNotification({
        show: true,
        message: "Vui lòng chọn bàn trước khi đặt món!",
        type: "error"
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      return;
    }
    
    // // Kiểm tra xem người dùng đã đăng nhập chưa
    // if (!user.id) {
    //   setNotification({
    //     show: true,
    //     message: "Vui lòng đăng nhập để đặt món!",
    //     type: "error"
    //   });
    //   setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    //   return;
    // }

    // Đặt món thành công
    setNotification({
      show: true,
      message: "Đặt món thành công!",
      type: "success"
    });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

   const clearCart = () => {
    setCart([]);
  };

 
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" 
            ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
            : "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 py-4 z-30">
        {/* Dòng chứa nút Back và tiêu đề Thực đơn */}
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h3 className="text-2xl font-bold text-neutral-800 text-center flex-1">
            {selectedCategory ? selectedCategory : "Thực đơn"}
          </h3>
          
          {/* Giỏ hàng */}
          <CartSummary
           cart={cart}
            tableInfo={tableInfo}
            removeFromCart={removeFromCart}
            placeOrder={placeOrder}
            clearCart={clearCart}
          />
        </div>

        {/* Dòng chứa icon Menu List và input */}
        <div className="flex items-center">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#34A853] text-white shadow-soft hover:bg-accent/90 transition-colors mr-4"
            onClick={() => setShowSidebar(true)}
          >
            <FaList />
          </button>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FaSearch className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm tên món..."
              className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-neutral-50 text-neutral-800 placeholder-neutral-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-4"
                onClick={clearSearch}
              >
                <FaTimes className="text-neutral-500 hover:text-neutral-700" />
              </button>
            )}
          </div>
          <div>
            {/* Nút thêm món ăn mới - chỉ hiển thị cho admin */}
          {isAdmin && (
            <button
              onClick={handleAddMenuItem}
              className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
              title="Thêm món ăn mới"
            >
              <FaUtensils className="text-sm" />
            </button>
          )}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="text-blue-500 text-4xl animate-spin" />
        </div>
      )}
      
      {/* Hiển thị thông báo khi không có kết quả */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center p-8 bg-neutral-50 rounded-lg my-6">
          <p className="text-lg text-neutral-600 mb-4">Không tìm thấy món ăn phù hợp</p>
          <button 
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            onClick={clearSearch}
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
      
      {/* Danh sách món ăn */}
      {!loading && filteredItems.length > 0 && (
        <div className="space-y-4 mt-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-soft flex overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-neutral-800 mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  {/* Hiển thị trạng thái nếu là admin */}
                  {isAdmin && item.status === "SOLDOUT" && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mb-2">
                      Hết hàng
                    </span>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-accent font-bold text-xl">
                    {item.price.toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => openQuantityModal(item)}
                    disabled={item.status === "SOLDOUT"}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      item.status === "SOLDOUT" 
                        ? "bg-gray-300 cursor-not-allowed" 
                        : "bg-[#00D4FF] text-white hover:bg-accent/90"
                    }`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="w-1/3 min-w-[120px] max-w-[150px] max-h-[150px]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-r-lg"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal thêm món ăn mới */}
      <AddMenuItemModal
        show={showAddItemModal}
        handleClose={handleCloseAddItemModal}
        isAdmin={isAdmin} // Truyền prop isAdmin
      />
      
      {/* Sidebar Menu */}
      <MenuSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        menuItems={categories}
        onSelectCategory={selectCategory}
      />
      
      {/* Modal chọn số lượng */}
      <ProductQuantityModal
        show={showQuantityModal}
        handleClose={() => setShowQuantityModal(false)}
        item={selectedItem}
        addToCart={addToCart}
      />
    </div>
  );
};

export default MenuPage;