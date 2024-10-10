package com.ezen.bookproject.admin.inquiries.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.commons.AdminSessionInfo;
import com.ezen.bookproject.admin.inquiries.dto.InquiriesDTO;
import com.ezen.bookproject.admin.inquiries.mapper.InquiriesMapper;
import com.ezen.bookproject.commons.SessionUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class InquiriesServiceImpl implements InquiriesService {

    InquiriesMapper inquiriesMapper;

    @Override
    @Transactional(readOnly = true)
    public List<InquiriesDTO> getList() {
        return inquiriesMapper.getList();
    }

    @Override
    @Transactional(readOnly = true)
    public InquiriesDTO getDetailList(Integer inquiryNum) {
        return inquiriesMapper.getDetailList(inquiryNum);
    }

    @Override
    public void updateInquiry(InquiriesDTO inquiriesDTO) {
    	String answerContent = inquiriesDTO.getAnswer_content();
    	
    	if (answerContent == null) {
    		inquiriesDTO.setAnswer_content(" ");
    	}
    	
    	inquiriesMapper.updateInquiry(inquiriesDTO);
    }

    @Override
    public void insertInquiry(InquiriesDTO inquiriesDTO) {
    	
    	inquiriesDTO.setManager_id(SessionUtils.getAdminAttribute(AdminSessionInfo.MANAGER_ID));
    	
    	inquiriesMapper.insertInquiry(inquiriesDTO);
    }

    @Override
    public List<InquiriesDTO> getListAtHome() {
        return inquiriesMapper.getListAtHome();
    }
}
