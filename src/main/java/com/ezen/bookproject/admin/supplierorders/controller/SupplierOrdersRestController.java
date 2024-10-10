package com.ezen.bookproject.admin.supplierorders.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.admin.supplierorders.dto.SupplierOrdersDTO;
import com.ezen.bookproject.admin.supplierorders.service.SupplierOrdersService;
import com.ezen.bookproject.commons.AccountManagement;
import com.ezen.bookproject.commons.SearchCondition;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/supplierOrdersRest")
public class SupplierOrdersRestController {
	
	private final SupplierOrdersService sos;
	
	@GetMapping(value = "/supplierOrders", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getTableData() {
        Map<String, Object> responseMap = new HashMap<>();
        List<SupplierOrdersDTO> list = sos.getSupplierOrdersList();
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());

        return responseMap;
    }
	
    @GetMapping(value = "/dataFilter", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getDataFilter(SearchCondition condition) {
    	Map<String, Object> responseMap = new HashMap<>();
        List<SupplierOrdersDTO> list = sos.getDataFilter(condition);
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());
    	
    	return responseMap;
    }

	@PostMapping("/orderConfirm")
	public void orderConfirm(@RequestBody List<SupplierOrdersDTO> list, HttpSession session) {
		sos.orderConfirmInsert(list, ((AdminManagersDTO)session.getAttribute(AccountManagement.MANAGER_INFO)).getManager_id());
		
	}
}
