package com.ezen.bookproject.admin.customerorders.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersDTO;
import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersListDTO;
import com.ezen.bookproject.admin.customerorders.service.CustomerOrdersService;
import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.commons.AccountManagement;
import com.ezen.bookproject.commons.SearchCondition;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/customerOrdersRest")
public class CustomerOrdersRestController {
	
	private final CustomerOrdersService cos;
	
    @GetMapping(value = "/customerOrders", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getTableData() {
        Map<String, Object> responseMap = new HashMap<>();
        List<CustomerOrdersDTO> list = cos.getCustomerOrdersList();
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());

        return responseMap;
    }
    
    @GetMapping(value = "/dataFilter", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getDataFilter(SearchCondition condition) {
    	Map<String, Object> responseMap = new HashMap<>();
        List<CustomerOrdersDTO> list = cos.getDataFilter(condition);
        
        responseMap.put("data", list);
        responseMap.put("recordsTotal", list.size());
    	
    	return responseMap;
    }
    
    @PostMapping(value = "/deliveryRequest")
    public int deliveryRequest(@RequestBody List<Integer> order_nums, HttpSession session) {
    	return cos.deliveryRequestSave(order_nums, ((AdminManagersDTO) session.getAttribute(AccountManagement.MANAGER_INFO)).getManager_id());
    }

    @PostMapping(value = "/orderStatusUpdate")
    public String orderStatusUpdate(@ModelAttribute CustomerOrdersListDTO list, int order_num, String order_selected_status, HttpSession session) {
    	cos.orderStatusUpdate(list, order_num, order_selected_status, ((AdminManagersDTO)session.getAttribute(AccountManagement.MANAGER_INFO)).getManager_id());
    	
    	return "/admin/customerOrders/detail?order_num=" + order_num;
    }
    
}
