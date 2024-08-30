package com.ezen.bookproject.admin.products.repository;

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
	

}
