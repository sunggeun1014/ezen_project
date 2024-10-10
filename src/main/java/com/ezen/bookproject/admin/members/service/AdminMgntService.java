package com.ezen.bookproject.admin.members.service;

import java.util.List;

import com.ezen.bookproject.admin.members.dto.AdminMembersDTO;

public interface AdminMgntService {
	List<AdminMembersDTO> list();
	AdminMembersDTO detailList(String memberId);
	void updateMemberDetails(AdminMembersDTO membersDTO);
}
