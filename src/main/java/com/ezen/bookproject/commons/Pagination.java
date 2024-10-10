package com.ezen.bookproject.commons;

import lombok.Data;

@Data
public class Pagination {
    private int currentPage = 1; // 현재 페이지
    private int totalPages; // 총 페이지 수
    private int totalItems; // 전체 항목 수
    private int itemsPerPage = 10; // 페이지당 항목 수
    private int pageRange = 5; // 보여줄 페이지 범위
    private int startPage; // 보여줄 시작 페이지
    private int endPage; // 보여줄 끝나는 페이지
}
