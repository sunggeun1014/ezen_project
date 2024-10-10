package com.ezen.bookproject.admin.warehouse.dto;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

public class WarehouseDTO implements Serializable {

	private static final long serialVersionUID = -8687202117698780883L;
	
	String inv_isbn;
	String inv_title;
	Integer inv_qty;
	
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	Timestamp inv_registration_date;
	String zone_num;
}
