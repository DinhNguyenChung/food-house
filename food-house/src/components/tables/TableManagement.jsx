import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import TableList from "./TableList";

const TableManagement = ({ onBack }) => {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Quản lý bàn</h1>
        </div>
      </div>

      {/* Danh sách bàn */}
      <TableList />
    </div>
  );
};

export default TableManagement;