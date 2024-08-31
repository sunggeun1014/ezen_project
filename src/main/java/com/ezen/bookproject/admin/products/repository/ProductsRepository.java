package com.ezen.bookproject.admin.products.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.products.dto.ProductsDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ProductsRepository {
	private final SqlSessionTemplate sql;

	public List<ProductsDTO> getlist() {
		return sql.selectList("Products.getAll");
	}

	public List<ProductsDTO> findBookCondition(
			String bookState,
			Date startDate,
			Date endDate,
			String searchColumn,
			String searchKeyword) {
		HashMap <String, Object> paraMap = new HashMap<>();

		paraMap.put("bookState", bookState);
		paraMap.put("startDate", startDate);
		paraMap.put("endDate", endDate);
		paraMap.put("searchColumn", searchColumn);
		paraMap.put("searchKeyword", searchKeyword);

		return sql.selectList("Products.findByCondition", paraMap);
	}

	public List<ProductsDTO> getBookState(String bookState) {
		return sql.selectList("Products.getBookState", bookState);
	}

	public ProductsDTO getBookDetail(String bookISBN){
		return sql.selectOne("Products.getDetail", bookISBN);
	}

	public void updateBookInfo(ProductsDTO productsDTO) {
		sql.update("Products.updateBookInfo", productsDTO);
	}

}

