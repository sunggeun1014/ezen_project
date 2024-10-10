package com.ezen.bookproject.admin.managers.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ezen.bookproject.admin.managers.dto.AdminManagersDTO;

@Mapper
public interface AdminMgrMapper {
	
	List<AdminManagersDTO> getManagersList();    
    AdminManagersDTO getManagerDetails(@Param("managerId") String managerId);
    void updateManagerDept(@Param("managerId") String managerId, @Param("dept") String dept);
    int addManager(AdminManagersDTO managersDTO);
    void updateManager(AdminManagersDTO managersDTO);
    AdminManagersDTO findById(@Param("managerId") String managerId);
    
}
