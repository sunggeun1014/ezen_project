package com.ezen.bookproject.admin.products.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;

@Data
public class ProductsDTO {
    private int rownum;
    private String book_isbn;
    private String book_name;
    private Integer book_price;
    private String book_publisher;
    private String book_author;
    private Integer book_qty;
    private String book_intro;
    private String book_country_type;
    private String book_category;
    private String book_state;
    private String book_thumbnail_original;
    private String book_thumbnail_changed;
    private MultipartFile thumbnail_img_file;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date book_publish_date;
    private Timestamp book_register_date;
    private String book_deleted;

    public void setBook_price(String book_price) {
        this.book_price = Integer.parseInt(book_price.replace(",", ""));
    }

}