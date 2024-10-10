package com.ezen.bookproject.admin.reviews.dto;

import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewsDTO {
	Integer review_num;
	String member_id;
	String book_isbn;
	String book_name;
	String review_content;
	Integer review_rating;
	Integer order_detail_num;
	
	Timestamp review_write_date;
}

