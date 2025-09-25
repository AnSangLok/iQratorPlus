package kr.co.iQratorPlus.statistics.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.iQratorPlus.statistics.service.StatisticsService;
import kr.co.iQratorPlus.statistics.domain.StatisticsVO;
import kr.co.iQratorPlus.statistics.domain.StatisticsDetailVO;
@Controller
public class StatisticsDataController {
	@Autowired
	StatisticsService statisticsService;
	
	@RequestMapping(value="selectStatisticsModelInfo")
	@ResponseBody
	public List<StatisticsVO> selectStatisticsModelInfo(HttpServletRequest request) throws Exception {
		
		List<StatisticsVO> statList = statisticsService.selectStatisticsModelInfo();
		
		return statList;
	}

	@RequestMapping(value="selectStatisticsModelDetail")
	@ResponseBody
	public List<StatisticsDetailVO> selectStatisticsModelDetail(@RequestBody StatisticsDetailVO statisticsDetailVO) throws Exception {
		
		List<StatisticsDetailVO> statDetailList = statisticsService.selectStatisticsModelDetail(statisticsDetailVO);

		return statDetailList;
	}
}
