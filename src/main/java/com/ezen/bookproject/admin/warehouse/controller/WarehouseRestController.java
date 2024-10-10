package com.ezen.bookproject.admin.warehouse.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;
import com.ezen.bookproject.admin.warehouse.service.WarehouseService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Controller
@RequestMapping("/admin/warehouse")
public class WarehouseRestController {
	
	WarehouseService warehouseService;
	
	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<WarehouseDTO> tables = warehouseService.list();
		
		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
        response.put("size", tables.size());

		return response;
	}
	
	@PostMapping("/update")
	public String upateDetails(@ModelAttribute WarehouseDTO warehouseDTO) {
		
		warehouseService.updateStockDetails(warehouseDTO);
		
		return "redirect:/admin/warehouse/list";
	}
}
