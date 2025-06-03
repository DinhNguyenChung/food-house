import React from "react";
import { FaTimes } from "react-icons/fa";

const MenuSidebar = ({ show, onClose, menuItems, onSelectCategory }) => {
  if (!show) return null;

  const handleCategorySelect = (categoryName) => {
    onSelectCategory(categoryName);
  };

  // Thêm tùy chọn để xem tất cả món
  const handleViewAll = () => {
    onSelectCategory(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transition-transform duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-bold">Danh Mục Món Ăn</h5>
          <button 
            className="text-white hover:text-neutral-200"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {/* Tùy chọn xem tất cả */}
          <div 
            className="p-4 border-b border-neutral-100 flex justify-between items-center hover:bg-neutral-50 cursor-pointer transition-colors"
            onClick={handleViewAll}
          >
            <span className="font-medium text-neutral-700">Tất cả món ăn</span>
          </div>
          
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="p-4 border-b border-neutral-100 flex justify-between items-center hover:bg-neutral-50 cursor-pointer transition-colors"
              onClick={() => handleCategorySelect(item.name)}
            >
              <span className="font-medium text-neutral-700">{item.name}</span>
              <span className="bg-accent text-white text-xs px-3 py-1 rounded-full">
                {item.itemCount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuSidebar;