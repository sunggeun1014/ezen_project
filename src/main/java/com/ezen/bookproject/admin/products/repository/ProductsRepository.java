package com.ezen.bookproject.admin.products.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.products.dto.CategoryDTO;
import com.ezen.bookproject.admin.products.dto.InventoryDTO;
import com.ezen.bookproject.admin.products.dto.ProductsDTO;
import com.ezen.bookproject.admin.warehouse.dto.WarehouseDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ProductsRepository {
    private final SqlSessionTemplate sql;

    public List<ProductsDTO> findBookCondition(
            String book_state,
            Date start_date,
            Date end_date,
            String search_conditions,
            String word) {
        HashMap<String, Object> paraMap = new HashMap<>();

        paraMap.put("book_state", book_state);
        paraMap.put("start_date", start_date);
        paraMap.put("end_date", end_date);
        paraMap.put("search_conditions", search_conditions);
        paraMap.put("word", word);

        return sql.selectList("Products.findByCondition", paraMap);
    }

    public ProductsDTO getBookDetail(String bookISBN){
        return sql.selectOne("Products.getDetail", bookISBN);
    }

    public List<CategoryDTO> getCategory() {
        return sql.selectList("Category.getCategory");
    }

    public List<InventoryDTO> getInventory() {
        return sql.selectList("Inventory.getInvList");
    }

    public InventoryDTO getInvISBN(String invISBN) {
        return sql.selectOne("Inventory.getInventoryByIsbn", invISBN);
    }

    public String deleteState (String bookISBN) {
        return sql.selectOne("Products.deleteState", bookISBN);
    }

    public String existsByIsbn(String bookISBN) {
        return sql.selectOne("Products.existsByIsbn", bookISBN);
    }

    public void insertBook(ProductsDTO productsDTO) {
        sql.insert("Products.insertBookInfo", productsDTO);
    }

    public void updateBookInfo(ProductsDTO productsDTO) {
        sql.update("Products.updateBookInfo", productsDTO);
    }

    public void deleteBook(String bookISBN) {
        String deletedStatus = "02";

        HashMap<String, String> params = new HashMap<>();
        params.put("book_isbn", bookISBN);
        params.put("book_deleted", deletedStatus);

        sql.update("Products.deleteBook", params);
    }
    
    public WarehouseDTO isInvIsbn(String bookISBN) {
    	return sql.selectOne("Warehouse.getInvBook", bookISBN);
    }
}

