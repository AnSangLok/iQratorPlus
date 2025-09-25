package kr.co.iQratorPlus.statistics.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iQratorPlus.database.mapper.StatisticsMapper;
import kr.co.iQratorPlus.statistics.domain.StatisticsVO;
import kr.co.iQratorPlus.statistics.domain.StatisticsDetailVO;

@Service
public class StatisticsService {
	
	@Autowired
	StatisticsMapper statisticsMapper;
	
	public List<StatisticsVO> selectStatisticsModelInfo() throws Exception {
		
		List<StatisticsVO> statList = statisticsMapper.selectStatisticsModelInfo();
		
		return statList;
	}	
	
	public List<StatisticsDetailVO> selectStatisticsModelDetail(StatisticsDetailVO statisticsDetailVO) throws Exception {
		
		List<StatisticsDetailVO> statDetailList = statisticsMapper.selectStatisticsModelDetail(statisticsDetailVO);
		
		return statDetailList;
	}
}
