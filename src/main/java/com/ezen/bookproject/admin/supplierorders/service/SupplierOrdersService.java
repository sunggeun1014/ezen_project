package com.ezen.bookproject.admin.supplierorders.service;

import java.util.List;

import com.ezen.bookproject.admin.supplierorders.dto.SupplierOrdersDTO;
import com.ezen.bookproject.commons.SearchCondition;

public interface SupplierOrdersService {
	public List<SupplierOrdersDTO> getSupplierOrdersList();
	public List<SupplierOrdersDTO> getDataFilter(SearchCondition condition);
	public List<SupplierOrdersDTO> getSupplierOrdersDetailList(Integer order_num);
	public SupplierOrdersDTO getSupplierOrdersDetail(Integer order_num);
	public void orderConfirmInsert(List<SupplierOrdersDTO> dto, String manager_id);
}
