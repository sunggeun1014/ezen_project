package com.ezen.bookproject.register.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ezen.bookproject.register.service.MemberService;

@Controller
public class LoginController {
	
	@Autowired
	private MemberService memberService;
	
	 @PostMapping("/login")
	    public String login(@RequestParam("username") String username, 
	                        @RequestParam("password") String password, 
	                        Model model) {
		 
		 	// 예제 데이터베이스 조회 로직
		 	boolean isValidUser = memberService.validateUser(username, password);
	        
	        if (!isValidUser) {
	            // 유효하지 않은 로그인 시 경고 메시지 전달
	            model.addAttribute("loginError", "아이디 또는 비밀번호가 잘못되었습니다.");
	            return "login"; // 다시 로그인 페이지로 이동
	        }

	        // 유효한 로그인 시 처리 로직
	        return "redirect:/dashboard"; // 로그인 성공 시 대시보드로 리다이렉트
	    }
	 
	 	@GetMapping("/dashboard")
	    public String dashboard() {
	        return "dashboard"; // 대시보드 페이지로 이동
	    }
}
