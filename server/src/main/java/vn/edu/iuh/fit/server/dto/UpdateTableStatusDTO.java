package vn.edu.iuh.fit.server.dto;

import vn.edu.iuh.fit.server.enums.TableStatus;

public class UpdateTableStatusDTO {
    private TableStatus status;

    public UpdateTableStatusDTO() {
    }

    public UpdateTableStatusDTO(TableStatus status) {
        this.status = status;
    }

    public TableStatus getStatus() {
        return status;
    }

    public void setStatus(TableStatus status) {
        this.status = status;
    }
}
