package com.ezen.bookproject.commons;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileManagement {
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
    
    public static final String BANNER_UPLOAD_NAME = "banner_img_";
    public static final String BOOK_UPLOAD_NAME = "book_img_";
    public static final String PROFILE_UPLOAD_NAME = "profile_img_";
    public static final String NOTICE_UPLOAD_NAME = "notice_img_";
	public static final String INQUIRIES_UPLOAD_NAME = "inquiries_img_";
	
    public Path getBannerPath() {
        return Paths.get(bannerPath);
    }

    public Path getBookPath() {
        return Paths.get(bookPath);
    }

    public Path getProfilePath() {
        return Paths.get(profilePath);
    }

    public Path getNoticePath() {
        return Paths.get(noticePath);
    }
    
    public Path getInquiriesPath() {
    	return Paths.get(inquiriesPath);
    }

	// 이미지 파일 이름 변경 메서드
	public static String generateNewFilename(String originalFilename, String nameToSave) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        
		return nameToSave + UUID.randomUUID().toString() + extension;
	}

	// 이미지 파일을 저장하는 메서드
	public static void saveImage(MultipartFile file, String newFilename, Path uploadDir) throws IOException {
        Path uploadPath = uploadDir.resolve(newFilename); 
    	
    	if (!Files.exists(uploadPath.getParent())) {
    		Files.createDirectories(uploadPath.getParent());
    	}
    	
    	Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
    }
}
