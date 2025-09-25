package kr.co.iQratorPlus.dashboard.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.iQratorPlus.dashboard.domain.DashBoardVO;
import kr.co.iQratorPlus.dashboard.service.DashBoardService;
import kr.co.iQratorPlus.util.TextEdit;

@Controller
public class DashBoardDataController {
    
	@Autowired
	DashBoardService dashBoardService;
	
	@RequestMapping(value="modelCntSelect")
	@ResponseBody
	public HashMap<String, Object> modelCntSelect(HttpServletRequest request) throws Exception {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		HashMap<String, Object> hm = TextEdit.convertMap(request);
		
		resultMap = dashBoardService.selectModelCnt(hm);
	
//		System.out.println("resultMap : " + resultMap);
		
		return resultMap;
	}
	
	@RequestMapping(value="selectLatestGraph")
	@ResponseBody
	public HashMap<String, Object> selectLatestGraph(HttpServletRequest request) throws Exception {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		HashMap<String, Object> hm = TextEdit.convertMap(request);
		
		resultMap = dashBoardService.graphCollection(hm);
	
//		System.out.println("resultMap : " + resultMap);
		
		return resultMap;
	}
	
	@RequestMapping(value="selectMaxTrainDetail")
	@ResponseBody
	public List<DashBoardVO> selectMaxTrainDetail() throws Exception {
		List<DashBoardVO> resultList = new ArrayList<>();
		
		resultList = dashBoardService.selectMaxTrainDetail();
	
		return resultList;
	}
	
	@RequestMapping(value="selectLatestClusterModel")
	@ResponseBody
	public DashBoardVO selectLatestClusterModel() throws Exception {
		DashBoardVO dVo = new DashBoardVO();
		
		dVo = dashBoardService.selectLatestClusterModel();
		
		return dVo;
	}

}
