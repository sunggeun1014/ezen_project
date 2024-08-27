package com.ezen.bookproject.reviews.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ezen.bookproject.reviews.dto.ReviewsDTO;
import com.ezen.bookproject.reviews.mapper.ReviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Service
public class ReviewService {

	private final ReviewRepository reviewRepository;
	
	public List<ReviewsDTO> list() {
		return reviewRepository.getAll();
	}
	
}
