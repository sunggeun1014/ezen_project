package com.ezen.bookproject.admin.members.mapper;


import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.members.dto.MembersDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class MgntRepository {
	private final SqlSessionTemplate sql;
	
	public List<MembersDTO> getMembers(){
		return sql.selectList("Members.getAll");
	}
	
	public MembersDTO getMemberDetails(String memberId){
		return sql.selectOne("Members.getDetail", memberId);
	}

	public void updateMember(MembersDTO membersDTO) {
		sql.update("Members.updateMemberDetails", membersDTO);
	}

}

