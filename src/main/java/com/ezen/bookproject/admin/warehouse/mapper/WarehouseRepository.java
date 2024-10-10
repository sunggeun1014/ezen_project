package com.ezen.bookproject.admin.warehouse.mapper;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class WarehouseRepository {
	private final SqlSessionTemplate sql;
	
	
	public String getZoneNum(String isbn) {
		return sql.selectOne("Warehouse.getOneZoneNum", isbn);
	}
	
	public void invQtyUpdate(String book_isbn, Integer Order_detail_qty) {
		WarehouseDTO dto = new WarehouseDTO();
		
		dto.setInv_isbn(book_isbn);
		dto.setInv_qty(Order_detail_qty);
		sql.update("Warehouse.invQtyUpdate", dto);
	}
	
}
