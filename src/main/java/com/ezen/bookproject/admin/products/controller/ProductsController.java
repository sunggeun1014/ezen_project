package com.ezen.bookproject.admin.products.controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.products.dto.CategoryDTO;
import com.ezen.bookproject.admin.products.dto.InventoryDTO;
import com.ezen.bookproject.admin.products.dto.ProductsDTO;
import com.ezen.bookproject.admin.products.service.ProductsService;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin/products")
@Controller
public class ProductsController {

    private final ProductsService productService;
    
    @GetMapping("/list")
    public String products() {
    	return "/admin/products/products";
    }
    
    @GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData(
            @RequestParam(required = false) String book_state,
            @RequestParam(required = false) String start_date,
            @RequestParam(required = false) String end_date,
            @RequestParam(required = false) String search_conditions,
            @RequestParam(required = false) String word
    ) throws ParseException {
        List<ProductsDTO> products;

        // 검색 조건을 담을 객체 생성
        SearchCondition condition = new SearchCondition();
        condition.setBook_state(book_state);
        condition.setStart_date(start_date);
        condition.setEnd_date(end_date);
        condition.setSearch_conditions(search_conditions);
        condition.setWord(word);

        // 모든 검색 조건을 한 번에 서비스로 전달
        products = productService.getBooksByCondition(condition);


        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", products);
        return response;
    }

    @GetMapping("/detail")
    public String getBookDetail(@RequestParam("book_isbn") String bookISBN, Model model) {
        ProductsDTO productDetail = productService.detailList(bookISBN);
        
        model.addAttribute("product_detail", productDetail);
        model.addAttribute("book_category", productService.categoryList());

        return "/admin/products/edit-product";
    }

    @PostMapping("/editProduct")
    public String editBookDetail(@RequestParam("book_isbn") String bookISBN, ProductsDTO productDTO) {
    	
        productDTO.setBook_isbn(bookISBN);
        productDTO.setBook_category(productDTO.getBook_category().replace(",", ""));
        
        try {
            productService.updateBookInfo(productDTO);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return "redirect:/admin/products/detail?book_isbn=" + bookISBN;
    }

    @GetMapping("/register")
    public String addBook(Model model) {
        List<CategoryDTO> bookCategory = productService.categoryList();

        model.addAttribute("book_category", bookCategory);


        return "/admin/products/add-product";
    }

    @GetMapping(value = "/inventory/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> getInventoryData() {

        List<InventoryDTO> inventory = productService.inventoryList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", inventory);
        return response;
    }

    @PostMapping("/register")
    public String insertBook(@ModelAttribute ProductsDTO productDTO) throws IOException {
    	productDTO.setBook_category(productDTO.getBook_category().replace(",", ""));
        productService.insertBook(productDTO);

        return "redirect:/admin/products/list";
    }

    @PostMapping("/checkISBN")
    public ResponseEntity<Map<String, Object>> checkISBN(@RequestBody Map<String, String> request) {
        String bookISBN = request.get("book_isbn");
        
        String exists = productService.existsIsbn(bookISBN);
        String deleteState = productService.deleteState(bookISBN);
        boolean isInvIsbn = productService.isInvIsbn(bookISBN);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("deleteState", deleteState);
        response.put("isInvIsbn", isInvIsbn);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/delete")
    public ResponseEntity<String> deleteBook(@RequestBody List<String> bookISBNs) {
        for (String bookISBN : bookISBNs) {
            productService.deleteBook(bookISBN);
        }
        return ResponseEntity.ok("success");
    }

}
