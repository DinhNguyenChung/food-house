package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.iuh.fit.server.dto.*;
import vn.edu.iuh.fit.server.entities.MenuItem;
import vn.edu.iuh.fit.server.entities.Order;
import vn.edu.iuh.fit.server.entities.OrderItem;
import vn.edu.iuh.fit.server.entities.User;
import vn.edu.iuh.fit.server.entities.Table;
import vn.edu.iuh.fit.server.enums.OrderStatus;
import vn.edu.iuh.fit.server.enums.TableStatus;
import vn.edu.iuh.fit.server.exceptions.ResourceNotFoundException;
import vn.edu.iuh.fit.server.repositories.MenuItemRepository;
import vn.edu.iuh.fit.server.repositories.OrderItemRepository;
import vn.edu.iuh.fit.server.repositories.OrderRepository;
import vn.edu.iuh.fit.server.repositories.TableRepository;
import vn.edu.iuh.fit.server.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;


    @Autowired
    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        MenuItemRepository menuItemRepository,
                        TableRepository tableRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableId(tableId).stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        return convertToOrderDTO(order);
    }

    public List<OrderDTO> getRecentOrders() {
        return orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {
        // Kiểm tra bàn tồn tại
        Table table = tableRepository.findById(createOrderDTO.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn với ID: " + createOrderDTO.getTableId()));
        // Kiểm tra bàn đã đặt chưa
        // Kiểm tra bàn đã được sử dụng chưa
        if (table.getStatus() == TableStatus.IN_USE) {
            throw new IllegalStateException("Bàn đã được đặt và đang sử dụng. Vui lòng gọi thêm món nếu quý khách cần!");
        }
        // Kiểm tra nhân viên tồn tại
        User staff = null;
        if (createOrderDTO.getStaffId() != null) {
            staff = userRepository.findById(createOrderDTO.getStaffId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + createOrderDTO.getStaffId()));
        }
        // Tạo đơn hàng mới
        Order order = new Order();
        order.setTable(table);
        order.setCustomerName(createOrderDTO.getCustomerName());
        order.setStaff(staff);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setDiscountPercent(0.0);
        order.setTipAmount(0.0);

        // Lưu đơn hàng trước để có ID
        Order savedOrder = orderRepository.save(order);

        // Tạo danh sách món ăn
        List<OrderItem> orderItems = new ArrayList<>();
        Double totalAmount = 0.0;

        for (CreateOrderItemDTO itemDTO : createOrderDTO.getItems()) {
            // Kiểm tra món ăn tồn tại
            MenuItem menuItem = menuItemRepository.findById(itemDTO.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + itemDTO.getMenuItemId()));

            // Tính toán giá tiền
            double itemPrice = menuItem.getPrice();
            int discount = (itemDTO.getDiscount() != null) ? itemDTO.getDiscount() : 0;
            double discountAmount = (itemPrice * itemDTO.getQuantity() * discount) / 100;
            double totalItemPrice = (itemPrice * itemDTO.getQuantity()) - discountAmount;

            // Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemPrice);
            orderItem.setDiscount(discount);
            orderItem.setTotalPrice(totalItemPrice);
            orderItem.setNote(itemDTO.getNote());

            orderItems.add(orderItem);
            totalAmount += totalItemPrice;
        }

        // Lưu danh sách món ăn
        orderItemRepository.saveAll(orderItems);

        // Cập nhật tổng tiền đơn hàng
        savedOrder.setTotalAmount(totalAmount);
        savedOrder.setOrderItems(orderItems);
        savedOrder = orderRepository.save(savedOrder);

        // Cập nhật trạng thái bàn
        table.setStatus(TableStatus.IN_USE);
        table.setCustomerName(createOrderDTO.getCustomerName());
        tableRepository.save(table);
        // Sau khi lưu đơn hàng và cập nhật trạng thái bàn
        OrderDTO orderDTO = convertToOrderDTO(savedOrder);

        // Gửi thông báo real-time qua WebSocket
        notificationService.notifyNewOrder(orderDTO);

        return convertToOrderDTO(savedOrder);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, UpdateOrderStatusDTO updateOrderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        System.out.println("===> Status: " + updateOrderDTO.getStatus());
        System.out.println("===> Equals? " + "COMPLETED".equalsIgnoreCase(updateOrderDTO.getStatus().toString()));

        order.setStatus(updateOrderDTO.getStatus());
        User cashier = null;
        if (updateOrderDTO.getCashierId() != null) {
            cashier = userRepository.findById(updateOrderDTO.getCashierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + updateOrderDTO.getCashierId()));
        }

        // Nếu đơn hàng hoàn thành, cập nhật thời gian hoàn thành và các thông tin thanh toán
        if (updateOrderDTO.getStatus() == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            order.setPaymentMethod(updateOrderDTO.getPaymentMethod());
            order.setCashier(cashier);

            // Cập nhật giảm giá và tiền tip nếu có
            if (updateOrderDTO.getDiscountPercent() != null) {
                order.setDiscountPercent(updateOrderDTO.getDiscountPercent());
                // Tính lại tổng tiền sau khi giảm giá
                double discountAmount = (order.getTotalAmount() * updateOrderDTO.getDiscountPercent()) / 100;
                order.setTotalAmount(order.getTotalAmount() - discountAmount);
            }

            if (updateOrderDTO.getTipAmount() != null) {
                order.setTipAmount(updateOrderDTO.getTipAmount());
                // Cộng thêm tiền tip vào tổng tiền
                order.setTotalAmount(order.getTotalAmount() + updateOrderDTO.getTipAmount());
            }
            order.setCompletedAt(LocalDateTime.now());
            order.setPaymentMethod(updateOrderDTO.getPaymentMethod());
            // Cập nhật trạng thái bàn
            Table table = order.getTable();
            table.setStatus(TableStatus.AVAILABLE);
            table.setCustomerName(null);
            tableRepository.save(table);
        }

        Order updatedOrder = orderRepository.save(order);
        OrderDTO orderDTO = convertToOrderDTO(updatedOrder);

        // Gửi thông báo cập nhật
        notificationService.notifyOrderUpdated(orderDTO);
        // Nếu là hoàn thành đơn và có thanh toán
        if (updateOrderDTO.getStatus() == OrderStatus.COMPLETED &&
                updateOrderDTO.getPaymentMethod() != null) {
            notificationService.notifyPaymentReceived(orderDTO);
        }
        return convertToOrderDTO(updatedOrder);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        // Xóa tất cả các món ăn trong đơn hàng
        orderItemRepository.deleteAll(order.getOrderItems());

        // Xóa đơn hàng
        orderRepository.delete(order);

        // Nếu đơn hàng đang sử dụng bàn, cập nhật trạng thái bàn
        if (OrderStatus.PENDING.equals(order.getStatus())) {
            Table table = order.getTable();
            table.setStatus(TableStatus.AVAILABLE);
            table.setCustomerName(null);
            tableRepository.save(table);
        }
    }

    public Double calculateRevenueInPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = orderRepository.calculateRevenueInPeriod(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    public List<Map<String, Object>> getTopOrderedItems() {
        List<Object[]> topItems = orderItemRepository.findTopOrderedItems();

        return topItems.stream()
                .limit(5)
                .map(item -> {
                    Map<String, Object> result = Map.of(
                            "menuItemId", item[0],
                            "menuItemName", item[1],
                            "totalQuantity", item[2]
                    );
                    return result;
                })
                .collect(Collectors.toList());
    }

    // Helper methods to convert between entity and DTO
    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTableId(order.getTable().getId());
        dto.setTableName("Bàn " + order.getTable().getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setCompletedAt(order.getCompletedAt());

        if (order.getStaff() != null) {
            dto.setStaffId(order.getStaff().getId());
            dto.setStaffName(order.getStaff().getName());
        }

        dto.setDiscountPercent(order.getDiscountPercent());
        dto.setTipAmount(order.getTipAmount());
        dto.setPaymentMethod(order.getPaymentMethod());

        // Lấy danh sách món ăn từ đơn hàng
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertToOrderItemDTO)
                .collect(Collectors.toList());

        dto.setItems(itemDTOs);

        return dto;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setOrderId(orderItem.getOrder().getId());
        dto.setMenuItemId(orderItem.getMenuItem().getId());
        dto.setMenuItemName(orderItem.getMenuItem().getName());
        dto.setMenuItemImage(orderItem.getMenuItem().getImage());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setDiscount(orderItem.getDiscount());
        dto.setTotalPrice(orderItem.getTotalPrice());
        dto.setNote(orderItem.getNote());

        return dto;
    }
}