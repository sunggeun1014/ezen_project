package com.ezen.bookproject.admin.reviews.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class ReviewsDTO {
	private Integer review_num;
	private String member_id;
	private String book_isbn;
	private String book_name;
	private String review_content;
	private Integer review_rating;
	private Integer order_detail_num;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date review_write_date;
}
