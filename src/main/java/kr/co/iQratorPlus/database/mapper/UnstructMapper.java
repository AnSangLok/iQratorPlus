package kr.co.iQratorPlus.database.mapper;

import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UnstructMapper {
	public HashMap selectUnstructInfo(HashMap paramMap);
}
