package com.ezen.bookproject.admin.inventorylog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ezen.bookproject.admin.inventorylog.service.InventoryLogService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/inventoryLog")
public class InventoryLogController {
	
	private final InventoryLogService ils;
	
	@GetMapping("/detail")
	public String getInventoryLogDetail(Model model, Integer log_transaction_num) {

		model.addAttribute("detail", ils.getInventoryLogDetail(log_transaction_num));
		model.addAttribute("detailList", ils.getInventoryLogDetailList(log_transaction_num));
		
		return "/admin/inventory_log/inventoryLogDetail";
	}
	
	@GetMapping("/list")
	public String inventoryLog() {
		return "/admin/inventory_log/inventoryLogList";
	}
}
