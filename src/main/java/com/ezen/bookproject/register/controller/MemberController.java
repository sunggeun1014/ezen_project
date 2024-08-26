package com.ezen.bookproject.register.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.ezen.bookproject.register.dto.MemberDTO;
import com.ezen.bookproject.register.service.MemberService;

@Controller
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("member", new MemberDTO());
        return "register";
    }

    @PostMapping("/register")
    public String registerMember(@ModelAttribute MemberDTO memberDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "register";
        }
        memberService.registerMember(memberDTO);
        return "redirect:/login";
    }
}
