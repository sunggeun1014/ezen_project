package com.ezen.bookproject.admin.products.repository;

import java.util.List;

import com.ezen.bookproject.admin.members.dto.MembersDTO;
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

	public ProductsDTO getBookDetail(String bookISBN){
		return sql.selectOne("Products.getDetail", bookISBN);
	}

}
