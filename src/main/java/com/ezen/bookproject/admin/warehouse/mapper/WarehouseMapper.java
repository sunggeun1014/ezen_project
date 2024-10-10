package com.ezen.bookproject.admin.warehouse.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;
import com.ezen.bookproject.admin.warehouse.dto.ZoneNumDTO;

@Mapper
public interface WarehouseMapper {
	
	List<WarehouseDTO> getWarehouseList();
	WarehouseDTO getStockDetails(String invIsbn);
	void updateStockDetails(WarehouseDTO warehouseDTO);
	List<ZoneNumDTO> getZoneNumList();
	String getOneZoneNum(String isbn);
	void invQtyUpdate(String book_isbn, Integer Order_detail_qty);
}
