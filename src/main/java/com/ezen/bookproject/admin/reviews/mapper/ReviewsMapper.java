package com.ezen.bookproject.admin.reviews.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;

@Mapper
public interface ReviewsMapper {
	
	List<ReviewsDTO> getAll();

	ReviewsDTO getDetailList(Integer reviewNum);
	
	int deleteAllByIdIn(List<Integer> reviewIds);
	
}
