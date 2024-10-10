package com.ezen.bookproject.admin.notice.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.commons.AdminSessionInfo;
import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.admin.notice.dto.NoticeDTO;
import com.ezen.bookproject.admin.notice.mapper.NoticeMapper;
import com.ezen.bookproject.commons.AccountManagement;
import com.ezen.bookproject.commons.FileManagement;
import com.ezen.bookproject.commons.SessionUtils;

import jakarta.servlet.http.HttpSession;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {
	NoticeMapper noticeMapper;
	FileManagement fileManagement;
	
	@Override
	@Transactional(readOnly = true)
	public List<NoticeDTO> getList() {
		return noticeMapper.getList();
	}
	
	@Override
	@Transactional(readOnly = true)
	public NoticeDTO getDetailList(Long noticeNum) {
		return noticeMapper.getDetailList(noticeNum);
	}
	
	@Override
	public void deleteNoticesByNums(List<Long> noticeNums) {
		noticeMapper.deleteNoticesByNums(noticeNums);
	}
	
	@Override
	public void saveNotice(NoticeDTO noticeDTO, List<MultipartFile> images) throws IOException {
		noticeDTO.setManager_id(SessionUtils.getAdminAttribute(AdminSessionInfo.MANAGER_ID));
		
		noticeMapper.insertNotice(noticeDTO);

		if (images != null && !images.isEmpty()) {
			for (MultipartFile image : images) {
				String originalFilename = image.getOriginalFilename();
				String modifiedFilename = FileManagement.generateNewFilename(originalFilename, FileManagement.NOTICE_UPLOAD_NAME);
				
				FileManagement.saveImage(image, modifiedFilename, fileManagement.getNoticePath());
				
				
				noticeDTO.setNotice_detail_original(originalFilename);
				noticeDTO.setNotice_detail_changed(modifiedFilename);
				
				
				noticeMapper.insertNoticeDetail(noticeDTO);
			} 
        }
	};
	
	@Override
	public void updateNotice(NoticeDTO noticeDTO, List<MultipartFile> images) throws IOException {
		noticeDTO.setManager_id(SessionUtils.getAdminAttribute(AdminSessionInfo.MANAGER_ID));
		
		noticeMapper.updateNotice(noticeDTO);
		
		if (images != null && !images.isEmpty()) {
			for (MultipartFile image : images) {
				String originalFilename = image.getOriginalFilename();
				String modifiedFilename = FileManagement.generateNewFilename(originalFilename, FileManagement.NOTICE_UPLOAD_NAME);
				
				FileManagement.saveImage(image, modifiedFilename, fileManagement.getNoticePath());
				
				
				noticeDTO.setNotice_detail_original(originalFilename);
				noticeDTO.setNotice_detail_changed(modifiedFilename);
				
				
				noticeMapper.updateNoticeDetail(noticeDTO);
			}
		}
		
	}
	
}
