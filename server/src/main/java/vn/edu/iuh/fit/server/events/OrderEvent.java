package vn.edu.iuh.fit.server.events;

import java.time.LocalDateTime;

public class OrderEvent {
    private Long orderId;
    private String customerName;
    private LocalDateTime createdAt;

    // Default constructor cần thiết cho Jackson
    public OrderEvent() { }

    public OrderEvent(Long orderId, String customerName, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.createdAt = createdAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "OrderEvent{" +
                "orderId=" + orderId +
                ", customerName='" + customerName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
