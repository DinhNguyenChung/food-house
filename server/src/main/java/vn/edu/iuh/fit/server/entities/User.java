package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.DepartmentStatus;
import vn.edu.iuh.fit.server.enums.RoleStatus;
import vn.edu.iuh.fit.server.enums.WorkStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String phone;
    @Enumerated(EnumType.STRING)
    private DepartmentStatus department;
    @Enumerated(EnumType.STRING)
    private WorkStatus work;
    @Enumerated(EnumType.STRING)
    private RoleStatus role;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @OneToMany(mappedBy = "staff")
    private List<Order> orders;

}