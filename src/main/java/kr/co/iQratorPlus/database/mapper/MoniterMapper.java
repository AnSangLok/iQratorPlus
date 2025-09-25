package kr.co.iQratorPlus.database.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import kr.co.iQratorPlus.monitering.domain.AlgorithmVO;
import kr.co.iQratorPlus.monitering.domain.CallApiCntVO;

@Repository
@Mapper
public interface MoniterMapper {
	
	public List<AlgorithmVO> selectMonitoringAlgorithm();
	
	public List<CallApiCntVO> selectMonitoringCallApiCnt();
	
}
