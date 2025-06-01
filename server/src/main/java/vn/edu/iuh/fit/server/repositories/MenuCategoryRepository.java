package vn.edu.iuh.fit.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.fit.server.entities.MenuCategory;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    // Tìm danh mục theo tên
    MenuCategory findByName(String name);

    // Kiểm tra tên danh mục đã tồn tại chưa
    boolean existsByName(String name);

    // Lấy tất cả danh mục và số lượng món ăn trong từng danh mục
    @Query("SELECT c, COUNT(m) FROM MenuCategory c LEFT JOIN c.menuItems m GROUP BY c")
    List<Object[]> findAllWithItemCount();
}