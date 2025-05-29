import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { loginUser, clearErrors } from '../../redux/slices/authSlice';

const LoginForm = ({show, handleClose,}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
   // Đóng modal khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && show) {
      handleClose();
      setEmail('');
      setPassword('');
    }
  }, [isAuthenticated, show, handleClose]);
  // Clear errors khi đóng form
  useEffect(() => {
    if (!show) {
      dispatch(clearErrors());
    }
  }, [show, dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (!show) return null;

  return (
     <div className="fixed inset-0 z-[9999] overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <button 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <FaTimes />
          </button>

          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Đăng nhập</h1>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;