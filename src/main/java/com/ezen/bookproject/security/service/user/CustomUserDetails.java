package com.ezen.bookproject.security.service.user;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ezen.bookproject.admin.members.dto.UserMembersDTO;

public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 3779630099302073986L;

    private final UserMembersDTO membersDTO;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(UserMembersDTO userMembersDTO, Collection<? extends GrantedAuthority> authorities) {
        this.membersDTO = userMembersDTO;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public UserMembersDTO getMembersDTO() {
        return membersDTO;
    }

    public String getMemberId() {
        return membersDTO.getMember_id();
    }

    @Override
    public String getPassword() {
        return membersDTO.getMember_pw();
    }

    @Override
    public String getUsername() {
        return getMemberId();
    }
}
