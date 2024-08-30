package com.ezen.bookproject.admin.products.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class ProductsDTO {
	private int rownum;
	private String book_isbn;
	private String book_name;
	private Integer book_price;
	private String book_publisher;
	private String book_author;
	private Integer book_qty;
	private String book_intro;
	private String book_country_type;
	private String book_category;
	private String book_state;
	private String book_thumbnail;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date book_publish_date;
	private Date book_register_date;
	private String book_deleted;

}
