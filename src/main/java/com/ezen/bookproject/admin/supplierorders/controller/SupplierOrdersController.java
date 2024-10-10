package com.ezen.bookproject.admin.supplierorders.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ezen.bookproject.admin.supplierorders.service.SupplierOrdersService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/supplierOrders")
public class SupplierOrdersController {
	
	private final SupplierOrdersService sos;
	
	@GetMapping("/list")
	public String supplierOrdersList() {
		
		return "/admin/supplier_orders/supplierList";
	}
	
	@GetMapping("/register")
	public String orderRegister() {
		
		
		return "/admin/supplier_orders/supplierRegister";
	}
	
	@GetMapping("/detail")
	public String orderRegister(Model model, Integer order_num) {
		model.addAttribute("detail", sos.getSupplierOrdersDetail(order_num));
		model.addAttribute("detailList", sos.getSupplierOrdersDetailList(order_num));
		
		return "/admin/supplier_orders/supplierDetail";
	}
	
}
