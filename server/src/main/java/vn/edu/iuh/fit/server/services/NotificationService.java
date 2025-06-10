package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.server.controllers.WebSocketController;
import vn.edu.iuh.fit.server.dto.NotificationDTO;
import vn.edu.iuh.fit.server.dto.OrderDTO;
import vn.edu.iuh.fit.server.dto.TableDTO;
import vn.edu.iuh.fit.server.enums.OrderStatus;

@Service
public class NotificationService {

    @Autowired
    private WebSocketController webSocketController;

    /**
     * Thông báo khi có đơn hàng mới
     */
    public void notifyNewOrder(OrderDTO orderDTO) {
        NotificationDTO notification = new NotificationDTO(
                "NEW_ORDER",
                "Đơn hàng mới #" + orderDTO.getId() + " vừa được tạo",
                orderDTO
        );

        System.out.println("Sending notification to topic orders: " + notification);
        webSocketController.sendNotificationToTopic(notification, "orders");

        System.out.println("Sending notification to role ADMIN");
        webSocketController.sendNotificationToRole(notification, "ADMIN");

        System.out.println("Sending notification to role MANAGER");
        webSocketController.sendNotificationToRole(notification, "MANAGER");
    }

    /**
     * Thông báo khi đơn hàng được cập nhật
     */
    public void notifyOrderUpdated(OrderDTO orderDTO) {
        String message;
        if (orderDTO.getStatus() == OrderStatus.COMPLETED) {
            message = "Đơn hàng #" + orderDTO.getId() + " đã hoàn thành";
        } else if (orderDTO.getStatus() == OrderStatus.CANCELLED) {
            message = "Đơn hàng #" + orderDTO.getId() + " đã bị hủy";
        } else {
            message = "Đơn hàng #" + orderDTO.getId() + " đã được cập nhật";
        }

        NotificationDTO notification = new NotificationDTO(
                "ORDER_UPDATED",
                message,
                orderDTO
        );

        webSocketController.sendNotificationToTopic(notification, "orders");
    }

    /**
     * Thông báo khi thanh toán được xác nhận
     */
    public void notifyPaymentReceived(OrderDTO orderDTO) {
        NotificationDTO notification = new NotificationDTO(
                "PAYMENT_RECEIVED",
                "Thanh toán đã được xác nhận cho đơn hàng #" + orderDTO.getId(),
                orderDTO
        );

        webSocketController.sendNotificationToTopic(notification, "payments");
        webSocketController.sendNotificationToRole(notification, "ADMIN");
    }

    /**
     * Thông báo khi trạng thái bàn thay đổi
     */
    public void notifyTableStatusChanged(TableDTO tableDTO) {
        NotificationDTO notification = new NotificationDTO(
                "TABLE_STATUS_CHANGED",
                "Trạng thái bàn #" + tableDTO.getId() + " đã thay đổi",
                tableDTO
        );

        webSocketController.sendNotificationToTopic(notification, "tables");
    }
}