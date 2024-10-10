package com.ezen.bookproject.admin.reviews.service;

import java.util.List;
import java.util.Map;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;

public interface ReviewsService {
    List<ReviewsDTO> list();
    ReviewsDTO getDetailList(Integer reviewNum);
    Map<String, Object> deleteReviewsById(List<Integer> reviewIds);
}
