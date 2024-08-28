package com.ezen.bookproject.admin.reviews.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.reviews.dto.ReviewsDTO;
import com.ezen.bookproject.admin.reviews.service.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin")
@Controller
public class ReviewsController {

	private final ReviewService reviewService;
	
	
	
	@GetMapping("/reviews")
    public String table(Model model, String path) {
		model.addAttribute("template", path);
		
        return "admin/index";
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData() {
        List<ReviewsDTO> tables = reviewService.list();

        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);
        response.put("size", tables.size());

        return response;
    }
    
    
    
    
    
    @PostMapping("/reviews/details")
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
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
          String formattedDate = reviewWriteDate.format(formatter);

          // 모델에 데이터를 추가하여 뷰로 전달
          model.addAttribute("reviewNum", reviewNum);
          model.addAttribute("reviewContent", reviewContent);
          model.addAttribute("bookName", bookName);
          model.addAttribute("bookIsbn", bookIsbn);
          model.addAttribute("memberId", memberId);
          model.addAttribute("reviewWriteDate", formattedDate); // 포맷팅된 날짜 문자열 전달
          model.addAttribute("reviewRating", reviewRating); // 정수로 변환된 리뷰 별점 전달
          
        return "/admin/reviews/reviewDetails";
    }
    
    
    
    
    
    

    @PostMapping("/reviews/delete")
    public ResponseEntity<String> deleteReviews(@RequestBody List<Integer> reviewIds) {
        try {
            // 리뷰 삭제를 서비스에 위임
            reviewService.deleteReviewsByIds(reviewIds);
            return ResponseEntity.ok("삭제가 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 오류 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("삭제 중 오류가 발생했습니다.");
        }
    }
    
}
