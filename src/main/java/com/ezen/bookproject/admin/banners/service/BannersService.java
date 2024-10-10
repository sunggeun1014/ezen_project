package com.ezen.bookproject.admin.banners.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.banners.dto.BannersDTO;
import com.ezen.bookproject.admin.banners.repository.BannersRepository;
import com.ezen.bookproject.commons.FileManagement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Service
public class BannersService {

	private final BannersRepository bannersRepository;
	private final FileManagement fileManagement;
	
	public List<BannersDTO> list() {
		return bannersRepository.getAll();
	}

	public BannersDTO getBannerDetail(Integer bannerNum) {
		return bannersRepository.getBannerDetail(bannerNum);
	}

	@Transactional
	public void updateBanner(BannersDTO bannersDTO, MultipartFile bannerImage) throws IOException {
		// 업로드한 이미지가 있는 경우
		if (bannerImage != null && !bannerImage.isEmpty()) {
			String originalFileName = bannerImage.getOriginalFilename();
			String newFileName = FileManagement.generateNewFilename(originalFileName, FileManagement.BANNER_UPLOAD_NAME);

			FileManagement.saveImage(bannerImage, newFileName, fileManagement.getBannerPath());

			bannersDTO.setBanner_original(originalFileName);
			bannersDTO.setBanner_changed(newFileName);
		} else {
			// 이미지가 업로드되지 않은 경우
			BannersDTO existingBanner = bannersRepository.getBannerDetail(bannersDTO.getBanner_num());
			bannersDTO.setBanner_original(existingBanner.getBanner_original());
			bannersDTO.setBanner_changed(existingBanner.getBanner_changed());
		}
		bannersRepository.updateBanner(bannersDTO);
	}

	@Transactional
	public void insertBanner(BannersDTO bannersDTO, MultipartFile bannerImage) throws IOException {

		if (bannerImage != null && !bannerImage.isEmpty()) {
			String originalFileName = bannerImage.getOriginalFilename();
			String newFileName = FileManagement.generateNewFilename(originalFileName, FileManagement.BANNER_UPLOAD_NAME);

			FileManagement.saveImage(bannerImage, newFileName, fileManagement.getBannerPath());

			bannersDTO.setBanner_original(originalFileName);
			bannersDTO.setBanner_changed(newFileName);
		}
		bannersRepository.insertBanner(bannersDTO);
	}

	public void deleteBanners(List<Integer> bannerNums) {
		for (Integer bannerNum : bannerNums) {
			bannersRepository.deleteBanner(bannerNum);
		}
	}

}