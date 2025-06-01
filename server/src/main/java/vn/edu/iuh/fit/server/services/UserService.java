package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.server.dto.UserChangePasswordDTO;
import vn.edu.iuh.fit.server.entities.User;
import vn.edu.iuh.fit.server.enums.DepartmentStatus;
import vn.edu.iuh.fit.server.enums.RoleStatus;
import vn.edu.iuh.fit.server.enums.WorkStatus;
import vn.edu.iuh.fit.server.repositories.UserRepository;
import vn.edu.iuh.fit.server.dto.UserRegistrationDTO;
import vn.edu.iuh.fit.server.dto.UserLoginDTO;
import vn.edu.iuh.fit.server.dto.UserResponseDTO;
    import vn.edu.iuh.fit.server.exceptions.UserAlreadyExistsException;
import vn.edu.iuh.fit.server.exceptions.InvalidCredentialsException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        user.setEndDate(dto.getEndDate()); // optional

        // Lưu vào DB
        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    public UserResponseDTO loginUser(UserLoginDTO loginDTO) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email hoặc mật khẩu không đúng"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email hoặc mật khẩu không đúng");
        }

        return convertToDTO(user);
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