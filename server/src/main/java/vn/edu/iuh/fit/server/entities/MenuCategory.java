package vn.edu.iuh.fit.server.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "menu_categories")
@NoArgsConstructor
@Getter
@Setter
public class MenuCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String image;
    private String description;
    
    @OneToMany(mappedBy = "category")
    private List<MenuItem> menuItems;

    public MenuCategory(String name, String image, String description, List<MenuItem> menuItems) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.menuItems = menuItems;
    }

}