package com.ezen.bookproject.admin.warehouse.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;
import com.ezen.bookproject.admin.warehouse.dto.ZoneNumDTO;
import com.ezen.bookproject.admin.warehouse.service.WarehouseServiceImpl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Controller
@RequestMapping("/admin/warehouse")
public class WarehouseController {
	
	private final WarehouseServiceImpl warehouseService;
	
	@GetMapping("/list")
	public String warehouse() {
		return "/admin/warehouse/warehouse";
	}
	
	@PostMapping("/details")
	public String showStockDetails(@RequestParam("inv_isbn") String invIsbn, Model model) {
		WarehouseDTO stockDetails = warehouseService.detailList(invIsbn);
		List<ZoneNumDTO> zoneNumList =  warehouseService.zoneNumList();
		
		model.addAttribute("stockDetails", stockDetails);
		model.addAttribute("zoneNumList", zoneNumList);
		
				
		return "/admin/warehouse/warehouseDetail";
	}
	
	
	
}
