package com.ezen.bookproject.admin.warehouse.dto;

import java.io.Serializable;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ZoneNumDTO implements Serializable {

	private static final long serialVersionUID = -6899645473574209349L;
	
	private String zone_num;
}
