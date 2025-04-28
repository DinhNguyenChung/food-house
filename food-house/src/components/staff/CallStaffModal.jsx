import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../styles/CallStaffModal.css";

const CallStaffModal = ({ show, handleClose }) => {
  const [reason, setReason] = useState("");

  const handleSendRequest = () => {
    console.log("Lý do gọi nhân viên:", reason);
    setReason(""); // Reset lý do
    handleClose(); // Đóng modal
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gọi nhân viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Lý do gọi nhân viên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: Lấy thêm bát đũa, dọn bàn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Chọn nhanh lý do</Form.Label>
            <Row className="g-2">
              <Col xs={12}>
                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 quick-reason-btn"
                  onClick={() => setReason("Gọi thêm món")}
                >
                  Gọi thêm món
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 quick-reason-btn"
                  onClick={() => setReason("Bổ sung dụng cụ ăn uống")}
                >
                  Bổ sung dụng cụ ăn uống
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 quick-reason-btn"
                  onClick={() => setReason("Thanh toán")}
                >
                  Thanh toán
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 quick-reason-btn"
                  onClick={() => setReason("Yêu cầu khác")}
                >
                  Yêu cầu khác
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" className="w-100" onClick={handleSendRequest}>
          Gửi yêu cầu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CallStaffModal;
