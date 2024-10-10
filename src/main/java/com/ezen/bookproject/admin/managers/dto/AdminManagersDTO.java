package com.ezen.bookproject.admin.managers.dto;

import java.io.Serializable;
import java.sql.Timestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminManagersDTO implements Serializable {
	
	private static final long serialVersionUID = 7548312854200448283L;
	
	String manager_id;
	String manager_pw;
	String manager_name;
	String manager_phoneNo;
	String manager_email;
	String manager_profile_original;
	String manager_profile_changed;
	String manager_addr;
	String manager_detail_addr;
	String manager_dept;
	Timestamp manager_join_date;
	
}
