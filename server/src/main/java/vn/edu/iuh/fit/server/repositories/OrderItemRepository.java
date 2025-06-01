package vn.edu.iuh.fit.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.fit.server.entities.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Tìm các món ăn trong đơn hàng
    List<OrderItem> findByOrderId(Long orderId);

    // Đếm số lượng món ăn đã bán
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = vn.edu.iuh.fit.server.enums.OrderStatus.COMPLETED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    Integer countSoldItemsInPeriod(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    // Tìm top 5 món ăn được đặt nhiều nhất
    @Query("SELECT oi.menuItem.id, oi.menuItem.name, SUM(oi.quantity) as totalQuantity " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = vn.edu.iuh.fit.server.enums.OrderStatus.COMPLETED " +
            "GROUP BY oi.menuItem.id, oi.menuItem.name " +
            "ORDER BY totalQuantity DESC")
    List<Object[]> findTopOrderedItems();

}