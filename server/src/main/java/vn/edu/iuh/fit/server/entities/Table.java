package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.TableStatus;

import java.util.List;

@Entity
@jakarta.persistence.Table(name = "tables")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Trạng thái: available, reserved, inUse
    @Enumerated(EnumType.STRING)
    private TableStatus status;
    private String customerName;
    
    @OneToMany(mappedBy = "table")
    private List<Order> orders;
    

}