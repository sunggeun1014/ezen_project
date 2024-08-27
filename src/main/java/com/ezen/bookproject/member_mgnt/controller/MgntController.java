package com.ezen.bookproject.member_mgnt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ezen.bookproject.member_mgnt.dto.MembersDTO;
import com.ezen.bookproject.member_mgnt.service.MgntService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Controller
@RequestMapping("/table")
public class MgntController {
	
	private final MgntService mgntService;

	@GetMapping
    public String table() {
        return "/members/members";
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> tableData() {
        List<MembersDTO> tables = mgntService.list();

        // DataTables가 요구하는 형식으로 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);

        return response;
    }
}
