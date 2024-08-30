package com.ezen.bookproject.admin.products.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ezen.bookproject.admin.members.dto.MembersDTO;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/editProduct")
    public String getBookDetail(@RequestParam("book_isbn") String bookISBN, Model model) {
        log.info("Received request for book ISBN: {}", bookISBN);
        ProductsDTO productDetail = productService.detailList(bookISBN);
        log.info("Retrieved product detail: {}", productDetail);

        model.addAttribute("product_detail", productDetail);

        String templatePath = "/admin/products/editProduct";
        model.addAttribute("template", templatePath);

        return "admin/index";
    }
}
