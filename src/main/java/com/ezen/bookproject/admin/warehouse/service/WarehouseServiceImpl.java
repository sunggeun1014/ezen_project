package com.ezen.bookproject.admin.warehouse.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;
import com.ezen.bookproject.admin.warehouse.dto.ZoneNumDTO;
import com.ezen.bookproject.admin.warehouse.mapper.WarehouseMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class WarehouseServiceImpl implements WarehouseService{

	WarehouseMapper warehouseMapper;
	
	@Override
	@Transactional(readOnly = true)
    public List<WarehouseDTO> list() {
		
        return warehouseMapper.getWarehouseList();
    }
	
	@Override
    @Transactional(readOnly = true)
    public WarehouseDTO detailList(String invIsbn) {
		
    	return warehouseMapper.getStockDetails(invIsbn);
    }
    
	@Override
    @Transactional(readOnly = true)
    public void updateStockDetails(WarehouseDTO warehouseDTO) {
		
		warehouseMapper.updateStockDetails(warehouseDTO);
    }
    
	@Override
	@Transactional(readOnly = true)
	public List<ZoneNumDTO> zoneNumList() {
		
		return warehouseMapper.getZoneNumList();
	}
	
}
