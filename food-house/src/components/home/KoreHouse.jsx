import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaClock,
  FaUtensils,
  FaUserAlt,
  FaEdit,
  FaDollarSign,
  FaConciergeBell,
} from "react-icons/fa";
import "../styles/KoreHouse.css"; 
import CallStaffModal from "../staff/CallStaffModal";
import MenuPage from "../Menu/MenuPage";
import TableSelectionModal from "../tables/TableSelectionModal"; // Import component mới
import logo from "../pics/logo-food-house.png";

const KoreHouse = () => {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false); // State cho modal chọn bàn
  const [tableInfo, setTableInfo] = useState({ tableId: null, customerName: "Vui lòng chọn bàn tại đây" }); // Thông tin bàn đã chọn

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  // Xử lý mở/đóng modal chọn bàn
  const handleOpenTableModal = () => setShowTableModal(true);
  const handleCloseTableModal = () => setShowTableModal(false);
  
  // Xử lý khi chọn bàn xong
  const handleSelectTable = (info) => {
    setTableInfo(info);
  };

  return (
    <Container className="py-3">
      {page === "home" && (
        <>
          {/* Header với hình ảnh */}
          <Card className="mb-3">
            <Card.Img
              variant="top"
              src={logo}
              alt="Food House"
            />
            <Card.Body>
              <Card.Title as="h5">Food House</Card.Title>
              <Card.Text>
                <Row>
                  <Col xs={12} className="d-flex align-items-center">
                    <FaClock className="me-2" />
                    Giờ mở cửa: Hôm nay 10:00 - 21:30
                  </Col>
                  <Col xs={12} className="d-flex align-items-center mt-2">
                    <FaUtensils className="me-2" />
                    {tableInfo.tableId ? `Bàn ${tableInfo.tableId}` : "Chưa chọn bàn"}
                  </Col>
                  <Col xs={12} className="d-flex align-items-center mt-2">
                    <FaUserAlt className="me-2" />
                    {tableInfo.customerName} 
                    <Button 
                      variant="link" 
                      className="p-0 ms-2 text-primary" 
                      onClick={handleOpenTableModal}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <FaEdit />
                    </Button>
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Các nút hỗ trợ */}
          <h6 className="text-center mb-3">Bạn đang cần hỗ trợ gì?</h6>
          <Row className="text-center">
            <Col xs={6} md={4}>
              <Button
                variant="outline-success"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={handleOpenModal}
              >
                <FaConciergeBell className="me-2" />
                Gọi nhân viên
              </Button>
              {/* Modal Component */}
              <CallStaffModal show={showModal} handleClose={handleCloseModal} />
            </Col>
            <Col xs={6} md={4}>
              <Button
                variant="outline-warning"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaDollarSign className="me-2" />
                Gọi thanh toán
              </Button>
            </Col>
            <Col xs={12} md={4} className="mt-2 mt-md-0">
              <Button
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => setPage("menu")}
              >
                <FaUtensils className="me-2" />
                Thực đơn & gọi món
              </Button>
            </Col>
          </Row>
          
          {/* Modal chọn bàn */}
          <TableSelectionModal 
            show={showTableModal}
            handleClose={handleCloseTableModal}
            onSelectTable={handleSelectTable}
          />
        </>
      )}
      {page === "menu" && <MenuPage onBack={() => setPage("home")} />}
    </Container>
  );
};

export default KoreHouse;
