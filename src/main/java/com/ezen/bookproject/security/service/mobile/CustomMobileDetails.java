package com.ezen.bookproject.security.service.mobile;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;

public class CustomMobileDetails implements UserDetails {

	private static final long serialVersionUID = -6542465387379687704L;

	private final AdminManagersDTO managersDTO;

    private final Collection<? extends GrantedAuthority> authorities;

    
    public CustomMobileDetails(AdminManagersDTO managersDTO, Collection<? extends GrantedAuthority> authorities) {
        this.managersDTO = managersDTO;
        this.authorities = authorities;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    	return authorities;
    }
    
    public AdminManagersDTO getManagersDTO() {
		return managersDTO;
	}
    
	@Override
	public String getPassword() {
		return managersDTO.getManager_pw();
	}

	@Override
	public String getUsername() {
    	return managersDTO.getManager_id();
	}

}
