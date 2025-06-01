package vn.edu.iuh.fit.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.server.entities.Table;
import vn.edu.iuh.fit.server.enums.TableStatus;

import java.util.List;

public interface TableRepository extends JpaRepository<vn.edu.iuh.fit.server.entities.Table, Long> {
    // Tìm bàn theo trạng thái
    List<Table> findByStatus(TableStatus status);

    // Kiểm tra có bàn nào có trạng thái "inUse" không
    boolean existsByStatus(TableStatus status);
}
