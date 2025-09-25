package kr.co.iQratorPlus.database.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import kr.co.iQratorPlus.statistics.domain.StatisticsVO;
import kr.co.iQratorPlus.statistics.domain.StatisticsDetailVO;

@Repository
@Mapper
public interface StatisticsMapper {
 	
	// 학습통계 모델별 정보
	public List<StatisticsVO> selectStatisticsModelInfo();
	
	// 학습통계 모델별 상세
	public List<StatisticsDetailVO> selectStatisticsModelDetail(StatisticsDetailVO statisticsDetailVO);
	
}
