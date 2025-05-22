import React, { useState, useEffect } from "react";
import { FaPlus, FaArrowLeft, FaList, FaSearch, FaTimes } from "react-icons/fa";
import MenuSidebar from "./sidebar/MenuSidebar";
import menuItems from "./fakedata/menuItems";
import menuCategories from "./fakedata/menuCategories";

const MenuPage = ({ onBack }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let result = menuItems;
    
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const selectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowSidebar(false);
  };
  
  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
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
    </div>

    {/* Dòng chứa icon Menu List và input */}
    <div className="flex items-center">
      <button
        className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-soft hover:bg-accent/90 transition-colors mr-4"
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
    </div>
  </div>
  
  {/* Hiển thị thông báo khi không có kết quả */}
  {filteredItems.length === 0 && (
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
  <div className="space-y-4 mt-6">
    {filteredItems.map((item) => (
      <div key={item.id} className="bg-white rounded-lg shadow-soft flex overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex-1 p-5 flex flex-col justify-between">
          <h3 className="font-semibold text-lg text-neutral-800 mb-3 line-clamp-2">
            {item.name}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-accent font-bold text-xl">
              {item.price.toLocaleString()}đ
            </p>
            <button
              onClick={() => addToCart(item)}
              className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="w-1/3 min-w-[120px]">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
      </div>
    ))}
  </div>
  
  {/* Sidebar Menu */}
  <MenuSidebar
    show={showSidebar}
    onClose={() => setShowSidebar(false)}
    menuItems={menuCategories}
    onSelectCategory={selectCategory}
  />
</div>
  );
};

export default MenuPage;