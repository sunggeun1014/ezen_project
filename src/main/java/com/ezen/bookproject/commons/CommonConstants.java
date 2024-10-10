package com.ezen.bookproject.commons;

import java.util.LinkedHashMap;
import java.util.Map;

public class CommonConstants {
	
	public static final String[] EMAIL_DOMAINS = { 
	        "naver.com", "gmail.com", "daum.net", "nate.com", 
	        "hanmail.net", "kakao.com", "outlook.com", "yahoo.co.kr", "icloud.com", "hotmail.com" 
	};

    public static final String[] COUNTRY_NUMS = { 
    		"010", "011", "016", "017", "018", "019" 
    };
    
    public static final Map<String, String> INQUIRY_TYPE = new LinkedHashMap<>();

    static {
        INQUIRY_TYPE.put("01", "상품문의");
        INQUIRY_TYPE.put("02", "배송문의");
        INQUIRY_TYPE.put("03", "결제문의");
        INQUIRY_TYPE.put("04", "취소문의");
        INQUIRY_TYPE.put("05", "교환문의");
        INQUIRY_TYPE.put("06", "반품문의");
        INQUIRY_TYPE.put("07", "기타");
    }
    
    public static final String[] MENU_ITEMS = {
            "A-01", "A-02", "A-03", "A-04", "A-05",
            "B-01", "B-02", "B-03", "B-04", "B-05",
            "C-01", "C-02", "C-03", "C-04", "C-05"
    };
}
