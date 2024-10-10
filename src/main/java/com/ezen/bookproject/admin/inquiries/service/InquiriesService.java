package com.ezen.bookproject.admin.inquiries.service;

import java.util.List;

import com.ezen.bookproject.admin.inquiries.dto.InquiriesDTO;

public interface InquiriesService {
    List<InquiriesDTO> getList();
    InquiriesDTO getDetailList(Integer inquiryNum);
    void updateInquiry(InquiriesDTO inquiriesDTO);
    void insertInquiry(InquiriesDTO inquiriesDTO);
    List<InquiriesDTO> getListAtHome();
}