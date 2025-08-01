package vn.edu.iuh.fit.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.TableStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTableDTO {
    private TableStatus status;
    private String customerName;
}