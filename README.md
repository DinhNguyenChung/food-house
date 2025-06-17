

```markdown
# 🍽️ Food House - Restaurant Management System

> Ứng dụng web giúp quản lý nhà hàng một cách hiệu quả: từ thực đơn, đơn hàng, nhân sự.

![Food House Logo](https://i.ibb.co/dMfN1vP/Brown-Simple-Cute-Catering-Logo-removebg-preview.png)

## 🚀 Tính Năng Chính

### 👥 Dành cho Khách Hàng
- 📖 **Xem thực đơn**: Duyệt món ăn theo danh mục.
- 🍽️ **Đặt món**: Chọn món, thêm ghi chú và gửi đơn hàng.
- 🪑 **Theo dõi bàn**: Kiểm tra trạng thái bàn đang sử dụng.
- ✋ **Gọi nhân viên**: Gửi yêu cầu hỗ trợ trực tiếp.

### 👨‍🍳 Dành cho Nhân Viên & Quản Lý
- 📦 **Quản lý đơn hàng**: Theo dõi và xử lý đơn theo thời gian thực.
- 🪑 **Quản lý bàn**: Cập nhật trạng thái và thông tin bàn.
- 📋 **Quản lý thực đơn**: Thêm, sửa, xóa món ăn và danh mục.
- 👤 **Quản lý nhân viên**: Tạo, sửa, xóa nhân sự (Admin).
- 📊 **Thống kê doanh thu**: Báo cáo, phân tích hiệu suất bán hàng.
- 🔔 **Thông báo real-time**: Nhận ngay khi có đơn mới hoặc yêu cầu từ khách hàng.

---

## 🛠️ Công Nghệ Sử Dụng

### 📱 Frontend
- **React**: Xây dựng giao diện người dùng.
- **Redux**: Quản lý state toàn cục.
- **Tailwind CSS**: Tạo UI hiện đại, responsive.
- **SockJS + STOMP**: Giao tiếp real-time.
- **React Icons**: Thư viện biểu tượng đẹp mắt.

### ☕ Backend
- **Spring Boot**: Xây dựng RESTful API nhanh chóng.
- **Spring Security + JWT**: Xác thực và phân quyền.
- **Spring Data JPA**: Giao tiếp với cơ sở dữ liệu.
- **WebSocket**: Real-time giữa client và server.

---

## 🧱 Cấu Trúc Dự Án

### 📂 Frontend – `food-house/`
```bash
food-house/
├── components/              # Thành phần UI chung
├── auth/                   # Đăng nhập, đăng ký, hồ sơ
├── home/                   # Trang chính
├── menu/                   # Quản lý và hiển thị thực đơn
├── orders/                 # Quản lý đơn hàng
├── tables/                 # Quản lý bàn
├── staff-management/       # Quản lý nhân sự
├── payment/                # Xử lý thanh toán
├── redux/                  # Redux store
│   └── slices/             # Auth, order, menu, ...
├── api/                    # Giao tiếp với backend (REST)
└── services/               # WebSocket, Auth, ...

### 📂 Backend – `server/`

```bash

server/
├── controllers/            # REST API Controllers
├── services/               # Business logic
├── repositories/           # DAO interfaces
├── entities/               # JPA Entities
├── dto/                    # DTO objects
├── config/                 # WebSocket, Security config
├── events/                 # Xử lý sự kiện
└── enums/                  # Trạng thái, vai trò, ...

````

---

## ⚙️ Hướng Dẫn Cài Đặt

### Yêu cầu hệ thống
- **Node.js** >= 14.x
- **Java** >= 17
- **Maven** hoặc **Gradle**
- **MySQL** hoặc **PostgreSQL**

### 📱 Cài đặt Frontend

```bash
cd food-house
npm install
npm run dev
````

### ☕ Cài đặt Backend

```bash
cd server
./mvnw spring-boot:run
```

> Lưu ý: Bạn cần cấu hình database phù hợp trong `application.properties`.

---

## 🔐 Phân Quyền Người Dùng

| Vai Trò      | Quyền                                                            |
| ------------ | ---------------------------------------------------------------- |
| **Admin**    | Toàn quyền quản lý hệ thống (nhân viên, đơn hàng, thực đơn, bàn) |
| **Manager**  | Quản lý đơn hàng, thống kê, xử lý thanh toán                     |
| **Staff**    | Xử lý đơn hàng,đặt món, hỗ trợ khách hàng                        |
| **Customer** | Đặt món, xem bàn, gọi nhân viên, thanh toán                      |

---

## 🔔 Giao Tiếp Real-Time

Hệ thống sử dụng **WebSocket (STOMP over SockJS)** để giao tiếp giữa client và server theo thời gian thực.

**Các sự kiện chính bao gồm:**

* 📥 Đơn hàng mới từ khách hàng.
* 🧾 Cập nhật trạng thái đơn hàng.
* 🪑 Cập nhật trạng thái bàn.
* ✋ Gọi nhân viên từ khách.

---

## 🖼️ Hình Ảnh Demo

> *(Chèn các ảnh giao diện, sơ đồ kiến trúc hoặc video demo nếu có)*

---

## 👤 Tác Giả

* **Đinh Nguyên Chung**
* Email: [dinhnguyenchung240403@gmail.com](mailto:your@email.com)
* GitHub: [github.com/your-profile](https://github.com/your-profile)

---

## 📄 Giấy Phép

Dự án này được phân phối theo giấy phép [Bởi tôi](LICENSE).

---

## 💡 Gợi Ý Mở Rộng

* Tích hợp thanh toán VNPay, Momo hoặc Stripe.
* Thêm tính năng đặt bàn trước.
* Hệ thống đánh giá món ăn và nhân viên.
* Dashboard hiển thị biểu đồ doanh thu (Chart.js / Recharts).

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho ⭐ trên GitHub!

