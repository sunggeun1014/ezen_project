package com.ezen.bookproject.admin.customerorders.service;

import java.util.List;

import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersDTO;
import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersListDTO;
import com.ezen.bookproject.commons.SearchCondition;

public interface CustomerOrdersService {

	public List<CustomerOrdersDTO> getCustomerOrdersList();
	public List<CustomerOrdersDTO> getDataFilter(SearchCondition condition);
	public int deliveryRequestSave(List<Integer> order_nums, String manager_id);
	public CustomerOrdersDTO getCustomerOrdersDetail(int order_num);
	public List<CustomerOrdersDTO> getCustomerOrdersDetailList(int order_num);
	public void orderStatusUpdate(CustomerOrdersListDTO list, int order_num, String order_selected_status, String manager_id);
}
