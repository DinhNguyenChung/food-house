package vn.edu.iuh.fit.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.fit.server.entities.MenuItem;
import vn.edu.iuh.fit.server.enums.MenuStatus;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Tìm món ăn theo danh mục
    List<MenuItem> findByCategoryId(Long categoryId);

    // Tìm món ăn theo tên (không phân biệt chữ hoa thường)
    @Query("SELECT m FROM MenuItem m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MenuItem> searchByName(@Param("keyword") String keyword);

    // Tìm món ăn theo danh mục và trạng thái
    List<MenuItem> findByCategoryIdAndStatus(Long categoryId, MenuStatus status);

    // Tìm tất cả món ăn có sẵn
    List<MenuItem> findByStatus(MenuStatus status);
}