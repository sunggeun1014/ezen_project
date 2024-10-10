package com.ezen.bookproject.admin.products.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class InventoryDTO {
    private String inv_isbn;
    private String inv_title;
    private Integer inv_qty;
    private Timestamp inv_registration_date;
    private String zone_num;
}
