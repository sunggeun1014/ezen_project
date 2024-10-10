package com.ezen.bookproject.admin.members.dto;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class AdminMembersDTO implements Serializable {
	
	private static final long serialVersionUID = -1624856185684629891L;
	
	String member_id;
	String member_pw;
	String member_name;
	String member_email;
	String member_phoneNo;
	String member_addr;
	String member_detail_addr;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	Date member_date;
	String naver_login_cd;
	String kakao_login_cd;	

}
