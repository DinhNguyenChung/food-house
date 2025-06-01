package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.server.dto.MenuCategoryDTO;
import vn.edu.iuh.fit.server.entities.MenuCategory;
import vn.edu.iuh.fit.server.exceptions.ResourceAlreadyExistsException;
import vn.edu.iuh.fit.server.exceptions.ResourceNotFoundException;
import vn.edu.iuh.fit.server.repositories.MenuCategoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuCategoryService {

    private final MenuCategoryRepository menuCategoryRepository;

    @Autowired
    public MenuCategoryService(MenuCategoryRepository menuCategoryRepository) {
        this.menuCategoryRepository = menuCategoryRepository;
    }

    public List<MenuCategoryDTO> getAllCategories() {
        List<Object[]> categoriesWithCount = menuCategoryRepository.findAllWithItemCount();

        return categoriesWithCount.stream().map(obj -> {
            MenuCategory category = (MenuCategory) obj[0];
            Long count = (Long) obj[1];

            MenuCategoryDTO dto = convertToDTO(category);
            dto.setItemCount(count.intValue());
            return dto;
        }).collect(Collectors.toList());
    }

    public MenuCategoryDTO getCategoryById(Long id) {
        MenuCategory category = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        return convertToDTO(category);
    }

    public MenuCategoryDTO createCategory(MenuCategoryDTO categoryDTO) {
        if (menuCategoryRepository.existsByName(categoryDTO.getName())) {
            throw new ResourceAlreadyExistsException("Danh mục với tên " + categoryDTO.getName() + " đã tồn tại");
        }

        MenuCategory category = convertToEntity(categoryDTO);
        MenuCategory savedCategory = menuCategoryRepository.save(category);

        return convertToDTO(savedCategory);
    }

    public MenuCategoryDTO updateCategory(Long id, MenuCategoryDTO categoryDTO) {
        MenuCategory existingCategory = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        // Kiểm tra nếu tên mới đã tồn tại và không phải là danh mục hiện tại
        if (!existingCategory.getName().equals(categoryDTO.getName())
                && menuCategoryRepository.existsByName(categoryDTO.getName())) {
            throw new ResourceAlreadyExistsException("Danh mục với tên " + categoryDTO.getName() + " đã tồn tại");
        }

        existingCategory.setName(categoryDTO.getName());
        existingCategory.setImage(categoryDTO.getImage());
        existingCategory.setDescription(categoryDTO.getDescription());

        MenuCategory updatedCategory = menuCategoryRepository.save(existingCategory);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!menuCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id);
        }

        menuCategoryRepository.deleteById(id);
    }

    // Helper methods to convert between entity and DTO
    private MenuCategoryDTO convertToDTO(MenuCategory category) {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setImage(category.getImage());
        dto.setDescription(category.getDescription());

        // Số lượng món ăn sẽ được thiết lập ở phương thức gọi nếu cần
        if (category.getMenuItems() != null) {
            dto.setItemCount(category.getMenuItems().size());
        }

        return dto;
    }

    private MenuCategory convertToEntity(MenuCategoryDTO dto) {
        MenuCategory category = new MenuCategory();
        // Không set ID khi tạo mới, chỉ set khi cập nhật
        if (dto.getId() != null) {
            category.setId(dto.getId());
        }
        category.setName(dto.getName());
        category.setImage(dto.getImage());
        category.setDescription(dto.getDescription());

        return category;
    }
}