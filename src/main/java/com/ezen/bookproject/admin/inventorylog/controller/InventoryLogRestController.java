package com.ezen.bookproject.admin.inventorylog.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezen.bookproject.admin.inventorylog.dto.InventoryLogDTO;
import com.ezen.bookproject.admin.inventorylog.service.InventoryLogService;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/inventoryLogRest")
public class InventoryLogRestController {
	
	private final InventoryLogService ils;

	@GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getTableData() {
        Map<String, Object> responseMap = new HashMap<>();
        List<InventoryLogDTO> list = ils.getInventoryLogList();
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());

        return responseMap;
    }
	
    @GetMapping(value = "/dataFilter", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getDataFilter(SearchCondition condition) {
    	Map<String, Object> responseMap = new HashMap<>();
        List<InventoryLogDTO> list = ils.getDataFilter(condition);
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());
    	
    	return responseMap;
    }
}
