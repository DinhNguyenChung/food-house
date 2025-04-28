import React, { useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import "../styles/TableSelectionModal.css";

const TableSelectionModal = ({ show, handleClose, onSelectTable }) => {
  // Các trạng thái bàn: available, reserved, inUse
  const [tables, setTables] = useState(
    Array(20)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        status: Math.random() > 0.7 ? (Math.random() > 0.5 ? "reserved" : "inUse") : "available",
        name: "",
      }))
  );

  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleTableClick = (table) => {
    if (table.status === "available") {
      setSelectedTable(table);
      setShowNameInput(true);
    }
  };

  const handleSave = () => {
    if (selectedTable && customerName.trim()) {
      // Cập nhật trạng thái bàn thành reserved
      const updatedTables = tables.map((table) =>
        table.id === selectedTable.id
          ? { ...table, status: "reserved", name: customerName }
          : table
      );
      setTables(updatedTables);
      
      // Trả về thông tin bàn đã chọn cho component cha
      onSelectTable({
        tableId: selectedTable.id,
        customerName: customerName
      });
      
      // Reset state
      setSelectedTable(null);
      setCustomerName("");
      setShowNameInput(false);
      handleClose();
    }
  };

  const handleCancel = () => {
    setSelectedTable(null);
    setCustomerName("");
    setShowNameInput(false);
  };

  const getTableClassName = (table) => {
    let className = "table-item";
    
    if (table.status === "available") className += " available";
    if (table.status === "reserved") className += " reserved";
    if (table.status === "inUse") className += " in-use";
    if (selectedTable && selectedTable.id === table.id) className += " selected";
    
    return className;
  };

  const getTableStatusText = (status) => {
    switch(status) {
      case "available": return "Trống";
      case "reserved": return "Đã đặt";
      case "inUse": return "Đang sử dụng";
      default: return "";
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chọn bàn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showNameInput ? (
          <>
            <div className="table-status-legend">
              <div className="legend-item">
                <div className="status-indicator available"></div>
                <span>Trống</span>
              </div>
              <div className="legend-item">
                <div className="status-indicator reserved"></div>
                <span>Đã đặt</span>
              </div>
              <div className="legend-item">
                <div className="status-indicator in-use"></div>
                <span>Đang sử dụng</span>
              </div>
            </div>
            
            <Row className="tables-grid">
              {tables.map((table) => (
                <Col key={table.id} xs={4} sm={3} md={3} lg={2} className="mb-3">
                  <div
                    className={getTableClassName(table)}
                    onClick={() => handleTableClick(table)}
                  >
                    <div className="table-number">{table.id}</div>
                    <div className="table-status">{getTableStatusText(table.status)}</div>
                    {table.name && <div className="table-name">{table.name}</div>}
                  </div>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên khách hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên của bạn"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Text className="text-muted">
              Bạn đã chọn bàn số {selectedTable?.id}
            </Form.Text>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {showNameInput ? (
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Quay lại
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!customerName.trim()}>
              Xác nhận
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TableSelectionModal;