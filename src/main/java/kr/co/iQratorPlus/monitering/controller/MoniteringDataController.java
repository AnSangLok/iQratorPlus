package kr.co.iQratorPlus.monitering.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.iQratorPlus.monitering.domain.AlgorithmVO;
import kr.co.iQratorPlus.monitering.domain.CallApiCntVO;
import kr.co.iQratorPlus.monitering.domain.ContainerStatVO;
import kr.co.iQratorPlus.monitering.service.MonitoringService;

@Controller
public class MoniteringDataController {

	@Autowired
	MonitoringService monitoringService;
	
	@RequestMapping(value="selectMonitoringAlgorithm")
	@ResponseBody
	public List<AlgorithmVO> selectMonitoringAlgorithm(HttpServletRequest request) throws Exception {
		
		List<AlgorithmVO> algoList = monitoringService.selectMonitoringAlgorithm();
		
		return algoList;
	}
	
	@RequestMapping(value="selectMonitoringCallApiCnt")
	@ResponseBody
	public List<CallApiCntVO> selectMonitoringCallApiCnt(HttpServletRequest request) throws Exception {
		
		List<CallApiCntVO> callCntList = monitoringService.selectMonitoringCallApiCnt();
		
		return callCntList;
	}
	
	@RequestMapping(value="getContainerStats")
	@ResponseBody
	public List<ContainerStatVO> getContainerStats() throws Exception {
        List<ContainerStatVO> containerStats = new ArrayList<>();
        containerStats = monitoringService.getContainerStats();

        return containerStats; // 이 데이터를 JSON으로 반환
    }

}
