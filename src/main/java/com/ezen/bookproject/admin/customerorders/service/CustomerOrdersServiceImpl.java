package com.ezen.bookproject.admin.customerorders.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersDTO;
import com.ezen.bookproject.admin.customerorders.dto.CustomerOrdersListDTO;
import com.ezen.bookproject.admin.customerorders.repository.CustomerOrdersRepository;
import com.ezen.bookproject.admin.inventorylog.repository.InventoryLogRepository;
import com.ezen.bookproject.admin.warehouse.mapper.WarehouseRepository;
import com.ezen.bookproject.commons.SearchCondition;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerOrdersServiceImpl implements CustomerOrdersService {
	
	private final CustomerOrdersRepository cor;
	private final WarehouseRepository wr;
	private final InventoryLogRepository ilr;
	
	@Override
	public List<CustomerOrdersDTO> getCustomerOrdersList() {
		try {
			return cor.getCustomerOrdersList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public List<CustomerOrdersDTO> getDataFilter(SearchCondition condition) {
		try {
			return cor.getDataFilterList(condition);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public int deliveryRequestSave(List<Integer> order_nums, String manager_id) {
		int result = 0;
		
		try {
			if(cor.deliveryRequestSave(manager_id) > 0) {
				for(int order_num : order_nums) {
					result += cor.deliveryDetailSave(order_num);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}

	@Override
	public CustomerOrdersDTO getCustomerOrdersDetail(int order_num) {
		try {
			return cor.getCustomerOrdersDetail(order_num);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Override
	public List<CustomerOrdersDTO> getCustomerOrdersDetailList(int order_num) {
		try {
			return cor.getCustomerOrdersDetailList(order_num);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}

	@Transactional
	@Override
	public void orderStatusUpdate(CustomerOrdersListDTO list, int order_num, String order_selected_status, String manager_id) {
		try {
			if(order_selected_status.equals("05") || order_selected_status.equals("06")) {
				cor.orderPaymentUpdate(order_num);
			}
			
			for(int i = 0; i < list.getOrder_detail_num().size(); i++) {
				String isbn = list.getBook_isbn().get(i);
				String bookTitle = list.getBook_name().get(i);
				String zoenNum = getZone_num(isbn);
				Integer inputQty = list.getInput_qty().get(i);
				
				if(order_selected_status.equals("06")) {
					// 입출고 기록 (교환)
					wr.invQtyUpdate(isbn, inputQty);
					
					ilr.invLogRequestInsert("04", manager_id);
					ilr.invLogRequestDetailInsert(isbn, bookTitle, zoenNum, inputQty);
				} else if(order_selected_status.equals("07")) {
					// 입출고 기록 (반품)
					wr.invQtyUpdate(isbn, Math.negateExact(inputQty));
					
					ilr.invLogRequestInsert("03", manager_id);
					ilr.invLogRequestDetailInsert(isbn, bookTitle, zoenNum, inputQty);
				}
				
				cor.orderStatusUpdate(list.getOrder_detail_num().get(i), order_selected_status, list.getInput_qty().get(i));
			}
		} catch (Exception e) {
			e.printStackTrace();
	        throw e;
		}
		
	}

	private String getZone_num(String isbn) {
		try {
			return wr.getZoneNum(isbn);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
}