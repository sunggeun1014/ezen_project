package com.ezen.bookproject.security.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.ezen.bookproject.security.service.admin.CustomAdminAuthenticationFailureHandler;
import com.ezen.bookproject.security.service.admin.CustomAdminAuthenticationSuccessHandler;
import com.ezen.bookproject.security.service.admin.CustomAdminDetailsService;
import com.ezen.bookproject.security.service.mobile.CustomMobileAuthenticationFailureHandler;
import com.ezen.bookproject.security.service.mobile.CustomMobileAuthenticationSuccessHandler;
import com.ezen.bookproject.security.service.mobile.CustomMobileDetailsService;
import com.ezen.bookproject.security.service.user.CustomUserAuthenticationFailureHandler;
import com.ezen.bookproject.security.service.user.CustomUserDetailsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {

    CustomAdminDetailsService customAdminDetailsService;
    CustomUserDetailsService customUserDetailsService;
    CustomMobileDetailsService customMobileDetailsService;
    
    PasswordEncoder passwordEncoder;
  
    @Bean
    DaoAuthenticationProvider adminAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customAdminDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);  
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    DaoAuthenticationProvider userAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService); 
        authProvider.setPasswordEncoder(passwordEncoder);
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }
    
    @Bean
    DaoAuthenticationProvider mobileAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customMobileDetailsService); 
        authProvider.setPasswordEncoder(passwordEncoder);
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }
    
    // Admin 경로용 SecurityFilterChain
    @Bean
    @Order(1)
    SecurityFilterChain securityAdminFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/admin/**")
            .authenticationProvider(adminAuthenticationProvider())
            .sessionManagement(session -> 
                session
                    .sessionFixation().newSession()
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                    .invalidSessionUrl("/admin/login") 
                    .maximumSessions(1)                 
                    .expiredUrl("/login?expired=true")  
            )
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin/login/**", "/admin/common/**","/images/**").permitAll()
                .anyRequest().hasAuthority("ROLE_OPERATOR")
            )
            .formLogin(form -> form
                .loginProcessingUrl("/admin/loginProc")    
                .loginPage("/admin/login") 
                .successHandler(new CustomAdminAuthenticationSuccessHandler()) 
                .failureHandler(new CustomAdminAuthenticationFailureHandler()) 
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/admin/logout")
                .logoutSuccessUrl("/admin/login")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .exceptionHandling(exception -> exception
        	    .accessDeniedHandler((request, response, accessDeniedException) -> {
        	        String errorMessage = URLEncoder.encode("접근 권한이 없거나 로그인이 필요합니다.", StandardCharsets.UTF_8.toString());
        	        response.sendRedirect("/admin/login?accessError=" + errorMessage);
        	    })
        	    .authenticationEntryPoint((request, response, authException) -> {
        	        String errorMessage = URLEncoder.encode("접근 권한이 없거나 로그인이 필요합니다.", StandardCharsets.UTF_8.toString());
        	        response.sendRedirect("/admin/login?accessError=" + errorMessage);
        	    })
        	)
            .userDetailsService(customAdminDetailsService);

        return http.build();
    }

}

    

	
