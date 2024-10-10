package com.ezen.bookproject.admin.members.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.members.dto.AdminMembersDTO;
import com.ezen.bookproject.admin.members.mapper.AdminMgntMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class AdminMgntServiceImpl implements AdminMgntService{
	
	AdminMgntMapper adminMgntMapper;
	
	@Override
    @Transactional(readOnly = true)
	public List<AdminMembersDTO> list(){
		return adminMgntMapper.getMembersList();
	}
	
	@Override
    @Transactional(readOnly = true)
	public AdminMembersDTO detailList(String memberId){
	    return adminMgntMapper.getMemberDetails(memberId);
	}
	
	@Override
	public void updateMemberDetails(AdminMembersDTO membersDTO) {
		adminMgntMapper.updateMemberDetails(membersDTO);
    }
	
}