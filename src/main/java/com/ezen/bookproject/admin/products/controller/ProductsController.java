package com.ezen.bookproject.admin.products.controller;

import java.text.ParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ezen.bookproject.admin.members.dto.MembersDTO;
import com.ezen.bookproject.admin.products.dto.BookSearchCondition;
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

    @GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData(
            @RequestParam(required = false) String bookState,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String searchColumn,
            @RequestParam(required = false) String searchKeyword
    ) throws ParseException {
        List<ProductsDTO> products;

        // 검색 조건을 담을 객체 생성
        BookSearchCondition condition = new BookSearchCondition();
        condition.setBookState(bookState);
        condition.setStartDate(startDate);
        condition.setEndDate(endDate);
        condition.setSearchColumn(searchColumn);
        condition.setSearchKeyword(searchKeyword);

        // 모든 검색 조건을 한 번에 서비스로 전달
        products = productService.getBooksByCondition(condition);

        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", products);
        return response;
    }

    //@RequestMapping(value = "/editProduct", method = {RequestMethod.GET, RequestMethod.POST})
    @GetMapping("/editProduct")
    public String getBookDetail(@RequestParam("book_isbn") String bookISBN, Model model) {
        if (bookISBN != null || bookISBN.isEmpty()) {
            log.warn("isbn 못받아왔다");
        }
        log.info("Received request for book ISBN: {}", bookISBN);
        ProductsDTO productDetail = productService.detailList(bookISBN);
        log.info("Retrieved product detail: {}", productDetail);

        model.addAttribute("product_detail", productDetail);

        model.addAttribute("template", "/admin/products/editProduct");

        return "admin/index";
    }

    @PostMapping("/editProduct")
    public String editBookDetail(@RequestParam("book_isbn") String bookISBN, @ModelAttribute ProductsDTO productDTO) {
        log.info("Received request to update book with ISBN: {}", bookISBN);
        productDTO.setBook_isbn(bookISBN);
        productService.updateBookInfo(productDTO);
        return "redirect:/admin/products/editProduct?book_isbn=" + bookISBN;
    }
}
