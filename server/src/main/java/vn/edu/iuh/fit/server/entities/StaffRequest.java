package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.StaffRequestStatus;

import java.time.LocalDateTime;

@Entity
@jakarta.persistence.Table(name = "staff_requests")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StaffRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "table_id")
    private Table table;
    
    private String reason;
    private LocalDateTime requestTime;
    private LocalDateTime completedTime;
    
    // pending, completed
    @Enumerated(EnumType.STRING)
    private StaffRequestStatus status;
    
}