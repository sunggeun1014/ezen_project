package com.ezen.bookproject.admin.reviews.mapper;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ReviewRepository {

	private final SqlSessionTemplate sql;

	public List<ReviewsDTO> getAll() {

		return sql.selectList("Reviews.getAll");
	}
	
	
	public void deleteAllByIdIn(List<Integer> reviewIds) {
		sql.delete("Reviews.deleteReviews", reviewIds);
	}
}
