package vn.edu.iuh.fit.server.dto;

import vn.edu.iuh.fit.server.enums.DepartmentStatus;
import vn.edu.iuh.fit.server.enums.RoleStatus;
import vn.edu.iuh.fit.server.enums.WorkStatus;

import java.time.LocalDateTime;

public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private RoleStatus role;
    private DepartmentStatus department;
    private WorkStatus workStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleStatus getRole() {
        return role;
    }

    public void setRole(RoleStatus role) {
        this.role = role;
    }

    public DepartmentStatus getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentStatus department) {
        this.department = department;
    }

    public WorkStatus getWorkStatus() {
        return workStatus;
    }

    public void setWorkStatus(WorkStatus workStatus) {
        this.workStatus = workStatus;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
