package vn.edu.iuh.fit.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String id;
    private String type; // "NEW_ORDER", "ORDER_UPDATED", "ORDER_COMPLETED", "PAYMENT_RECEIVED"
    private String message;
    private Object data; // Dữ liệu liên quan (có thể là OrderDTO, UserDTO, v.v.)
    private LocalDateTime timestamp;

    // Constructor tiện lợi
    public NotificationDTO(String type, String message, Object data) {
        this.id = java.util.UUID.randomUUID().toString();
        this.type = type;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
}