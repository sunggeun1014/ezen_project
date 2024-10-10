package com.ezen.bookproject.admin.banners.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.banners.dto.BannersDTO;
import com.ezen.bookproject.admin.banners.service.BannersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin/banners")
@Controller
public class BannersController {
	private final BannersService bannersService;
	
	
	@GetMapping("/list")
	public String bannersList() {
		return "/admin/banners/banners";
	}

	@GetMapping(value = "/json", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> tableData() {
		List<BannersDTO> tables = bannersService.list();

		Map<String, Object> response = new HashMap<>();
		response.put("data", tables);
		response.put("size", tables.size());

		return response;
	}

	@GetMapping("/register")
	public String insertBannerPage(Model model) {
		return "/admin/banners/bannerInsert";
	}

	@PostMapping("/register")
	public String insertBanner(@ModelAttribute BannersDTO bannersDTO,
			@RequestParam("banner_image") MultipartFile bannerImage, Model model) {
		try {
			bannersService.insertBanner(bannersDTO, bannerImage);
			model.addAttribute("success", "배너 등록 성공");

		} catch (IOException e) {
            model.addAttribute("error", "파일 업로드 오류");
		}
	    return "redirect:/admin/banners/list";
	}

	@PostMapping("/detail")
	public String showBannerDetail(@RequestParam("banner_num") Integer bannerNum, Model model) {
		BannersDTO banners = bannersService.getBannerDetail(bannerNum);
        
		model.addAttribute("banners", banners);

        return "/admin/banners/bannerDetail";
        
    }

	@PostMapping("/update")
	public String updateBanner(@ModelAttribute BannersDTO bannersDTO,
			@RequestParam(value="banner_image", required = false) MultipartFile bannerImage, Model model) {
		
		try {
		
			bannersService.updateBanner(bannersDTO, bannerImage);
			model.addAttribute("success", "배너 업데이트 성공");
		} catch (Exception e) {
            model.addAttribute("error", "파일 업로드 오류");
		}
		return "redirect:/admin/banners/list";
	}

	@PostMapping("/delete")
	public ResponseEntity<?> deleteBanners(@RequestBody List<Integer> bannerNums) {
		try {
			bannersService.deleteBanners(bannerNums);
			return ResponseEntity.ok("배너 삭제 완료");
		} catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
		}
	}

}
