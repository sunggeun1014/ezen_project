package com.ezen.bookproject.admin.managers.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;

public interface AdminMgrService {
	List<AdminManagersDTO> list();
	AdminManagersDTO detailList(String managerId);
	void changeDept(String managerId, String dept);
	void joinProcess(AdminManagersDTO managersDTO, MultipartFile profileImage);
	void updateManager(AdminManagersDTO managersDTO, MultipartFile profileImage);
	boolean isManagerIdAvailable(String managerId);
}
