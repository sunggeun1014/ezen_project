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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.admin.managers.service.AdminMgrServiceImpl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Controller
@RequestMapping("/admin/managers")
public class AdminMgrRestController {
	AdminMgrServiceImpl mgrService;
	
	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData(){
		List<AdminManagersDTO> tables = mgrService.list();
		
		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
        response.put("size", tables.size());


		return response;
	}
	
	@GetMapping("/detail/{manager_id}")
	public String showMemberDetails(@PathVariable("manager_id") String managerID, Model model) {
	    AdminManagersDTO managerDetails = mgrService.detailList(managerID);
	    
	    String[] emailParts = managerDetails.getManager_email().split("@");
	    String emailUser = emailParts[0];
	    String emailDomain = emailParts[1];

	    String[] phoneNumber = managerDetails.getManager_phoneNo().split("-");
	    String countryNum = phoneNumber[0];
	    String userPart1 = phoneNumber[1];
	    String userPart2 = phoneNumber[2];
	    
	    model.addAttribute("manager_details", managerDetails);
	    model.addAttribute("emailUser", emailUser);
	    model.addAttribute("emailDomain", emailDomain);
	    model.addAttribute("countryNum", countryNum);
	    model.addAttribute("userPart1", userPart1);
	    model.addAttribute("userPart2", userPart2);
	    
	    return "/admin/managers/managerDetails";
	}
	
	@PostMapping("/update/dept")
    public ResponseEntity<String> deleteReviews(@RequestBody Map<String, Object> payload) {
        try {
            // 리뷰 삭제를 서비스에 위임
        	List<String> managerIds = (List<String>) payload.get("managerId");
            String dept = (String) payload.get("managerDept");
            
            for (String managerId : managerIds) {
                mgrService.changeDept(managerId, dept);
            }
            
            return ResponseEntity.ok("변경이 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 오류 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("변경 중 오류가 발생했습니다.");
        }
    }
	
	@PostMapping("/checkId")
	@ResponseBody
	public ResponseEntity<Map<String, Boolean>> checkManagerId(@RequestBody Map<String, String> payload) {
	    String managerId = payload.get("manager_id");
	    boolean isAvailable = mgrService.isManagerIdAvailable(managerId);
	    
	    Map<String, Boolean> response = new HashMap<>();
	    response.put("isAvailable", isAvailable);
	    
	    return ResponseEntity.ok(response);
	}
	
	
	@PostMapping("/join")
	public String joinProccess(@ModelAttribute AdminManagersDTO managersDTO, 
					            @RequestParam("emailUser") String emailUser, 
					            @RequestParam("emailDomain") String emailDomain,
					            @RequestParam("countryNum") String countryNum,
					            @RequestParam("userPart1") String userPart1,
					            @RequestParam("userPart2") String userPart2,
					            @RequestParam MultipartFile profileImage,
					            Model model
								) {

		String manager_email = emailUser +"@" + emailDomain;
		String manager_phoneNo = countryNum + "-" + userPart1 + "-" + userPart2;
	    Timestamp now = Timestamp.valueOf(LocalDateTime.now());
		
		managersDTO.setManager_email(manager_email);
		managersDTO.setManager_phoneNo(manager_phoneNo);
		managersDTO.setManager_join_date(now);
		
		mgrService.joinProcess(managersDTO, profileImage);
		
		return "redirect:/admin/managers/list";
	}
	
}
