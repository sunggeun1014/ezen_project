package com.ezen.bookproject.admin.notice.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ezen.bookproject.admin.notice.dto.NoticeDTO;

import jakarta.servlet.http.HttpSession;

public interface NoticeService {
	List<NoticeDTO> getList();
	NoticeDTO getDetailList(Long noticeNum);
	void deleteNoticesByNums(List<Long> noticeNums);
	void saveNotice(NoticeDTO noticeDTO, List<MultipartFile> images) throws IOException;
	void updateNotice(NoticeDTO noticeDTO, List<MultipartFile> images) throws IOException;
}
