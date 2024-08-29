package com.ezen.bookproject.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/admin")
@Controller
public class AdminController {
	
	@GetMapping("/index")
	public String test(Model model, String path) {
		model.addAttribute("template", path);
		
		return "admin/index";
	}
}
