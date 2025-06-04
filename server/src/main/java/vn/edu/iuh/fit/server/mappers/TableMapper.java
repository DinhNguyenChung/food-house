package vn.edu.iuh.fit.server.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import vn.edu.iuh.fit.server.dto.CreateTableDTO;
import vn.edu.iuh.fit.server.dto.TableDTO;
import vn.edu.iuh.fit.server.entities.Table;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TableMapper {
    TableMapper INSTANCE = Mappers.getMapper(TableMapper.class);

    @Mapping(source = "customerName", target = "customerName")
    @Mapping(source = "status", target = "status")
    TableDTO tableToTableDTO(Table table);

    List<TableDTO> tablesToTableDTOs(List<Table> tables);

    @Mapping(source = "customerName", target = "customerName")
    @Mapping(source = "status", target = "status")
    Table createTableDTOToTable(CreateTableDTO createTableDTO);
}