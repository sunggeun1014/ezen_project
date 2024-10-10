package com.ezen.bookproject.admin.banners.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class BannersDTO {
	private Integer banner_num;
	private String banner_title;
	private String banner_original;
	private String banner_changed;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date banner_start;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date banner_end;
	
	private String banner_position;
	private String banner_visible;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date banner_date;
	
}
