package com.ezen.bookproject.admin.home.controller;

import com.ezen.bookproject.admin.home.service.HomeService;
import com.ezen.bookproject.admin.inquiries.dto.InquiriesDTO;
import com.ezen.bookproject.admin.inquiries.service.InquiriesService;
import com.ezen.bookproject.admin.inventorylog.dto.InventoryLogDTO;
import com.ezen.bookproject.admin.inventorylog.service.InventoryLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin/home")
@Controller
public class HomeController {
    private final InquiriesService iqs;
    private final InventoryLogService ils;

    @GetMapping(value = "/inquiries/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> getInquiriesData() {
        List<InquiriesDTO> tables = iqs.getListAtHome();

        Map<String, Object> response = new HashMap<>();
        response.put("data", tables);

        return response;
    }


    @GetMapping(value = "/stocks/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> getStocksData() {
        Map<String, Object> responseMap = new HashMap<>();
        List<InventoryLogDTO> list = ils.getListAtHome();

        responseMap.put("data", list);

        return responseMap;
    }
}
