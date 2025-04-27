import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../styles/MenuSidebar.css";

const MenuSidebar = ({ show, onClose, menuItems, onSelectCategory }) => {
  const handleCategorySelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  return (
    <>
      <div className={`sidebar-overlay ${show ? "show" : ""}`} onClick={onClose}></div>
      <div className={`menu-sidebar ${show ? "show" : ""}`}>
        <div className="sidebar-header">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">Danh Mục Món Ăn</h5>
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-body">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="menu-item"
              onClick={() => handleCategorySelect(item.name)}
            >
              <span className="menu-name">{item.name}</span>
              <span className="menu-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuSidebar;