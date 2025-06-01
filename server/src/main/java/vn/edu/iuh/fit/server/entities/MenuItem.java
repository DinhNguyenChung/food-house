package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.MenuStatus;

import java.util.List;

@Entity
@Table(name = "menu_items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double price;
    private String image;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private MenuCategory category;
    
    // Thêm trạng thái món (available, soldout)
    @Enumerated(EnumType.STRING)
    private MenuStatus status;
    
    @OneToMany(mappedBy = "menuItem")
    private List<OrderItem> orderItems;
    
    // Constructors, getters, setters
}