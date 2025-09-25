package kr.co.iQratorPlus.dashboard.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iQratorPlus.dashboard.domain.DashBoardVO;
import kr.co.iQratorPlus.database.mapper.DashBoardMapper;

@Service
public class DashBoardService {
	
	@Autowired
	DashBoardMapper dashBoardMapper;
	
	public HashMap<String, Object> selectModelCnt(HashMap<String, Object> hm) throws Exception{
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		HashMap<String, Object> dbMap = dashBoardMapper.selectModelCnt(hm);
		int ttlCnt = ((BigDecimal) dbMap.get("TOTAL_COUNT")).intValue();
		int cntS = ((BigDecimal) dbMap.get("COUNT_OF_S")).intValue();
		
		resultMap.put("ttlCnt", ttlCnt);
		resultMap.put("cntS", cntS);
		
//		System.out.println("dbMap : " + dbMap);
		return resultMap;
	}
	
	public HashMap<String, Object> graphCollection(HashMap<String, Object> hm) throws Exception{
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		List<DashBoardVO> algorithmCntList = dashBoardMapper.selectAlgorithmCnt();
		List<DashBoardVO> apiCallCntList = dashBoardMapper.selectCallApiCnt();
		resultMap.put("algorithmCntList", algorithmCntList);
		resultMap.put("apiCallCntList", apiCallCntList);
		
		return resultMap;
	}
	
	public List<DashBoardVO> selectMaxTrainDetail() throws Exception{
		List<DashBoardVO> resultList = new ArrayList<>();
		
		DashBoardVO dVo = dashBoardMapper.selectMaxTrain();
		resultList = dashBoardMapper.selectMaxTrainDetail(dVo);
		
		return resultList;
	}
	
	public DashBoardVO selectLatestClusterModel() throws Exception{
		DashBoardVO dVo = dashBoardMapper.selectLatestClusterModel();
		
		return dVo;
	}
}
