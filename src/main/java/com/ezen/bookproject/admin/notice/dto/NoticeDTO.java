package com.ezen.bookproject.admin.notice.dto;

import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class NoticeDTO {
	
	Long notice_num;
	String notice_title;
	String notice_content;
	String manager_id;
	String notice_visible;
	Timestamp notice_write_date;
	Timestamp notice_end_date;
	Timestamp notice_start_date;
	
	
	Long notice_detail_num;
	String notice_detail_original;
	String notice_detail_changed;
}
