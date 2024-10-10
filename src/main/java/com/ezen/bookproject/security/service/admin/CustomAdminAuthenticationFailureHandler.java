package com.ezen.bookproject.security.service.admin;

import java.io.IOException;
import java.net.URLEncoder;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomAdminAuthenticationFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
	                                    AuthenticationException exception) throws IOException, ServletException {
		String matchErrorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
	    String redirectUrl = "/admin/login?error=true";
	    
	    redirectUrl += "&passwordError=" + URLEncoder.encode(matchErrorMessage, "UTF-8");
	   
	    response.sendRedirect(redirectUrl);
	}


}



