package com.ezen.bookproject.admin.inventorylog.service;

import java.util.List;

import com.ezen.bookproject.admin.inventorylog.dto.InventoryLogDTO;
import com.ezen.bookproject.commons.SearchCondition;

public interface InventoryLogService {

	public List<InventoryLogDTO> getInventoryLogList();
	public List<InventoryLogDTO> getDataFilter(SearchCondition condition);
	public InventoryLogDTO getInventoryLogDetail(Integer log_transaction_num);
	public List<InventoryLogDTO> getInventoryLogDetailList(Integer log_transaction_num);
	public List<InventoryLogDTO> getListAtHome();
}
