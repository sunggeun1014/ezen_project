package com.ezen.bookproject.inquiry.dto;

import java.util.Date;

import lombok.Data;

@Data
public class InquiryDTO {
	private Integer inquiry_num;
	private String inquiry_title;
	private String inquiry_content;
	private String member_id;
	private Date inquiry_write_date;
	private String inquiry_answer_status;
	private String inquiry_type;
	private int order_num;
	private String inquiries_original;
	private String inquiries_changed;
}
