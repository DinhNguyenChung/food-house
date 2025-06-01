package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.server.dto.MenuItemDTO;
import vn.edu.iuh.fit.server.entities.MenuCategory;
import vn.edu.iuh.fit.server.entities.MenuItem;
import vn.edu.iuh.fit.server.enums.MenuStatus;
import vn.edu.iuh.fit.server.exceptions.ResourceNotFoundException;
import vn.edu.iuh.fit.server.repositories.MenuCategoryRepository;
import vn.edu.iuh.fit.server.repositories.MenuItemRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository,
                           MenuCategoryRepository menuCategoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuCategoryRepository = menuCategoryRepository;
    }

    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemDTO> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemDTO> searchMenuItems(String keyword) {
        return menuItemRepository.searchByName(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemDTO> getAvailableMenuItems() {
        return menuItemRepository.findByStatus(MenuStatus.AVAILABLE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));

        return convertToDTO(menuItem);
    }

    public MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO) {
        MenuCategory category = menuCategoryRepository.findById(menuItemDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + menuItemDTO.getCategoryId()));

        MenuItem menuItem = convertToEntity(menuItemDTO);
        menuItem.setCategory(category);

        // Mặc định trạng thái là available nếu không được chỉ định
        if (menuItem.getStatus() == null) {
            menuItem.setStatus(MenuStatus.AVAILABLE);
        }

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToDTO(savedMenuItem);
    }

    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO menuItemDTO) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));

        // Cập nhật thông tin của món ăn
        existingMenuItem.setName(menuItemDTO.getName());
        existingMenuItem.setPrice(menuItemDTO.getPrice());
        existingMenuItem.setImage(menuItemDTO.getImage());
        existingMenuItem.setDescription(menuItemDTO.getDescription());
        existingMenuItem.setStatus(menuItemDTO.getStatus());

        // Cập nhật danh mục nếu đã thay đổi
        if (!existingMenuItem.getCategory().getId().equals(menuItemDTO.getCategoryId())) {
            MenuCategory newCategory = menuCategoryRepository.findById(menuItemDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + menuItemDTO.getCategoryId()));

            existingMenuItem.setCategory(newCategory);
        }

        MenuItem updatedMenuItem = menuItemRepository.save(existingMenuItem);
        return convertToDTO(updatedMenuItem);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id);
        }

        menuItemRepository.deleteById(id);
    }

    public MenuItemDTO updateMenuItemStatus(Long id, MenuStatus status) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + id));

        menuItem.setStatus(status);
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);

        return convertToDTO(updatedMenuItem);
    }

    // Helper methods to convert between entity and DTO
    private MenuItemDTO convertToDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setPrice(menuItem.getPrice());
        dto.setImage(menuItem.getImage());
        dto.setDescription(menuItem.getDescription());
        dto.setStatus(menuItem.getStatus());

        if (menuItem.getCategory() != null) {
            dto.setCategoryId(menuItem.getCategory().getId());
            dto.setCategoryName(menuItem.getCategory().getName());
        }

        return dto;
    }

    private MenuItem convertToEntity(MenuItemDTO dto) {
        MenuItem menuItem = new MenuItem();
        // Không set ID khi tạo mới, chỉ set khi cập nhật
        if (dto.getId() != null) {
            menuItem.setId(dto.getId());
        }
        menuItem.setName(dto.getName());
        menuItem.setPrice(dto.getPrice());
        menuItem.setImage(dto.getImage());
        menuItem.setDescription(dto.getDescription());
        menuItem.setStatus(dto.getStatus());

        return menuItem;
    }
}