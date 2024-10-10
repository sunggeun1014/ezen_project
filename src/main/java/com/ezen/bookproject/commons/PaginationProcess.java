package com.ezen.bookproject.commons;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class PaginationProcess {
	
	public Map<String, Object> process(Pagination pagination, List<?> list) {
		Map<String, Object> map = new HashMap<>();

		if (pagination == null) {
			pagination = new Pagination();
		}

		int totalItems = list != null ? list.size() : 0;
	    int currentPage = Math.max(1, pagination.getCurrentPage());
	    int itemsPerPage = pagination.getItemsPerPage();
	    int pageRange = pagination.getPageRange();
	    int startPage = (currentPage - 1) / pageRange * pageRange + 1;
	    int endPage = startPage + (pageRange - 1);
	    
	    int totalPages = (int) Math.ceil((double) totalItems / itemsPerPage);
	    
	    totalPages = totalPages <= 0 ? 1 : totalPages; 
	    currentPage = currentPage > totalPages ? totalPages : currentPage; 
	    startPage = startPage > totalPages ? totalPages : startPage;
	    endPage = endPage > totalPages ? totalPages : endPage;
	    
	    List<?> newList = list.stream()
	            .skip((currentPage - 1) * itemsPerPage)
	            .limit(itemsPerPage)
	            .collect(Collectors.toList());
		
	    
	    pagination.setCurrentPage(currentPage);
	    pagination.setTotalPages(totalPages);
	    pagination.setItemsPerPage(itemsPerPage);
	    pagination.setTotalItems(totalItems);
	    pagination.setStartPage(startPage);
	    pagination.setEndPage(endPage);
	    
	    map.put("list", newList);
	    map.put("page", pagination);
	    
		return map;
	}

}
