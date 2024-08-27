package com.ezen.bookproject.register.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.register.dto.MemberDTO;

@Service
public class MemberService {
	
	  private static final String URL = "jdbc:oracle:thin:@localhost:1521:xe";
	    private static final String USERNAME = "test1";
	    private static final String PASSWORD = "1234";

	    public void registerMember(MemberDTO memberDTO) {
	        String sql = "INSERT INTO MEMBERS (MEMBER_ID, MEMBER_PW, MEMBER_NAME, MEMBER_EMAIL, MEMBER_PHONENO, " +
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
	    
	    public boolean validateUser(String username, String password) {
	        String sql = "SELECT MEMBER_PW FROM MEMBERS WHERE MEMBER_ID = ?";
	        
	        try (Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
	             PreparedStatement pstmt = conn.prepareStatement(sql)) {

	            pstmt.setString(1, username);

	            try (ResultSet rs = pstmt.executeQuery()) {
	                if (rs.next()) {
	                    String storedPassword = rs.getString("MEMBER_PW");
	                    // 비밀번호 비교 (여기서는 단순 비교, 실제로는 해싱된 비밀번호를 비교하는 것이 안전함)
	                    return storedPassword.equals(password);
	                }
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }

	        return false;
	    }
}
