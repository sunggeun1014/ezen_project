package com.ezen.bookproject.member_mgnt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.member_mgnt.dto.MembersDTO;
import com.ezen.bookproject.member_mgnt.mapper.MgntRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MgntService {
	
private final  MgntRepository mgntRepository;
	
	public List<MembersDTO> list(){
		// DB에서 모든 주문 목록을 꺼내와야 한다
		return mgntRepository.getTables();
	}
}
