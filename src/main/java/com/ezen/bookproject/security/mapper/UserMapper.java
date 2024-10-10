package com.ezen.bookproject.security.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.ezen.bookproject.admin.members.dto.UserMembersDTO;

@Mapper
public interface UserMapper {
	@Select("SELECT member_id, member_pw, member_name, member_email, member_phoneNo, member_addr, member_detail_addr, member_date,"
    		+ "naver_login_cd, kakao_login_cd FROM members WHERE member_id = #{username}")
	UserMembersDTO loadUserByUsername(@Param("username") String username);
	
	@Select("SELECT member_id, member_pw, member_name, member_email, member_phoneNo, member_addr, member_detail_addr, member_date, naver_login_cd, kakao_login_cd " +
            "FROM members WHERE kakao_login_cd = #{kakaoLoginCd}")
    UserMembersDTO loadUserByKakaoLoginCd(@Param("kakaoLoginCd") String kakaoLoginCd);
	
	@Select("SELECT member_id, member_pw, member_name, member_email, member_phoneNo, member_addr, member_detail_addr, member_date, naver_login_cd, kakao_login_cd "
            + "FROM members WHERE naver_login_cd = #{naverLoginCd}")
    UserMembersDTO loadUserByNaverLoginCd(@Param("naverLoginCd") String naverLoginCd);
}
