package com.ezen.bookproject.admin.members.dto;

import java.io.Serializable;
import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserMembersDTO implements Serializable {

	private static final long serialVersionUID = 5367377147011094324L;
	
	String member_id;
	String member_pw;
	String member_name;
	String member_email;
	String member_phoneNo;
	String member_addr;
	String member_detail_addr;	
	Timestamp member_date;
	String naver_login_cd;
	String kakao_login_cd;	

}
