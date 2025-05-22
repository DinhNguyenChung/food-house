import React, { useState } from "react";
import {
  FaClock,
  FaUtensils,
  FaUserAlt,
  FaEdit,
  FaDollarSign,
  FaConciergeBell,
} from "react-icons/fa";
import CallStaffModal from "../staff/CallStaffModal";
import MenuPage from "../Menu/MenuPage";
import TableSelectionModal from "../tables/TableSelectionModal";
import logo from "../pics/logo-food-house.png";

const KoreHouse = () => {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableInfo, setTableInfo] = useState({ tableId: null, customerName: "Vui lòng chọn bàn tại đây" });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  const handleOpenTableModal = () => setShowTableModal(true);
  const handleCloseTableModal = () => setShowTableModal(false);
  
  const handleSelectTable = (info) => {
    setTableInfo(info);
  };

  return (
   <div className="container mx-auto py-6 px-4 max-w-7xl">
  {page === "home" && (
    <>
      {/* Header với hình ảnh */}
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <img
          className="w-full object-cover h-48 md:h-56"
          src={logo}
          alt="Food House"
        />
        <div className="p-6">
          <h5 className="text-2xl font-bold text-neutral-800 mb-4">Food House</h5>
          <div className="space-y-3 text-neutral-600">
            <div className="flex items-center">
              <FaClock className="mr-3 text-primary" />
              <span>Giờ mở cửa: Hôm nay 10:00 - 21:30</span>
            </div>
            <div className="flex items-center">
              <FaUtensils className="mr-3 text-primary" />
              <span>{tableInfo.tableId ? `Bàn ${tableInfo.tableId}` : "Chưa chọn bàn"}</span>
            </div>
            <div className="flex items-center">
              <FaUserAlt className="mr-3 text-primary" />
              <span>{tableInfo.customerName}</span>
              <button 
                className="ml-3 text-primary hover:text-primary/80 transition-colors" 
                onClick={handleOpenTableModal}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Các nút hỗ trợ */}
      <h6 className="text-center text-lg font-semibold text-neutral-800 my-6">Bạn đang cần hỗ trợ gì?</h6>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={handleOpenModal}
          className="bg-[#00D4FF] hover:bg-[#94BBE9] font-bold flex items-center justify-center py-3 px-4 bg-neutral-50 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-200"
        >
          <FaConciergeBell className="mr-2" /> Gọi nhân viên
        </button>
        
        <button className="bg-[#00D4FF] hover:bg-[#94BBE9] font-bold flex items-center justify-center py-3 px-4 bg-neutral-50 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all duration-200">
          <FaDollarSign className="mr-2" /> Gọi thanh toán
        </button>
        
        <button
          onClick={() => setPage("menu")}
          className="bg-[#00D4FF] hover:bg-[#94BBE9] font-bold hover:text-white transition duration-200 flex items-center justify-center py-3 px-4 bg-neutral text-secondary border border-secondary rounded-lg hover:bg-secondary transition-all duration-200 col-span-2 md:col-span-1"
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
    </>
  )}
  {page === "menu" && <MenuPage onBack={() => setPage("home")} />}
</div>
  );
};

export default KoreHouse;