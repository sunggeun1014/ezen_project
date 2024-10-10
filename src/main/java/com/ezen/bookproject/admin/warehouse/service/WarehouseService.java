package com.ezen.bookproject.admin.warehouse.service;

import java.util.List;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;
import com.ezen.bookproject.admin.warehouse.dto.ZoneNumDTO;

public interface WarehouseService {
	
	List<WarehouseDTO> list();
	WarehouseDTO detailList(String invIsbn);
	void updateStockDetails(WarehouseDTO warehouseDTO);
	List<ZoneNumDTO> zoneNumList();
}
