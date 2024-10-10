package com.ezen.bookproject.admin.customerorders.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class CustomerOrdersDTO {
	private Integer order_num;
	private String order_addr;
	private String order_addr_detail;
	private String recipient_name;
	private String recipient_phoneNo;
	private String common_ent_pw;
	private String order_delivery_status;       
	private String order_payment_status;     
	private Timestamp order_purchase_date;      
	private Timestamp order_modify_date;
	private String member_id;
	private String retrieve_addr;
	private String retrieve_addr_detail;
	private String retrieve_name;
	private String retrieve_phoneNo;
	private String retrieve_common_cnt_pw;
	private Integer order_complete_qty;
	private String paymentId;
	
	private Integer order_detail_num;       
	private Integer order_detail_qty;       
	private String order_detail_status;             
	private String book_isbn; 
	private Integer order_detail_price;
	private Integer total_order_price;
	private String order_status;
	private Integer order_request_qty;
	
	private String member_name;
	private String member_pw;
	private String member_email;
	private String member_phoneno;
	private String member_addr;
	private String member_detail_addr;
	private String naver_login_cd;
	private String kakao_login_cd;
	private Timestamp member_date;
	
	private String book_name;
	private Integer order_price_sum;
	private Integer order_price_total;
	
}