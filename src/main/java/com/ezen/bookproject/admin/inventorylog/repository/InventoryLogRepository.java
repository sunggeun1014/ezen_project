package com.ezen.bookproject.admin.inventorylog.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.inventorylog.dto.InventoryLogDTO;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InventoryLogRepository {
	
	private final SqlSessionTemplate sql;

	public List<InventoryLogDTO> getInventoryLogList() {
		return sql.selectList("InventoryLog.getList");
	}
	
	public List<InventoryLogDTO> getDataFilter(SearchCondition condition) {
		return sql.selectList("InventoryLog.getList", condition);
	}
	
	public InventoryLogDTO getInventoryLogDetail(Integer log_transaction_num) {
		return sql.selectOne("InventoryLog.getDetail", log_transaction_num);
	}
	
	public void invLogRequestInsert(String log_transaction_status, String manager_id) {
		Map<String, String> map = new HashMap<>();
		
		map.put("log_transaction_status", log_transaction_status);
		map.put("manager_id", manager_id);
		sql.insert("InventoryLog.requestInsert", map);
	}
	
	public void invLogRequestDetailInsert(String isbn, String bookTitle, String zoenNum, Integer inputQty) {
		Map<String, Object> map = new HashMap<>();
		
		map.put("isbn", isbn);
		map.put("bookTitle", bookTitle);
		map.put("zoenNum", zoenNum);
		map.put("inputQty", inputQty);
		
		sql.insert("InventoryLog.requestDetailInsert", map);
	}
	
	public List<InventoryLogDTO> getInventoryLogDetailList(Integer log_transaction_num) {
		return sql.selectList("InventoryLog.getDetailList", log_transaction_num);
	}

	public List<InventoryLogDTO> getListAtHome() {
		return sql.selectList("InventoryLog.getListAtHome");
	}
}
