package vn.edu.iuh.fit.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private String token;
    private UserResponseDTO user;
}
