import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaPlus, FaArrowLeft, FaList, FaSearch, FaTimes } from "react-icons/fa";
import MenuSidebar from "./sidebar/MenuSidebar";
import menuItems from "./fakedata/menuItems";
import menuCategories from "./fakedata/menuCategories";
import "../styles/MenuPage.css"; 

// const menuItems = [
//   {
//     id: 1,
//     name: "COMBO 4 (Mì Tương Đen + Trà Đào Cam Sả)",
//     price: 69000,
//     image: "https://i.ibb.co/JHvRgjK/pexels-fotios-photos-1279330.jpg",
//     category: "COMBO ƯU ĐÃI"
//   },
//   {
//     id: 2,
//     name: "COMBO 5 (Mì Bò/Hải Sản + Trà Ôlong Mật Ong Trân Châu)",
//     price: 69000,
//     image: "https://i.ibb.co/JHvRgjK/pexels-fotios-photos-1279330.jpg",
//     category: "COMBO ƯU ĐÃI"
//   },
//   {
//     id: 3,
//     name: "COMBO 6 (Miến Trộn HQ + Trà Đào)",
//     price: 69000,
//     image: "https://i.ibb.co/JHvRgjK/pexels-fotios-photos-1279330.jpg",
//     category: "COMBO ƯU ĐÃI"
//   },
//   {
//     id: 4,
//     name: "Cơm Cá Ngừ + Súp RB + Trà Tắc",
//     price: 75000,
//     image: "https://i.ibb.co/JHvRgjK/pexels-fotios-photos-1279330.jpg",
//     category: "COMBO"
//   },
// ];

// // Dữ liệu menu
// const menuItems2 = [
//   { name: "COMBO ƯU ĐÃI", count: 6 },
//   { name: "MÌ CAY", count: 8 },
//   { name: "MÌ XÀO KORE", count: 5 },
//   { name: "CƠM VÀ MÓN KHÁC", count: 9 },
//   { name: "COMBO", count: 3 },
//   { name: "VIÊN CHIÊN ĂN VẶT", count: 5 },
//   { name: "NƯỚC", count: 13 },
//   { name: "MÓN THÊM", count: 12 },
//   { name: "TOPPING THÊM", count: 4 },
// ];

const MenuPage = ({ onBack }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle search functionality
  useEffect(() => {
    let result = menuItems;
    
    // Filter by category if one is selected
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Then filter by search term
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
    <Container className="menu-container">
      <div className="menu-header">
        {/* Dòng chứa nút Back và tiêu đề Thực đơn */}
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <Button variant="outline-secondary" onClick={onBack} className="back-btn">
              <FaArrowLeft />
            </Button>
          </Col>
          <Col>
            <h3 className="menu-title text-center mb-0">
              {selectedCategory ? selectedCategory : "Thực đơn"}
            </h3>
          </Col>
        </Row>

        {/* Dòng chứa icon Menu List và input */}
        <Row className="align-items-center search-bar">
          <Col xs="auto">
            <button
              className="category-btn"
              onClick={() => setShowSidebar(true)}
            >
              <FaList color="white" />
            </button>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Text className="search-icon">
                <FaSearch color="#777" />
              </InputGroup.Text>
              <FormControl 
                placeholder="Tìm tên món..." 
                aria-label="Tìm tên món" 
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <Button 
                  variant="light" 
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Col>
        </Row>
      </div>
      
      {/* Hiển thị thông báo khi không có kết quả */}
      {filteredItems.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy món ăn phù hợp</p>
          <Button variant="outline-primary" onClick={clearSearch}>
            Xóa tìm kiếm
          </Button>
        </div>
      )}
      
      {/* Danh sách món ăn */}
      <Row className="menu-items-grid">
        {filteredItems.map((item) => (
          <Col xs={12} sm={6} lg={4} key={item.id} className="mb-4">
            <Card className="menu-card">
              <Card.Img variant="top" src={item.image} alt={item.name} className="menu-img" />
              <Card.Body className="menu-card-body">
                <Card.Title className="menu-item-title">{item.name}</Card.Title>
                <Card.Text className="menu-item-price">{item.price.toLocaleString()}đ</Card.Text>
                <Button
                  variant="success"
                  className="add-to-cart-btn w-100 d-flex align-items-center justify-content-center"
                  onClick={() => addToCart(item)}
                >
                  <FaPlus className="me-2" /> Thêm vào giỏ
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Sidebar menu */}
      <MenuSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        menuItems={menuCategories}
        onSelectCategory={selectCategory}
      />
    </Container>
  );
};

export default MenuPage;
