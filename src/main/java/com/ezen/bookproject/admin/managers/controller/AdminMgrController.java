package com.ezen.bookproject.admin.managers.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.admin.managers.service.AdminMgrServiceImpl;
import com.ezen.bookproject.commons.CommonConstants;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Controller
@RequestMapping("/admin/managers")
public class AdminMgrController {
	
	@GetMapping("/list")
	public String managers() {
		return "/admin/managers/managers";
	}
	
	@GetMapping("/register")
	public String getRegisterForm(Model model) {
		String[] emailDomainList = CommonConstants.EMAIL_DOMAINS;
		
		model.addAttribute("emailDomainList", emailDomainList);
		
		return "/admin/managers/managerReg";
	}

}
