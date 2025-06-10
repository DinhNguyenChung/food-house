package vn.edu.iuh.fit.server.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import vn.edu.iuh.fit.server.dto.NotificationDTO;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Xử lý tin nhắn gửi đến /app/notification
     * Broadcast đến tất cả subscribers tại /topic/notifications
     */
    @MessageMapping("/notification")
    @SendTo("/topic/notifications")
    public NotificationDTO broadcastNotification(NotificationDTO notification) {
        return notification;
    }

    /**
     * Gửi thông báo đến một role cụ thể
     */
    public void sendNotificationToRole(NotificationDTO notification, String role) {
        messagingTemplate.convertAndSend("/queue/role/" + role, notification);
    }

    /**
     * Gửi thông báo đến một topic
     */
    public void sendNotificationToTopic(NotificationDTO notification, String topic) {
        messagingTemplate.convertAndSend("/topic/" + topic, notification);
    }

    /**
     * Gửi thông báo đến một người dùng cụ thể
     */
    public void sendNotificationToUser(NotificationDTO notification, String userId) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
}