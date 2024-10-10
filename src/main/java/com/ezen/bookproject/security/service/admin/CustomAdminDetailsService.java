package com.ezen.bookproject.security.service.admin;


import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;
import com.ezen.bookproject.security.mapper.AdminMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CustomAdminDetailsService implements UserDetailsService {

    AdminMapper adminMapper;
    HttpServletRequest request;

    public CustomAdminDetailsService(AdminMapper adminMapper, HttpServletRequest request) {
        this.adminMapper = adminMapper;
        this.request = request;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	AdminManagersDTO manager = adminMapper.loadAdminByUsername(username);
        
        if (manager == null) {
            throw new UsernameNotFoundException("아이디를 찾을 수 없습니다.");
        }

        Collection<GrantedAuthority> authorities = new ArrayList<>();

        
        if ("03".equals(manager.getManager_dept())) {        
            authorities.addAll(getOperatorAuthorities(manager));
            authorities.addAll(getWorkerAuthorities(manager));
        } else if ("02".equals(manager.getManager_dept())) {
            authorities.addAll(getOperatorAuthorities(manager));
        } 
     
        return new CustomAdminDetails(manager, authorities);

    }

    // ROLE_OPERATOR 권한 부여
    private Collection<? extends GrantedAuthority> getOperatorAuthorities(AdminManagersDTO manager) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_OPERATOR"));
    }

    // ROLE_WORKER 권한 부여
    private Collection<? extends GrantedAuthority> getWorkerAuthorities(AdminManagersDTO manager) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"));
    }
}


