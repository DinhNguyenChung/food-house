package vn.edu.iuh.fit.server.dto;

import jakarta.validation.constraints.NotBlank;
import vn.edu.iuh.fit.server.enums.OrderStatus;

public class UpdateOrderStatusDTO {
    @NotBlank(message = "Trạng thái không được để trống")
    private OrderStatus status;

    private String paymentMethod;

    private Double discountPercent;

    private Double tipAmount;

    // Getters and Setters
    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public Double getTipAmount() {
        return tipAmount;
    }

    public void setTipAmount(Double tipAmount) {
        this.tipAmount = tipAmount;
    }
}
