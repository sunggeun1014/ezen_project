package com.ezen.bookproject.register.dto;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

public class MemberDTO {

	private String memberId;
    private String memberPw;
    private String memberName;
    private String memberEmail;
    private String memberPhoneNo;
    private String memberAddr;
    private String memberDetailAddr;
    private String naverLoginCd;
    private String kakaoLoginCd;
    private Date memberDate;
    
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	public String getMemberPw() {
		return memberPw;
	}
	public void setMemberPw(String memberPw) {
		this.memberPw = memberPw;
	}
	public String getMemberName() {
		return memberName;
	}
	public void setMemberName(String memberName) {
		this.memberName = memberName;
	}
	public String getMemberEmail() {
		return memberEmail;
	}
	public void setMemberEmail(String memberEmail) {
		this.memberEmail = memberEmail;
	}
	public String getMemberPhoneNo() {
		return memberPhoneNo;
	}
	public void setMemberPhoneNo(String memberPhoneNo) {
		this.memberPhoneNo = memberPhoneNo;
	}
	public String getMemberAddr() {
		return memberAddr;
	}
	public void setMemberAddr(String memberAddr) {
		this.memberAddr = memberAddr;
	}
	public String getMemberDetailAddr() {
		return memberDetailAddr;
	}
	public void setMemberDetailAddr(String memberDetailAddr) {
		this.memberDetailAddr = memberDetailAddr;
	}
	public String getNaverLoginCd() {
		return naverLoginCd;
	}
	public void setNaverLoginCd(String naverLoginCd) {
		this.naverLoginCd = naverLoginCd;
	}
	public String getKakaoLoginCd() {
		return kakaoLoginCd;
	}
	public void setKakaoLoginCd(String kakaoLoginCd) {
		this.kakaoLoginCd = kakaoLoginCd;
	}
	public Date getMemberDate() {
		return memberDate;
	}
	public void setMemberDate(Date memberDate) {
		this.memberDate = memberDate;
	}
	
	@Override
	public String toString() {
		return "MemberDTO [memberId=" + memberId + ", memberPw=" + memberPw + ", memberName=" + memberName
				+ ", memberEmail=" + memberEmail + ", memberPhoneNo=" + memberPhoneNo + ", memberAddr=" + memberAddr
				+ ", memberDetailAddr=" + memberDetailAddr + ", naverLoginCd=" + naverLoginCd + ", kakaoLoginCd="
				+ kakaoLoginCd + ", memberDate=" + memberDate + "]";
	}
	

}
