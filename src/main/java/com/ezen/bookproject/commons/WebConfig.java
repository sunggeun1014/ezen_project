package com.ezen.bookproject.commons;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${file.upload.banner-path}")
	private String bannerPath;

	@Value("${file.upload.book-path}")
	private String bookPath;

	@Value("${file.upload.profile-path}")
	private String profilePath;

	@Value("${file.upload.notice-path}")
	private String noticePath;

	@Value("${file.upload.inquiries-path}")
    private String inquiriesPath;
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/images/banners/**").addResourceLocations("file:" + bannerPath);
		registry.addResourceHandler("/images/books/**").addResourceLocations("file:" + bookPath);
		registry.addResourceHandler("/images/profiles/**").addResourceLocations("file:" + profilePath);
		registry.addResourceHandler("/images/notice/**").addResourceLocations("file:" + noticePath);
		registry.addResourceHandler("/images/inquiries/**").addResourceLocations("file:" + inquiriesPath);
	}
}