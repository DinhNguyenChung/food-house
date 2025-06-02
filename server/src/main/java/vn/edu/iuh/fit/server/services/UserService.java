package vn.edu.iuh.fit.server.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.server.config.JwtTokenUtil;
import vn.edu.iuh.fit.server.dto.*;
import vn.edu.iuh.fit.server.entities.User;
import vn.edu.iuh.fit.server.enums.DepartmentStatus;
import vn.edu.iuh.fit.server.enums.RoleStatus;
import vn.edu.iuh.fit.server.enums.WorkStatus;
import vn.edu.iuh.fit.server.repositories.UserRepository;
import vn.edu.iuh.fit.server.exceptions.UserAlreadyExistsException;
import vn.edu.iuh.fit.server.exceptions.InvalidCredentialsException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public UserResponseDTO registerUser(UserRegistrationDTO dto) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("Email đã được sử dụng");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());

        // Thiết lập mặc định nếu thiếu
        user.setDepartment(dto.getDepartment() != null ? dto.getDepartment() : DepartmentStatus.SERVER);
        user.setWork(dto.getWorkStatus() != null ? dto.getWorkStatus() : WorkStatus.WORKING);
        user.setRole(dto.getRole() != null ? dto.getRole() : RoleStatus.STAFF);

        user.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDateTime.now());
//        user.setEndDate(dto.getEndDate()); // optional

        // Lưu vào DB
        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    public LoginResponseDTO loginUser(UserLoginDTO loginDTO) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email hoặc mật khẩu không đúng"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email hoặc mật khẩu không đúng");
        }

        // Tạo JWT token
        String token = jwtTokenUtil.generateToken(user.getEmail());

        // Chuẩn bị response
        UserResponseDTO userDTO = convertToDTO(user);
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(userDTO);

        return response;
    }
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToDTO).toList();
    }

    public void changePassword(UserChangePasswordDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email không tồn tại"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        if (dto.getDepartment() != null) user.setDepartment(dto.getDepartment());
        if (dto.getWorkStatus() != null) user.setWork(dto.getWorkStatus());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getStartDate() != null) user.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) user.setEndDate(dto.getEndDate());

        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }


    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setDepartment(user.getDepartment());
        dto.setWorkStatus(user.getWork());
        dto.setStartDate(user.getStartDate());
        dto.setEndDate(user.getEndDate());
        return dto;
    }
}