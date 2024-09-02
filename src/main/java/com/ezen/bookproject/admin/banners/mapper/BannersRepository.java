package com.ezen.bookproject.admin.banners.mapper;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.banners.dto.BannersDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class BannersRepository {

	private final SqlSessionTemplate sql;
	
	public List<BannersDTO> getAll(){
		return sql.selectList("Banners.getAll");
	}

	public BannersDTO getBannerDetails(Integer bannerNum) {
		return sql.selectOne("Banners.getDetail", bannerNum);
	}
	
	public void updateBanner(BannersDTO bannersDTO) {
		sql.update("Banners.updateBanner", bannersDTO);
	}

	public void insertBanner(BannersDTO bannersDTO) {
		sql.insert("Banners.insertBanner", bannersDTO);
	}
	

}
