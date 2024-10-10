package com.ezen.bookproject.admin.customerorders.dto;

import java.util.List;

import lombok.Data;

@Data
public class CustomerOrdersListDTO {
	private List<Integer> order_detail_num;
	private List<String> book_name;
	private List<String> book_isbn;
	private List<Integer> order_detail_qty;
	private List<String> order_detail_status;
	private List<Integer> input_qty;
}
