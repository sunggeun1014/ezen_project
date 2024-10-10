package com.ezen.bookproject.admin.inquiries.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.admin.inquiries.dto.InquiriesDTO;
import com.ezen.bookproject.admin.inquiries.service.InquiriesService;
import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.commons.AccountManagement;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/admin/inquiries")
@Controller
public class InquiriesController {
	private final InquiriesService iqs;
	
	@GetMapping("/list")
	public String inquiries() {
		return "/admin/inquiries/inquiries";
	}
	
	
	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<InquiriesDTO> tables = iqs.getList();

		// DataTables가 요구하는 형식으로 JSON 데이터 구성
		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
		response.put("size", tables.size());

		return response;
	}

	@GetMapping("/detail")
	public String showInquiriesDetails(@RequestParam("inquiry_num") Integer inquiryNum, Model model) {
		InquiriesDTO tables = iqs.getDetailList(inquiryNum);
		
		model.addAttribute("inquiries", tables);
		
		
		return "/admin/inquiries/inquiriesDetails";
	}
	
	
	
	@PostMapping("/update")
	public String updateInquiries(@ModelAttribute("inquiries") InquiriesDTO inquiriesDTO, Model model) {
		
		iqs.updateInquiry(inquiriesDTO);
		
		
		return "redirect:/admin/inquiries/list";
	}
	
	@PostMapping("/insert")
	public String insertInquiries(@ModelAttribute("inquiries") InquiriesDTO inquiriesDTO, Model model) {
		
		iqs.insertInquiry(inquiriesDTO);
		
		
		return "redirect:/admin/inquiries/list";
	}

}
