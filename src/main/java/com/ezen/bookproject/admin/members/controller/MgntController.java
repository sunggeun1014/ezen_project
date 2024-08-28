package com.ezen.bookproject.admin.members.controller;

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

import com.ezen.bookproject.admin.members.dto.MembersDTO;
import com.ezen.bookproject.admin.members.service.MgntService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Controller
@RequestMapping("/members")
public class MgntController {

	private final MgntService mgntService;

	@GetMapping(produces = MediaType.TEXT_HTML_VALUE)
	public String table() {
		return "/admin/members/members";
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<MembersDTO> tables = mgntService.list();

		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);

		return response;
	}
	
	@GetMapping("/details")
	public String showReviewDetails(@RequestParam("member_id") String memberID, Model model) {
	    MembersDTO memberDetails = mgntService.detailList(memberID);

	    String[] emailParts = memberDetails.getMember_email().split("@");
	    String emailUser = emailParts[0];
	    String emailDomain = emailParts[1];

	    String[] phoneNumber = memberDetails.getMember_phoneNo().split("-");
	    String countryNum = phoneNumber[0];
	    String userPart1 = phoneNumber[1];
	    String userPart2 = phoneNumber[2];

	    model.addAttribute("member_details", memberDetails);
	    model.addAttribute("emailUser", emailUser);
	    model.addAttribute("emailDomain", emailDomain);
	    model.addAttribute("countryNum", countryNum);
	    model.addAttribute("userPart1", userPart1);
	    model.addAttribute("userPart2", userPart2);

	    return "/admin/members/memberDetails";
	}

	@PostMapping("/details")
	public String showReviewDetailsPost(@RequestParam("member_id") String memberID, Model model) {
		return showReviewDetails(memberID, model);
	}
	
	@PostMapping("/update")
	public String updateDetails(@ModelAttribute MembersDTO membersDTO, 
	                            @RequestParam("emailUser") String emailUser, 
	                            @RequestParam("emailDomain") String emailDomain,
	                            @RequestParam("countryNum") String countryNum,
	                            @RequestParam("userPart1") String userPart1,
	                            @RequestParam("userPart2") String userPart2,
	                            @RequestParam("member_id") String member_id) {

	    if (!countryNum.matches("\\d+") || !userPart1.matches("\\d{4}") || !userPart2.matches("\\d{4}")) {
	        // 숫자가 아닐 경우 오류 처리
	        return "redirect:/admin/members/details?member_id=" + member_id;
	    }

	    String phoneNumber = countryNum + "-" + userPart1 + "-" + userPart2;
	    membersDTO.setMember_phoneNo(phoneNumber);

	    String email = emailUser + "@" + emailDomain;
	    membersDTO.setMember_email(email);

	    mgntService.updateMemberDetails(membersDTO);

	    return "/admin/members/members";
	}
}
