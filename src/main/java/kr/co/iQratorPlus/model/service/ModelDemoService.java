package kr.co.iQratorPlus.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iQratorPlus.database.mapper.ModelMapper;
import kr.co.iQratorPlus.model.domain.DemoVO;
import kr.co.iQratorPlus.util.TextEdit;

@Service
public class ModelDemoService {
	@Autowired
	ModelMapper modelMapper;
	
	
	/**
	 * @description 회사명 검색 호출
	 * @return List<DemoVO>
	 * @throws Exception
	 */
	public HashMap<String,Object> selectFirmList(HashMap<String,Object> hm) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		
		String firmName = TextEdit.trim(hm.get("firmName"));
		String entn = TextEdit.trim(hm.get("entn"));
		int pageNum = hm.get("pageNum") != null ? (int) hm.get("pageNum") : 1;
		int pageSize = hm.get("pageSize") != null ? (int) hm.get("pageSize") : 10;

		DemoVO vo = new DemoVO();
		vo.setFirmName("%"+firmName+"%");
		vo.setEntn(entn);
		vo.setPageNum(pageNum);
		vo.setPageSize(pageSize);
		int ttlCnt = modelMapper.selectFirmCnt(vo);
		String pageList = TextEdit.getPageList(ttlCnt, pageNum, pageSize);
		
		List<DemoVO> resultList = modelMapper.selectFirmList(vo);
		resultMap.put("pageList", pageList);
		resultMap.put("resultList", resultList);
		return resultMap;
	}
	
	/**
	 * @description 회사명(배출) 검색 호출
	 * @return List<DemoVO>
	 * @throws Exception
	 */
	public HashMap<String,Object> selectEmisFirm(HashMap<String,Object> hm) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		
		String entn = TextEdit.trim(hm.get("entn"));
		String firmName = TextEdit.trim(hm.get("firmName"));
		int pageNum = hm.get("pageNum") != null ? (int) hm.get("pageNum") : 1;
		int pageSize = hm.get("pageSize") != null ? (int) hm.get("pageSize") : 10;

		DemoVO vo = new DemoVO();
		vo.setFirmName("%"+firmName+"%");
		vo.setEntn(entn);
		vo.setPageNum(pageNum);
		vo.setPageSize(pageSize);
		
		int ttlCnt = modelMapper.selectEmisFirmCnt(vo);
		String pageList = TextEdit.getPageList(ttlCnt, pageNum, pageSize);
		
		List<DemoVO> resultList = modelMapper.selectEmisFirm(vo);
		resultMap.put("pageList", pageList);
		resultMap.put("resultList", resultList);
		return resultMap;
	}
}




