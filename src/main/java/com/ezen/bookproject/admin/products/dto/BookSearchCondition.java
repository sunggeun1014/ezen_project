package com.ezen.bookproject.admin.products.dto;

import lombok.Data;

@Data
public class BookSearchCondition {
    private String bookState;
    private String startDate;
    private String endDate;
    private String searchColumn;
    private String searchKeyword;
}
