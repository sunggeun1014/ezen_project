package com.ezen.bookproject.admin.banners.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.banners.dto.BannersDTO;
import com.ezen.bookproject.admin.banners.mapper.BannersRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RequiredArgsConstructor
@Slf4j
@Service
public class BannersService {

	private final BannersRepository bannersRepository;
	
	public List<BannersDTO> list(){
		return bannersRepository.getAll();
	}
	
	public BannersDTO detailList(Integer bannerNum) {
		return bannersRepository.getBannerDetails(bannerNum);
	}
	
	public void updateBanner(BannersDTO bannersDTO) {
		bannersRepository.updateBanner(bannersDTO);
	}
	
	public void insertBanner(BannersDTO bannersDTO, MultipartFile bannerImage) throws IllegalStateException, IOException {
		
		if (bannerImage == null || bannerImage.isEmpty()) {
	            String originalFilename = bannerImage.getOriginalFilename();
	            String changedFileName = String.format("%s-%s", System.currentTimeMillis(), originalFilename);
	            
	            Path rootPath = Paths.get("/Users/hyejin/Desktop/banner");
	            
	            // 디렉토리가 존재하지 않으면 생성
	            if (!Files.exists(rootPath)) {
	                Files.createDirectories(rootPath);
	            }
	            
	            Path imagePath = rootPath.resolve(changedFileName);

	            bannerImage.transferTo(imagePath.toFile());

	            bannersDTO.setBanner_original(originalFilename);
	            bannersDTO.setBanner_changed(changedFileName);
	        }
	        bannersRepository.insertBanner(bannersDTO);
	    }
	
	}
