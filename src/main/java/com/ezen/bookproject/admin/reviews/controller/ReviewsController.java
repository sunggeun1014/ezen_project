package com.ezen.bookproject.admin.reviews.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;
import com.ezen.bookproject.admin.reviews.service.ReviewsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/reviews")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Controller
public class ReviewsController {

	ReviewsService reviewService;

	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<ReviewsDTO> tables = reviewService.list();

		// DataTables가 요구하는 형식으로 JSON 데이터 구성
		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
		response.put("size", tables.size());

		return response;
	}

	@PostMapping("/detail")
	public String showReviewDetails(@RequestParam("review_num") Integer reviewNum, Model model) {

		ReviewsDTO reviewsDTO = reviewService.getDetailList(reviewNum);
		
		model.addAttribute("reviews", reviewsDTO);
		
		
		return "/admin/reviews/reviewDetails";
	}

	@PostMapping("/delete")
	@ResponseBody
	public Map<String, Object> deleteReviews(@RequestBody List<Integer> reviewIds) {
		return reviewService.deleteReviewsById(reviewIds);
	}

	@GetMapping("/list")
	public String reviewsView() {
		return "/admin/reviews/reviews";
	}
	
}
