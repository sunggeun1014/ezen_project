package com.ezen.bookproject.security.service.mobile;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.commons.AccountManagement;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class CustomMobileAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
	                                    Authentication authentication) throws IOException, ServletException {
	    
	    HttpSession session = request.getSession(true);
	    String redirectUrl = "/mobile/admin/index";
	    
	    // Principal 객체의 타입을 확인하고 적절하게 캐스팅
        CustomMobileDetails mobileDetails = (CustomMobileDetails) authentication.getPrincipal();
        AdminManagersDTO managersDTO = mobileDetails.getManagersDTO();
        managersDTO.setManager_pw(null);  // 비밀번호를 세션에 저장하지 않음
        
        session.setMaxInactiveInterval(60 * 60);
        session.setAttribute(AccountManagement.MANAGER_INFO, managersDTO);

	    
	    
	    response.sendRedirect(redirectUrl);
	}


}
