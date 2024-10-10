package com.ezen.bookproject.admin.inquiries.dto;

import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class InquiriesDTO {
	Integer inquiry_num; 
	String inquiry_title;
	String inquiry_content;
	String member_id;
	Timestamp inquiry_write_date;
	String inquiry_answer_status;
	String inquiry_type;
	Integer order_num;
	String inquiries_original;
	String inquiries_changed;
	
	String answer_content;
	Timestamp answer_write_date;
	String manager_id;
	
	Integer order_detail_num;
	Integer order_request_qty;
}
