package com.ezen.bookproject.admin.products.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.ezen.bookproject.admin.products.dto.BookSearchCondition;
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

	public List<ProductsDTO> getBooksByCondition(BookSearchCondition bookSearchCondition) throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

		Date startDate = null;
		Date endDate = null;

		if (bookSearchCondition.getStartDate() != null) {
			startDate = formatter.parse(bookSearchCondition.getStartDate());
		}

		if (bookSearchCondition.getEndDate() != null) {
			endDate = formatter.parse(bookSearchCondition.getEndDate());
		}

		return productRepository.findBookCondition(
				bookSearchCondition.getBookState(),
				startDate,
				endDate,
				bookSearchCondition.getSearchColumn(),
				bookSearchCondition.getSearchKeyword()
		);
	}


	public List<ProductsDTO> getBookState(String bookState) {
		return productRepository.getBookState(bookState);
	}

	public ProductsDTO detailList(String bookISBN){
		return productRepository.getBookDetail(bookISBN);
	}

	public void updateBookInfo (ProductsDTO productsDTO){
		productRepository.updateBookInfo(productsDTO);
	}

}
