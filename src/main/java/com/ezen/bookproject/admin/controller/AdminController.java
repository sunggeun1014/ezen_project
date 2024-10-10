package com.ezen.bookproject.admin.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.home.service.HomeService;
import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.admin.managers.mapper.AdminMgrMapper;
import com.ezen.bookproject.admin.managers.service.AdminMgrServiceImpl;
import com.ezen.bookproject.commons.AccountManagement;
import com.ezen.bookproject.commons.CommonConstants;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin")
@Controller
public class AdminController {
	
	private final AdminMgrServiceImpl mgrService;
	private final HomeService homeService;
	private final AdminMgrMapper adminMgrMapper;
	
	@GetMapping("/login")
    public String login() {

        return "/admin/login/login";
    }
	
	@GetMapping("/home")
    public String index(Model model) {
		int productCnt = homeService.getProductsCnt();
		int memberCnt = homeService.getMembersCnt();
		int orderCnt = homeService.getTodayOrder();

		Integer todaySalesObj = homeService.getTodaySales();

		int todaySales =(todaySalesObj != null) ? todaySalesObj : 0;

		int allOrderCnt = homeService.getAllOrders();
		int allDelivering = homeService.getAllDelivering();
		int allCompleted = homeService.getAllCompleted();

		model.addAttribute("productCnt", productCnt);
		model.addAttribute("memberCnt", memberCnt);
		model.addAttribute("orderCnt", orderCnt);
		model.addAttribute("todaySales", todaySales);
		model.addAttribute("allOrderCnt", allOrderCnt);
		model.addAttribute("allDelivering", allDelivering);
		model.addAttribute("allCompleted", allCompleted);

        return "/admin/home/home";
       
    }
	
	@GetMapping("/myinfo")
	public String getMyInfo(HttpSession session, Model model) {
	    
	    String[] emailDomainList = CommonConstants.EMAIL_DOMAINS;

	    AdminManagersDTO sessionDTO = (AdminManagersDTO) session.getAttribute(AccountManagement.MANAGER_INFO);
	    AdminManagersDTO managerDetails = mgrService.detailList(sessionDTO.getManager_id()); 

	    String[] emailParts = managerDetails.getManager_email().split("@");
	    String emailUser = emailParts[0];
	    String emailDomain = emailParts[1];
		
		
	    
	    String fullPhone = managerDetails.getManager_phoneNo();
	    String countryNum = "";
	    String userPart1 = "";
	    String userPart2 = "";

	    if (fullPhone != null && !fullPhone.isEmpty()) {
	        String[] phoneParts = fullPhone.split("-");
	        if (phoneParts.length == 3) {
	            countryNum = phoneParts[0];
	            userPart1 = phoneParts[1];
	            userPart2 = phoneParts[2];
	        }
	    }
	    
	    model.addAttribute("emailDomainList", emailDomainList);	    
	    model.addAttribute("managers", managerDetails);
	    model.addAttribute("emailUser", emailUser);
	    model.addAttribute("emailDomain", emailDomain);
	    model.addAttribute("countryNum", countryNum);
	    model.addAttribute("userPart1", userPart1);
	    model.addAttribute("userPart2", userPart2);
	    
	    return "/admin/myinfo/myinfo";
	}

	
	@PostMapping("/myinfo/update")
    public String updateMyInfo(@ModelAttribute("managers") AdminManagersDTO managersDTO,
                               @RequestParam MultipartFile profileImage, HttpSession session) {
		try {
			mgrService.updateManager(managersDTO, profileImage);
			AdminManagersDTO newManagersDTO = adminMgrMapper.getManagerDetails(((AdminManagersDTO)session.getAttribute(AccountManagement.MANAGER_INFO)).getManager_id());
			
			session.setAttribute(AccountManagement.MANAGER_INFO, newManagersDTO);
		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/admin/myinfo";
		}
		
        return "redirect:/admin/myinfo";  // 업데이트 후 마이페이지로 리다이렉트
    }
    
   @GetMapping("/download")
   public void download(String img, HttpServletResponse response) throws IOException {
	   response.setContentType("text/plain; charset=UTF-8");
	  
	   response.setHeader("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(img, "UTF-8") + "\"");
	
	   File file = new File("C:/images/inquiries/" + img);
       
	   
       if (!file.exists()) {
           response.setStatus(HttpServletResponse.SC_NOT_FOUND);
           response.setCharacterEncoding("UTF-8");
           response.getWriter().write("File not found");
           return;
       }
       
       String mimeType = Files.probeContentType(file.toPath());
       if (mimeType == null) {
           mimeType = "application/octet-stream";
       }
       response.setContentType(mimeType);
       
       response.addHeader("Content-Disposition", "attachment; filename=\"" + img + "\"");
       
       try (FileInputStream in = new FileInputStream(file)) {
           FileCopyUtils.copy(in, response.getOutputStream());
       } catch (IOException e) {
          e.printStackTrace();
       }
   }
}
