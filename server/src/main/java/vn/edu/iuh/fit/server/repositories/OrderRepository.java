package vn.edu.iuh.fit.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.iuh.fit.server.entities.Order;
import vn.edu.iuh.fit.server.enums.OrderStatus;
import vn.edu.iuh.fit.server.enums.TableStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<vn.edu.iuh.fit.server.entities.Order, Long> {
    // Lấy các đơn hàng có trạng thái "PENDING", sắp xếp theo createdAt giảm dần
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    // Tìm đơn hàng theo bàn
    List<Order> findByTableId(Long tableId);

    // Tìm đơn hàng theo trạng thái
    List<Order> findByStatus(OrderStatus status);

    // Tìm đơn hàng theo nhân viên
    List<Order> findByStaffId(Long staffId);

    // Tìm đơn hàng theo khoảng thời gian
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Tìm đơn hàng theo bàn và trạng thái
    List<Order> findByTableIdAndStatus(Long tableId, TableStatus status);

    // Đếm số lượng đơn hàng theo trạng thái
    long countByStatus(OrderStatus status);

    // Tính tổng doanh thu trong một khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = vn.edu.iuh.fit.server.enums.OrderStatus.COMPLETED AND o.createdAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueInPeriod(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    // Tìm đơn hàng gần đây
    List<Order> findTop10ByOrderByCreatedAtDesc();

}
