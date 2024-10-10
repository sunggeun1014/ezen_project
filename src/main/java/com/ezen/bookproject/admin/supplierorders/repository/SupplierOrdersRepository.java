package com.ezen.bookproject.admin.supplierorders.repository;

import java.sql.SQLException;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.supplierorders.dto.SupplierOrdersDTO;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SupplierOrdersRepository {
	
	private final SqlSessionTemplate sql; 
	
	public List<SupplierOrdersDTO> getSupplierOrdersList() {
		return sql.selectList("SupplierOrders.getList");
	}
	
	public List<SupplierOrdersDTO> getDataFilter(SearchCondition condition) {
		return sql.selectList("SupplierOrders.getList", condition);
	}
	
	public List<SupplierOrdersDTO> getSupplierOrdersDetailList(Integer order_num) {
		return sql.selectList("SupplierOrders.getDetailList", order_num);
	}
	
	public SupplierOrdersDTO getSupplierOrdersDetail(Integer order_num) {
		return sql.selectOne("SupplierOrders.getDetail", order_num);
	}
	
	@Transactional
	public void orderConfirmInsert(List<SupplierOrdersDTO> list, String manager_id) throws SQLException {
		sql.insert("SupplierOrders.orderInsert", manager_id);
		
		for(SupplierOrdersDTO dto : list) {
			sql.insert("SupplierOrders.orderDetailInsert", dto);
		}	
	}
	
}
