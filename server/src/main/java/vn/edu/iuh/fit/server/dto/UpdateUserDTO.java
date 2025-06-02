package vn.edu.iuh.fit.server.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.edu.iuh.fit.server.enums.DepartmentStatus;
import vn.edu.iuh.fit.server.enums.RoleStatus;
import vn.edu.iuh.fit.server.enums.WorkStatus;

import java.time.LocalDateTime;
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateUserDTO {
    private String name;
    private String email;
    private String password;  // không cần @NotBlank
    private String phone;
    private DepartmentStatus department;
    private WorkStatus workStatus;
    private RoleStatus role;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

}
