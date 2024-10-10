package com.ezen.bookproject.security.service.user;

import java.io.IOException;
import java.net.URLEncoder;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomUserAuthenticationFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {

		String redirectUrl = "/user/login?error=true";

		if (exception instanceof AccountNotLinkedException) {
			String accountNotLinkedError = URLEncoder.encode(exception.getMessage(), "UTF-8");
			redirectUrl += "&accountNotLinkedError=" + accountNotLinkedError;
		} else {
			String passwordError = URLEncoder.encode("아이디 또는 비밀번호가 일치하지 않습니다.", "UTF-8");
			redirectUrl += "&passwordError=" + passwordError;
		}

		response.sendRedirect(redirectUrl);
	}

}
