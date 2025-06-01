package vn.edu.iuh.fit.server.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.server.dto.MenuCategoryDTO;
import vn.edu.iuh.fit.server.dto.MenuItemDTO;
import vn.edu.iuh.fit.server.enums.MenuStatus;
import vn.edu.iuh.fit.server.exceptions.ResourceAlreadyExistsException;
import vn.edu.iuh.fit.server.exceptions.ResourceNotFoundException;
import vn.edu.iuh.fit.server.services.MenuCategoryService;
import vn.edu.iuh.fit.server.services.MenuItemService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuCategoryService menuCategoryService;
    private final MenuItemService menuItemService;

    @Autowired
    public MenuController(MenuCategoryService menuCategoryService, MenuItemService menuItemService) {
        this.menuCategoryService = menuCategoryService;
        this.menuItemService = menuItemService;
    }

    // ===== Menu Category APIs =====

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategoryDTO>> getAllCategories() {
        List<MenuCategoryDTO> categories = menuCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            MenuCategoryDTO category = menuCategoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@Valid @RequestBody MenuCategoryDTO categoryDTO) {
        try {
            MenuCategoryDTO createdCategory = menuCategoryService.createCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (ResourceAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody MenuCategoryDTO categoryDTO) {
        try {
            MenuCategoryDTO updatedCategory = menuCategoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(updatedCategory);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (ResourceAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            menuCategoryService.deleteCategory(id);
            return ResponseEntity.ok("Danh mục đã được xóa thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ===== Menu Item APIs =====

    @GetMapping("/items")
    public ResponseEntity<List<MenuItemDTO>> getAllMenuItems() {
        List<MenuItemDTO> menuItems = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/items/search")
    public ResponseEntity<List<MenuItemDTO>> searchMenuItems(@RequestParam String keyword) {
        List<MenuItemDTO> menuItems = menuItemService.searchMenuItems(keyword);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/items/available")
    public ResponseEntity<List<MenuItemDTO>> getAvailableMenuItems() {
        List<MenuItemDTO> menuItems = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/categories/{categoryId}/items")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByCategory(@PathVariable Long categoryId) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByCategory(categoryId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        try {
            MenuItemDTO menuItem = menuItemService.getMenuItemById(id);
            return ResponseEntity.ok(menuItem);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> createMenuItem(@Valid @RequestBody MenuItemDTO menuItemDTO) {
        try {
            MenuItemDTO createdMenuItem = menuItemService.createMenuItem(menuItemDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMenuItem);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemDTO menuItemDTO) {
        try {
            MenuItemDTO updatedMenuItem = menuItemService.updateMenuItem(id, menuItemDTO);
            return ResponseEntity.ok(updatedMenuItem);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok("Món ăn đã được xóa thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/items/{id}/status")
    public ResponseEntity<?> updateMenuItemStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            if (statusStr == null || statusStr.isBlank()) {
                return ResponseEntity.badRequest().body("Trạng thái không được để trống");
            }

            MenuStatus status;
            try {
                status = MenuStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Trạng thái không hợp lệ: " + statusStr);
            }

            MenuItemDTO updatedMenuItem = menuItemService.updateMenuItemStatus(id, status);
            return ResponseEntity.ok(updatedMenuItem);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}