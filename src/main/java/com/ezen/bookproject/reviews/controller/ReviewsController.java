package com.ezen.bookproject.reviews.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.reviews.dto.ReviewsDTO;
import com.ezen.bookproject.reviews.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/reviews")
@Controller
public class ReviewsController {

	private final ReviewService reviewService;

	@GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public String table() {
        return "/reviews/reviews";
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData() {
        List<ReviewsDTO> tables = reviewService.list();

        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);

        return response;
    }
    @PostMapping("/details")
    public String showReviewDetails(
    		  @RequestParam("review_num") String reviewNum,
              @RequestParam("review_content") String reviewContent,
              @RequestParam("book_name") String bookName,
              @RequestParam("book_isbn") String bookIsbn,
              @RequestParam("member_id") String memberId,
              @RequestParam("review_write_date") 
              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reviewWriteDate,  // LocalDateTime으로 받음
              @RequestParam("review_rating") Integer reviewRating,  // Integer 타입으로 받음
              Model model) {

          // LocalDateTime을 포맷 설정 (예: yyyy-MM-dd HH:mm:ss)
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
          String formattedDate = reviewWriteDate.format(formatter);

          // 모델에 데이터를 추가하여 뷰로 전달
          model.addAttribute("reviewNum", reviewNum);
          model.addAttribute("reviewContent", reviewContent);
          model.addAttribute("bookName", bookName);
          model.addAttribute("bookIsbn", bookIsbn);
          model.addAttribute("memberId", memberId);
          model.addAttribute("reviewWriteDate", formattedDate); // 포맷팅된 날짜 문자열 전달
          model.addAttribute("reviewRating", reviewRating); // 정수로 변환된 리뷰 별점 전달
        return "/reviews/reviewDetails";
    }
    
    
}
