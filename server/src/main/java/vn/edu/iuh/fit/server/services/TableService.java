package vn.edu.iuh.fit.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.iuh.fit.server.dto.CreateTableDTO;
import vn.edu.iuh.fit.server.dto.TableDTO;
import vn.edu.iuh.fit.server.dto.UpdateTableStatusDTO;
import vn.edu.iuh.fit.server.entities.Table;
import vn.edu.iuh.fit.server.exceptions.ResourceNotFoundException;
import vn.edu.iuh.fit.server.mappers.TableMapper;
import vn.edu.iuh.fit.server.repositories.TableRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private TableMapper tableMapper;

    public List<TableDTO> getAllTables() {
        List<Table> tables = tableRepository.findAll();
        return tables.stream()
                .map(tableMapper::tableToTableDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TableDTO createTable(CreateTableDTO createTableDTO) {
        Table table = tableMapper.createTableDTOToTable(createTableDTO);
        Table savedTable = tableRepository.save(table);
        return tableMapper.tableToTableDTO(savedTable);
    }

    @Transactional
    public TableDTO updateTableStatus(Long id, UpdateTableStatusDTO updateTableStatusDTO) {
        Table table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with ID: " + id));
        table.setStatus(updateTableStatusDTO.getStatus());
        Table updatedTable = tableRepository.save(table);
        return tableMapper.tableToTableDTO(updatedTable);
    }
}