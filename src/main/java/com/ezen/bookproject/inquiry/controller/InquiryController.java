package com.ezen.bookproject.inquiry.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.ezen.bookproject.inquiry.dto.InquiryDTO;

@Controller
public class InquiryController {
	@GetMapping("/inquiryList")
	public String showInquiryList() {
		
		
		return "/inquiry/inquiryList";
	}
	
	@GetMapping("/answer")
	public String reply() {
		return "/inquiry/answerForm";
	}
	
	@GetMapping("/modify")
	public String modify() {
		return "/inquiry/answerModifyForm";
	}	
}
