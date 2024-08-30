package com.ezen.bookproject.admin.products.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.products.dto.ProductsDTO;
import com.ezen.bookproject.admin.products.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin/products")
@Controller
public class ProductsController {
	
	private final ProductService productService;
	
    @GetMapping(value= "/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData() {
        List<ProductsDTO> tables = productService.list();

        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);

        return response;
    }
    
    @GetMapping("/edit-product")
    public String editProduct() {
    	return "/admin/products/editProduct";
    }
    

}
