package com.ezen.bookproject.admin.home.repository;

import com.ezen.bookproject.admin.inquiries.dto.InquiriesDTO;
import com.ezen.bookproject.admin.products.dto.ProductsDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Repository
public class HomeRepository {
    private final SqlSession sql;

    public int getProductsCnt() {
        return sql.selectOne("Home.getProductsCnt");
    }

    public int getMembersCnt() {
        return sql.selectOne("Home.getMembersCnt");
    }

    public int getTodayOrder() {
        return sql.selectOne("Home.getTodayOrder");
    }

    public Integer getTodaySales() {
        return sql.selectOne("Home.getTodaySales");
    }

    public int getAllOrders() {
        return sql.selectOne("Home.getAllOrders");
    }

    public int getAllDelivering() {
        return sql.selectOne("Home.getAllDelivering");
    }

    public int getAllCompleted() {
        return sql.selectOne("Home.getAllCompleted");
    }

}
