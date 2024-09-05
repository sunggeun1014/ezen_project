package com.ezen.bookproject.inquiry.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class InquiryDAO {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public String getInquiryList() {
		String sql = "SELECT "
				+ "inquiry_title, inquiry_type, member_id, inquiry_write_date, answer_write_date, inquiry_answer_status "
				+ "FROM "
				+ "inquiries "
				+ "WHERE "
				+ "inquiry_num = ?";
		
		return "";
	}
}
