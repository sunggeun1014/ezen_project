package com.ezen.bookproject.admin.reviews.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;
import com.ezen.bookproject.admin.reviews.mapper.ReviewsMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReviewsServiceImpl implements ReviewsService {

    ReviewsMapper reviewsMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<ReviewsDTO> list() {
    	return reviewsMapper.getAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewsDTO getDetailList(Integer reviewNum) {
    	return reviewsMapper.getDetailList(reviewNum);
    }

    @Override
    @Transactional
    public Map<String, Object> deleteReviewsById(List<Integer> reviewIds) {
    	Map<String, Object> resultMap = new HashMap<>();
    	
    	int deleteRows = reviewsMapper.deleteAllByIdIn(reviewIds);
    	
    	if(deleteRows > 0) {
    		resultMap.put("resultCode", "S");
    		resultMap.put("resultMsg", "삭제가 완료되었습니다.");
    	} else {
    		resultMap.put("resultCode", "F");
    		resultMap.put("resultMsg", "삭제에 실패하였습니다.");
    	}
    	
    	return resultMap;
    }
}