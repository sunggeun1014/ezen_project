package com.ezen.bookproject.admin.members.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ezen.bookproject.admin.members.dto.AdminMembersDTO;

@Mapper
public interface AdminMgntMapper {
	List<AdminMembersDTO> getMembersList();
	AdminMembersDTO getMemberDetails(String memberId);
	void updateMemberDetails(AdminMembersDTO membersDTO);
}
