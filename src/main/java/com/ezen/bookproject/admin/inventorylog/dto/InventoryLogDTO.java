package com.ezen.bookproject.admin.inventorylog.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class InventoryLogDTO {
	private Integer log_transaction_num;
	private String manager_id;
	private String log_transaction_status;
	private Timestamp log_operation_date;
	private Integer order_num;
	
	private String manager_name;
	private Integer log_detail_qty;
	
    private String log_detail_isbn;
    private String log_detail_title;
    private String zone_num;
}
