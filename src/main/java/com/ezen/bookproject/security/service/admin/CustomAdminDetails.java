package com.ezen.bookproject.security.service.admin;


import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;

public class CustomAdminDetails implements UserDetails {

	private static final long serialVersionUID = -1573691849618309598L;
	
	private final AdminManagersDTO managersDTO;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomAdminDetails(AdminManagersDTO managersDTO, Collection<? extends GrantedAuthority> authorities) {
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

    public String getManagerId() {
        return managersDTO.getManager_id();
    }
    
    @Override
	public String getPassword() {
		return managersDTO.getManager_pw();
	}
    
    @Override
    public String getUsername() {
    	return getManagerId();
    }
   
}
