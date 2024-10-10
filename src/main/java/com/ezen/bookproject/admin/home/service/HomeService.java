package com.ezen.bookproject.admin.home.service;

import com.ezen.bookproject.admin.home.repository.HomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class HomeService {
    private final HomeRepository homeRepository;

    public int getProductsCnt() {
        return homeRepository.getProductsCnt();
    }

    public int getMembersCnt() {
        return homeRepository.getMembersCnt();
    }

    public int getTodayOrder() {
        return homeRepository.getTodayOrder();
    }

    public int getTodaySales() {
        Integer sales = homeRepository.getTodaySales();
        return (sales != null) ? sales : 0;
    }

    public int getAllOrders() {
        return homeRepository.getAllOrders();
    }

    public int getAllDelivering() {
        return homeRepository.getAllDelivering();
    }

    public int getAllCompleted() {
        return homeRepository.getAllCompleted();
    }

}
