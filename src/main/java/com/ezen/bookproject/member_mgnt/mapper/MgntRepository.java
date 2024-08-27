package com.ezen.bookproject.member_mgnt.mapper;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.member_mgnt.dto.MembersDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class MgntRepository {
	private final SqlSessionTemplate sql;
	
	public List<MembersDTO> getTables(){
		return sql.selectList("Members.getAll");
	}
}

