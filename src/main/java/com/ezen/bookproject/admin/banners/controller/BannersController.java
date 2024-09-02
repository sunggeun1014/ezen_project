package com.ezen.bookproject.admin.banners.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
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
	
    @GetMapping(value= "/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData() {
        List<BannersDTO> tables = bannersService.list();

        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);
        response.put("size", tables.size());

        return response;
    }
	
	@GetMapping("/insert")
	public String insertBannerPage(Model model) {
		
		String templatePath = "/admin/banners/bannerInsert";
        model.addAttribute("template", templatePath); 
		return "/admin/index";
	}
	
	@PostMapping("/insert")
	public String insertBanner(
	    @ModelAttribute BannersDTO bannersDTO,
	    @RequestParam("banner_image") MultipartFile bannerImage, Model model) {


	    try {
			bannersService.insertBanner(bannersDTO, bannerImage);
		} catch (IllegalStateException | IOException e) {
            log.error("파일 업로드 실패", e);
            model.addAttribute("error", "파일 업로드 실패");
            return "/admin/banners/bannerInsert";			
		}
	    return "redirect:/admin/index";
	}
	

    @PostMapping("/details")
    public String showBannerDetails(@RequestParam("banner_num") Integer bannerNum, Model model) {
    	BannersDTO tables = bannersService.detailList(bannerNum);
    	
    	model.addAttribute("banners", tables);
    	

		String templatePath = "/admin/banners/bannerDetail";
        model.addAttribute("template", templatePath); 
        
        return "/admin/index";
        
    }
    
    @PostMapping("/update")
    public String updateBanners(@ModelAttribute("banners") BannersDTO bannersDTO, Model model) {
    	
    	bannersService.updateBanner(bannersDTO);
    	
    	return "/admin/index";
    }
    

}
