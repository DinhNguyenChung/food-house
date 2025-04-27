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
import "../styles/KoreHouse.css"; // Import CSS styles for KoreHouse component
import CallStaffModal from "../staff/CallStaffModal";
import MenuPage from "../Menu/MenuPage";

const KoreHouse = () => {
  const [page, setPage] = useState("home");

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <Container className="py-3">
      {page === "home" && (
        <>
          {/* Header với hình ảnh */}
          <Card className="mb-3">
            <Card.Img
              variant="top"
              src="https://i.ibb.co/BTC7Sz3/pexels-quang-nguyen-vinh-222549-6710689.jpg"
              alt="Kore House"
            />
            <Card.Body>
              <Card.Title as="h5">Kore House</Card.Title>
              <Card.Text>
                <Row>
                  <Col xs={12} className="d-flex align-items-center">
                    <FaClock className="me-2" />
                    Giờ mở cửa: Hôm nay 10:00 - 21:30
                  </Col>
                  <Col xs={12} className="d-flex align-items-center mt-2">
                    <FaUtensils className="me-2" />
                    11 - Tại Quán
                  </Col>
                  <Col xs={12} className="d-flex align-items-center mt-2">
                    <FaUserAlt className="me-2" />
                    Chung <FaEdit className="ms-2 text-primary" />
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
        </>
      )}
      {page === "menu" && <MenuPage onBack={() => setPage("home")} />}
    </Container>
  );
};

export default KoreHouse;
