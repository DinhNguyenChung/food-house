import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaUserCog, FaUser } from 'react-icons/fa';
import { loginUser, clearErrors } from '../../redux/slices/authSlice';

const LoginForm = ({show, handleClose}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(true); // State để hiển thị modal xác nhận
  const [showLoginForm, setShowLoginForm] = useState(false); // State để hiển thị form đăng nhập
  
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  // Đóng modal khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && show) {
      handleClose();
      setEmail('');
      setPassword('');
      setShowConfirmation(true);
      setShowLoginForm(false);
    }
  }, [isAuthenticated, show, handleClose]);
  
  // Clear errors khi đóng form
  useEffect(() => {
    if (!show) {
      dispatch(clearErrors());
      // Reset các state khi đóng modal
      setShowConfirmation(true);
      setShowLoginForm(false);
    }
  }, [show, dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  
  // Xử lý khi người dùng xác nhận là nhân viên
  const handleConfirmStaff = () => {
    setShowConfirmation(false);
    setShowLoginForm(true);
  };
  
  // Xử lý khi người dùng không phải nhân viên
  const handleConfirmNotStaff = () => {
    // Đóng modal và hiển thị thông báo (có thể là toast hoặc alert)
    handleClose();
    alert("Bạn không cần đăng nhập để sử dụng các tính năng dành cho khách hàng.");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        
        {/* Modal content */}
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <button 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <FaTimes />
          </button>

          {/* Modal xác nhận trước khi đăng nhập */}
          {showConfirmation && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold mb-4">Xác nhận đăng nhập</h1>
                <p className="text-gray-600">Bạn có phải là nhân viên của Food House không?</p>
                <p className="text-gray-500 text-sm mt-2">Chỉ nhân viên của quán mới cần đăng nhập vào hệ thống.</p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleConfirmStaff}
                  className="bg-blue-600 text-white rounded-md px-4 py-3 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaUserCog className="mr-2" />
                  <span>Tôi là nhân viên của quán</span>
                </button>
                
                <button 
                  onClick={handleConfirmNotStaff}
                  className="bg-gray-200 text-gray-800 rounded-md px-4 py-3 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <FaUser className="mr-2" />
                  <span>Tôi là khách hàng</span>
                </button>
              </div>
            </div>
          )}

          {/* Form đăng nhập */}
          {showLoginForm && (
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Đăng nhập nhân viên</h1>
              </div>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input 
                      autoComplete="off" 
                      id="email" 
                      name="email" 
                      type="text" 
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600" 
                      placeholder="Email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input 
                      autoComplete="off" 
                      id="password" 
                      name="password" 
                      type="password" 
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label 
                      htmlFor="password" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Mật khẩu
                    </label>
                  </div>
                  <div className="relative">
                    <button 
                      className={`bg-cyan-500 text-white rounded-md px-4 py-2 w-full hover:bg-cyan-600 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                  </div>
                  
                  {/* Nút quay lại */}
                  <div className="text-center mt-4">
                    <button 
                      onClick={() => setShowConfirmation(true) & setShowLoginForm(false)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;