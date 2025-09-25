package kr.co.iQratorPlus.database.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import kr.co.iQratorPlus.login.domain.LoginVO;


@Repository
@Mapper
public interface LoginMapper {

	public LoginVO selectAdminInfo(LoginVO vo);
}
