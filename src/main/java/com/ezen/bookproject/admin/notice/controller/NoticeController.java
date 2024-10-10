package com.ezen.bookproject.admin.notice.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.notice.dto.NoticeDTO;
import com.ezen.bookproject.admin.notice.service.NoticeService;
import com.ezen.bookproject.commons.FileManagement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/notice")
@Controller
public class NoticeController {
	
	private final NoticeService noticeService;
	private final FileManagement fileManagement;
	
	@GetMapping("/list")
	public String notice() {
		return "/admin/notice/notice";
	}
	
	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<NoticeDTO> tables = noticeService.getList();
		
		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
		response.put("size", tables.size());

		return response;
	}
	
	
	
	@PostMapping("/detail")
	public String showNoticeDetails(@RequestParam("notice_num") Long noticeNum, Model model) {
		NoticeDTO noticeDTO = noticeService.getDetailList(noticeNum);

		model.addAttribute("notice", noticeDTO);
		
		return "/admin/notice/noticeDetails";
	}
	
	@PostMapping("/delete")
	public String deleteNotices(@RequestBody List<Long> noticeNums, Model model) {

		noticeService.deleteNoticesByNums(noticeNums);
		
		return "redirect:/admin/notice/list";
	}

	
	@GetMapping("/register")
	public String noticeReg() {
		return "/admin/notice/noticeReg";
	}
	
	@PostMapping("/save")
	public String saveNotice(@ModelAttribute NoticeDTO noticeDTO, 
							 @RequestParam(value = "images", required = false) List<MultipartFile> images) {
		try {
			
			if (images == null || images.isEmpty()) {
				images = new ArrayList<>();
			}
			
			noticeService.saveNotice(noticeDTO, images);
		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/admin/notice/list";
		}
		
		return "redirect:/admin/notice/list";
	}
	
	@PostMapping("/imageUrl")
	public ResponseEntity<?> uploadImage(@RequestParam("images") List<MultipartFile> images) {
	    try {
	        List<String> imageUrls = new ArrayList<>();
	        if (images == null || images.isEmpty()) {
	        	return ResponseEntity.ok(Map.of("success", true, "imageUrls", imageUrls));
	        }
	        
	        for (MultipartFile image : images) {
	            String originalFilename = image.getOriginalFilename();
	            String modifiedFilename = FileManagement.generateNewFilename(originalFilename, FileManagement.NOTICE_UPLOAD_NAME);

	            FileManagement.saveImage(image, modifiedFilename, fileManagement.getNoticePath());
	            
	            // 이미지 URL을 리스트에 추가
	            String imageUrl = "/images/notice/" + modifiedFilename;
	            imageUrls.add(imageUrl);
	        }

	        // 성공 응답으로 여러 이미지 URL 반환
	        return ResponseEntity.ok(Map.of("success", true, "imageUrls", imageUrls));
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body(Map.of("success", false));
	    }
	}
	
	@PostMapping("/update")
	public String updateNotice(@ModelAttribute NoticeDTO noticeDTO,
							   @RequestParam(value = "images", required = false) List<MultipartFile> images,
							   Model model) {
		try {
			if (images == null || images.isEmpty()) {
				images = new ArrayList<>();
			}
			
			noticeService.updateNotice(noticeDTO, images);
			
		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/admin/notice/list";
		}
		
		return "redirect:/admin/notice/list";
	}
	
}
