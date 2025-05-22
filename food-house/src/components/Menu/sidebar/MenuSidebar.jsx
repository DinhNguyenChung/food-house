import React from "react";
import { FaTimes } from "react-icons/fa";

const MenuSidebar = ({ show, onClose, menuItems, onSelectCategory }) => {
  const handleCategorySelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  return (
   <>
  {/* Overlay */}
  <div 
    className={`fixed inset-0 bg-neutral-800/60 z-40 transition-opacity duration-300 ${
      show ? "opacity-100" : "opacity-0 pointer-events-none"
    }`} 
    onClick={onClose}
  ></div>
  
  {/* Sidebar */}
  <div 
    className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
      show ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="bg-primary text-white p-5 flex justify-between items-center">
      <h5 className="text-xl font-bold">Danh Mục Món Ăn</h5>
      <button 
        className="text-white hover:text-neutral-200"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>
    </div>
    
    <div className="overflow-y-auto h-[calc(100%-80px)]">
      {menuItems.map((item, index) => (
        <div 
          key={index} 
          className="p-4 border-b border-neutral-100 flex justify-between items-center hover:bg-neutral-50 cursor-pointer transition-colors"
          onClick={() => handleCategorySelect(item.name)}
        >
          <span className="font-medium text-neutral-700">{item.name}</span>
          <span className="bg-accent text-white text-xs px-3 py-1 rounded-full">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>
</>
  );
};

export default MenuSidebar;