package com.ezen.bookproject.admin.supplierorders.dto;

import java.sql.Timestamp;
import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class SupplierOrdersDTO {

	Integer order_num;       
	String order_status;      
	Timestamp order_date; 
	String manager_id;
	Integer order_total_qty; 
	Integer order_total_price;
	
	Integer order_detail_num;
	String order_detail_isbn;
	String order_detail_title;
	Integer order_detail_qty;
	Integer order_detail_received_qty;
	Integer order_detail_price;
	String order_detail_publisher;
	Integer detail_total_price;
	
	String manager_name;
	String zone_num;
	
	Integer log_transaction_num; 
}
