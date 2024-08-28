package com.ezen.bookproject.admin.members.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class MembersDTO {
	private String member_id;
	private String member_pw;
	private String member_name;
	private String member_email;
	private String member_phoneNo;
	private String member_addr;
	private String member_detail_addr;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date member_date;
	private String naver_login_cd;
	private String kakao_login_cd;	

}
