package com.ezen.bookproject.admin.inventorylog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.admin.inventorylog.dto.InventoryLogDTO;
import com.ezen.bookproject.admin.inventorylog.repository.InventoryLogRepository;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryLogServiceImpl implements InventoryLogService {
	
	private final InventoryLogRepository ilr;
	
	@Override
	public List<InventoryLogDTO> getInventoryLogList() {
		try {
			return ilr.getInventoryLogList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public List<InventoryLogDTO> getDataFilter(SearchCondition condition) {
		try {
			return ilr.getDataFilter(condition);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public InventoryLogDTO getInventoryLogDetail(Integer log_transaction_num) {
		try {
			return ilr.getInventoryLogDetail(log_transaction_num);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<InventoryLogDTO> getInventoryLogDetailList(Integer log_transaction_num) {
		try {
			return ilr.getInventoryLogDetailList(log_transaction_num);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public List<InventoryLogDTO> getListAtHome() {
		try {
			return ilr.getListAtHome();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}
}
