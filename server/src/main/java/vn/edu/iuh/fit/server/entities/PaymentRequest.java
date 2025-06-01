package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@jakarta.persistence.Table(name = "payment_requests")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "table_id")
    private Table table;
    
    private LocalDateTime requestTime;
    private LocalDateTime completedTime;
    
    // pending, completed
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    

}