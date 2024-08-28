package com.ezen.bookproject.admin.members.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.admin.members.dto.MembersDTO;
import com.ezen.bookproject.admin.members.mapper.MgntRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MgntService {
	
private final  MgntRepository mgntRepository;
	
	public List<MembersDTO> list(){
		// DB에서 모든 주문 목록을 꺼내와야 한다
		return mgntRepository.getMembers();
	}
	
	public MembersDTO detailList(String memberId){
	    return mgntRepository.getMemberDetails(memberId);
	}
	
	public void updateMemberDetails(MembersDTO membersDTO) {
        mgntRepository.updateMember(membersDTO);
    }
	
}
