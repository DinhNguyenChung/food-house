package vn.edu.iuh.fit.server.services;

import vn.edu.iuh.fit.server.dto.CreateOrderDTO;
import vn.edu.iuh.fit.server.entities.Order;

public interface OrderServices {
    Order createOrder(CreateOrderDTO orderDto);

}
