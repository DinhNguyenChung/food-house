package vn.edu.iuh.fit.server.services.impl;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.iuh.fit.server.dto.CreateOrderDTO;
import vn.edu.iuh.fit.server.entities.Order;
import vn.edu.iuh.fit.server.repositories.OrderRepository;
import vn.edu.iuh.fit.server.services.OrderServices;

import java.time.LocalDateTime;

@Service
public class OrderServiceImpl implements OrderServices {
    private final OrderRepository orderRepo;
    private final SimpMessagingTemplate ws;
    private final KafkaTemplate<String, String> kafka;

    // Constructor phải đặt đúng tên lớp: OrderServiceImpl
    public OrderServiceImpl(OrderRepository orderRepo,
                            SimpMessagingTemplate ws,
                            KafkaTemplate<String, String> kafka) {
        this.orderRepo = orderRepo;
        this.ws = ws;
        this.kafka = kafka;
    }

    @Override
    @Transactional
    public Order createOrder(CreateOrderDTO dto) {
        // map DTO -> Entity
        Order order = new Order();
        // TODO: thiết lập table, items từ dto
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepo.save(order);

        // realtime qua WebSocket
        ws.convertAndSend("/topic/orders", order);

        // gửi sự kiện Kafka
        kafka.send("new-orders", order.getId().toString());
        return order;
    }
}
