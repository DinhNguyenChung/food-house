import React, { useState, useEffect, useRef } from "react";
import {
  FaClock,
  FaUtensils,
  FaUserAlt,
  FaEdit,
  FaDollarSign,
  FaConciergeBell,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import CallStaffModal from "../staff/CallStaffModal";
import MenuPage from "../Menu/MenuPage";
import TableSelectionModal from "../tables/TableSelectionModal";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../auth/SignUpForm";
import logo from "../pics/logo-food-house.png";
import PaymentModal from "../payment/PaymentModal";


const KoreHouse = () => {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableInfo, setTableInfo] = useState({ tableId: null, customerName: "Vui lòng chọn bàn tại đây" });
  
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const userDropdownRef = useRef(null);

  // Modal handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  const handleOpenTableModal = () => setShowTableModal(true);
  const handleCloseTableModal = () => setShowTableModal(false);
  
  const handleSelectTable = (info) => {
    setTableInfo(info);
  };
  
  // Auth handlers
  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleOpenSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);
  // Payment modal handler
  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentCooldown, setPaymentCooldown] = useState(false);
const [remainingPaymentTime, setRemainingPaymentTime] = useState(300);
const endTimeRef = useRef(null); // Lưu thời gian kết thúc

const handleOpenPaymentModal = () => {
  setShowPaymentModal(true);

  if (!paymentCooldown) {
    const now = Date.now();
    const endTime = now + 300 * 1000; // 5 phút = 300s = 300000ms
    endTimeRef.current = endTime;
    setPaymentCooldown(true);
  }
};


    useEffect(() => {
      let timer;

      if (paymentCooldown && endTimeRef.current) {
        timer = setInterval(() => {
          const now = Date.now();
          const timeLeft = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));

          setRemainingPaymentTime(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(timer);
            setPaymentCooldown(false);
            endTimeRef.current = null;
          }
        }, 1000);
      }

      // Cleanup function
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [paymentCooldown]);
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };
 

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    handleCloseLoginModal();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowUserDropdown(false);
  };

  const handleSignUp = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    handleCloseSignUpModal();
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
   <div className="bg-sky-100 container mx-auto py-6 px-4 max-w-7xl">
    <div>
      {/* Login and signUp */}
      <div className="flex text-center mb-6 justify-end">
        {isLoggedIn ? (
          <div className="flex items-center relative ">
            <div className="flex -gray-700 mr-4 flex items-center flex-col md:flex-row">
              <span className="font-bold " >Nhân Viên </span>
              <span className="text-blue-700 font-medium mr-2">{currentUser.name}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FaUserAlt />
              </button>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div ref={userDropdownRef} className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <FaUserAlt className="mr-3 text-gray-500" />
                      <span>Thông tin tài khoản</span>
                    </div>
                  </a>
                  <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <FaCog className="mr-3 text-gray-500" />
                      <span>Cài đặt</span>
                    </div>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FaSignOutAlt className="mr-3" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleOpenLoginModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Đăng nhập
            </button>
            <button
              onClick={handleOpenSignUpModal}
              className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Đăng ký
            </button>
          </>
        )}
      </div>
    </div>
   {page === "home" && (
    <>
      {/* Header với hình ảnh */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Ảnh nền */}
        <img
          className="w-full object-cover h-48 md:h-56"
          src={logo}
          alt="Food House Background"
        />

       {/* Logo ở giữa ảnh, nổi lên trên */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 self-center">
          <img
            src={logo}
            alt="Food House Logo"
            className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white rounded-full shadow-lg"
          />
        </div>

          {/* Nội dung bên dưới */}
          <div className="p-6 mt-4">
            <h5 className="text-2xl font-bold text-neutral-800 mb-4">Food House</h5>
            <div className="space-y-3 text-neutral-600">
              <div className="flex items-center">
                <FaClock className="mr-3 text-blue-500" />
                <span>Giờ mở cửa: Hôm nay 10:00 - 21:30</span>
              </div>
              <div className="flex items-center">
                <FaUtensils className="mr-3 text-blue-500" />
                <span>{tableInfo.tableId ? `Bàn ${tableInfo.tableId}` : "Chưa chọn bàn"}</span>
              </div>
              <div className="flex items-center">
                <FaUserAlt className="mr-3 text-blue-500" />
                <span>{tableInfo.customerName}</span>
                <button 
                  className="ml-3 text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-full" 
                  onClick={handleOpenTableModal}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
     </div>

      {/* Các nút hỗ trợ */}
      <h3 className="text-3xl font-bold text-center text-neutral-800 mb-6 mt-6">Chào mừng đến với Food House</h3>
      <h6 className="text-center text-lg font-semibold text-neutral-800 my-6">Bạn đang cần hỗ trợ gì?</h6>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={handleOpenModal}
          className="bg-[#00D4FF] hover:bg-[#94BBE9] font-bold flex items-center justify-center py-3 px-4 border border-sky-300 text-sky-800 rounded-lg hover:text-white transition-all duration-200"
        >
          <FaConciergeBell className="mr-2" /> Gọi nhân viên
        </button>
        
        <button 
          onClick={handleOpenPaymentModal}
          className={`bg-[#00D4FF] hover:bg-[#94BBE9] font-bold flex items-center justify-center py-3 px-4 border border-sky-300 text-sky-800 rounded-lg hover:text-white transition-all duration-200 ${
            paymentCooldown ? 'relative' : ''
          }`}
        >
          <FaDollarSign className="mr-2" /> Gọi thanh toán
          {paymentCooldown && !showPaymentModal && (
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
        
        <button
          onClick={() => setPage("menu")}
          className="bg-[#00D4FF] hover:bg-[#94BBE9] font-bold hover:text-white transition duration-200 flex items-center justify-center py-3 px-4 border border-sky-300 text-sky-800 rounded-lg col-span-2 md:col-span-1"
        >
          <FaUtensils className="mr-2" /> Thực đơn & gọi món
        </button>
      </div>
      
      {/* Modal Components */}
      <CallStaffModal show={showModal} handleClose={handleCloseModal} />
      <TableSelectionModal 
        show={showTableModal}
        handleClose={handleCloseTableModal}
        onSelectTable={handleSelectTable}
      />
      <LoginForm 
        show={showLoginModal} 
        handleClose={handleCloseLoginModal} 
        handleLogin={handleLogin}
        handleOpenSignUp={handleOpenSignUpModal}
      />
      <SignUpForm 
        show={showSignUpModal} 
        handleClose={handleCloseSignUpModal} 
        handleSignUp={handleSignUp}
        handleOpenLogin={handleOpenLoginModal}
      />
      <PaymentModal 
        show={showPaymentModal}
        handleClose={handleClosePaymentModal}
        remainingTime={remainingPaymentTime}
      />
    </>   
  )}
  {page === "menu" && <MenuPage onBack={() => setPage("home")} tableInfo={tableInfo} />}
</div>
  );
};

export default KoreHouse;