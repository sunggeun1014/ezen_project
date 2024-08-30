package com.ezen.bookproject.admin.products.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.admin.products.dto.ProductsDTO;
import com.ezen.bookproject.admin.products.repository.ProductsRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ProductService {
	
	private final ProductsRepository productRepository;
	
	public List<ProductsDTO> list(){
		// DB에서 모든 주문 목록을 꺼내와야 한다
		return productRepository.getlist();
	}

}
