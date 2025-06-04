package vn.edu.iuh.fit.server.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.server.dto.CreateTableDTO;
import vn.edu.iuh.fit.server.dto.TableDTO;
import vn.edu.iuh.fit.server.dto.UpdateTableStatusDTO;
import vn.edu.iuh.fit.server.services.TableService;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    @Autowired
    private TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableDTO>> getAllTables() {
        List<TableDTO> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @PostMapping
    public ResponseEntity<TableDTO> createTable(@RequestBody CreateTableDTO createTableDTO) {
        TableDTO newTable = tableService.createTable(createTableDTO);
        return ResponseEntity.status(201).body(newTable);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TableDTO> updateTableStatus(@PathVariable Long id, @RequestBody UpdateTableStatusDTO updateTableStatusDTO) {
        TableDTO updatedTable = tableService.updateTableStatus(id, updateTableStatusDTO);
        return ResponseEntity.ok(updatedTable);
    }
}
