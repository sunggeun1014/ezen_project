package com.ezen.bookproject.register.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.register.dto.MemberDTO;

@Service
public class MemberService {
	
	  private static final String URL = "jdbc:oracle:thin:@localhost:1521:xe";
	    private static final String USERNAME = "book";
	    private static final String PASSWORD = "1234";

	    public void registerMember(MemberDTO memberDTO) {
	        String sql = "INSERT INTO MEMBER (MEMBER_ID, MEMBER_PW, MEMBER_NAME, MEMBER_EMAIL, MEMBER_PHONENO, " +
	                     "MEMBER_ADDR, MEMBER_DETAIL_ADDR, NAVER_LOGIN_CD, KAKAO_LOGIN_CD, MEMBER_DATE) " +
	                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE)";

	        try (Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
	             PreparedStatement pstmt = conn.prepareStatement(sql)) {

	            pstmt.setString(1, memberDTO.getMemberId());
	            pstmt.setString(2, memberDTO.getMemberPw());
	            pstmt.setString(3, memberDTO.getMemberName());
	            pstmt.setString(4, memberDTO.getMemberEmail());
	            pstmt.setString(5, memberDTO.getMemberPhoneNo());
	            pstmt.setString(6, memberDTO.getMemberAddr());
	            pstmt.setString(7, memberDTO.getMemberDetailAddr());
	            pstmt.setString(8, memberDTO.getNaverLoginCd());
	            pstmt.setString(9, memberDTO.getKakaoLoginCd());

	            pstmt.executeUpdate();
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	    }
	
}
