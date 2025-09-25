package kr.co.iQratorPlus.model.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;

import kr.co.iQratorPlus.model.domain.CalculVO;
import kr.co.iQratorPlus.model.domain.DemoVO;
import kr.co.iQratorPlus.model.domain.ModelVO;
import kr.co.iQratorPlus.model.domain.TableVO;
import kr.co.iQratorPlus.model.service.ModelService;
import kr.co.iQratorPlus.util.TextEdit;

@Controller
public class ModelDataController {
	@Autowired
	ModelService modelService;

	private static String fileName;

	@RequestMapping(value="selectModelWithName")
	@ResponseBody
	public List<ModelVO> selectModelWithName(@RequestBody HashMap<String, Object> hm) throws Exception {
		List<ModelVO> resultList = modelService.selectModelWithName(hm);
		return resultList;
	}
	
	@RequestMapping(value="deleteModelHistory")
	@ResponseBody
	public String deleteModelHistory(@RequestBody HashMap<String, Object> hm) throws Exception {
		String resultStr = modelService.deleteModelHistory(hm);
		return resultStr;
	}
	
	@RequestMapping(value="stopRunningModel")
	@ResponseBody
	public String stopRunningModel(@RequestBody HashMap<String, Object> hm) throws Exception {
		String resultStr = modelService.stopRunningModel(hm);
		return resultStr;
	}
	
	@RequestMapping(value="updateActiveModel")
	@ResponseBody
	public String updateActiveModel(@RequestBody HashMap<String, Object> hm) throws Exception {
		String resultStr = modelService.updateActiveModel(hm);
		return resultStr;
	}
	
	@RequestMapping(value="requestTableList")
	@ResponseBody
	public List<TableVO> requestTableList() throws Exception {
		List<TableVO> resultList = modelService.selectTableList();
		
		return resultList;
	}
	
	@RequestMapping(value="requestTableInfo")
	@ResponseBody
	public List<TableVO> requestTableInfo(@RequestBody HashMap<String, Object> hm) throws Exception {
		List<TableVO> resultList = modelService.selectTableInfo(hm);
		return resultList;
	}
	
	@RequestMapping(value="excuteQuery")
	@ResponseBody
	public HashMap<String, Object> excuteQuery(@RequestBody HashMap<String, Object> hm) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		resultMap = modelService.excuteQuery(hm);
		
		return resultMap;
	}
	
	@RequestMapping(value="selectViewAndDetailList")
	@ResponseBody
	public ModelVO selectViewAndDetailList(@RequestBody HashMap<String, Object> hm) throws Exception {
		ModelVO resultMap = modelService.selectViewAndDetailList(hm);
		
		return resultMap;
	}
	
	@RequestMapping(value="selectModelInfo")
	@ResponseBody
	public List<ModelVO> selectModelInfo() throws Exception {
		List<ModelVO> resultList = modelService.selectModelInfo();
		
		return resultList;
	}
	
	@RequestMapping(value="selectModelInfoAll")
	@ResponseBody
	public List<ModelVO> selectModelInfoAll() throws Exception {
		List<ModelVO> resultList = modelService.selectModelInfoAll();
		return resultList;
	}
	

	@RequestMapping(value="selectModelDetail")
	@ResponseBody
	public ModelVO selectModelDetail(@RequestBody HashMap<String, Object> requestData) throws Exception {
		ModelVO resultMap = modelService.selectModelDetail(requestData);

		return resultMap;
	}
	

	@RequestMapping(value="selectModelHistory")
	@ResponseBody
	public List<HashMap<String, Object>> selectModelHistory(@RequestBody HashMap<String, Object> requestData) throws Exception {
		List<HashMap<String, Object>> resultList = modelService.selectModelHistory(requestData);

		return resultList;
	}
	
	/**
	 * @description 도커 호출정보 select
	 * @param hm
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="selectRequestInfo")
	@ResponseBody
	public ModelVO selectRequestInfo(@RequestBody HashMap<String, Object> hm) throws Exception {
		ModelVO resultVO = new ModelVO();
		resultVO = modelService.selectRequestInfo(hm);
		return resultVO;
	}

	@RequestMapping(value="uploadFile")
	@ResponseBody
	public List<HashMap<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
		List<HashMap<String, Object>> resultList = new ArrayList<HashMap<String, Object>>();
		
		fileName = file.getOriginalFilename();
		
		resultList = modelService.cleaningFile(file);
        
        return resultList;
    }

	@RequestMapping(value="uploadFileWithQuery")
	@ResponseBody
	public List<CalculVO> uploadFileWithQuery(@RequestBody HashMap<String, Object> hm) {
		List<CalculVO> resultList = new ArrayList<CalculVO>();
		fileName = "";
		try {
			resultList = modelService.cleaningWithQuery(hm);
		} catch(Exception e) {
			CalculVO errVO = new CalculVO();
			errVO.setErrMsg(e.toString());
			resultList.add(errVO);
		}
		
        return resultList;
    }
	
	
	@RequestMapping(value="sendVariables")
	@ResponseBody
    public List<HashMap<String, Object>> receiveVariables(@RequestBody HashMap<String, Object> hm) {
		List<HashMap<String, Object>> resultList = new ArrayList();
//		System.out.println("hm:"+hm);
        
        hm.put("fileName", fileName);
        
        
        resultList=modelService.requestFeatureTargetCorr(hm);

        // 결과 메시지 반환
        return resultList;
    }
	
	@RequestMapping(value="sendFiltering")
	@ResponseBody
    public HashMap<String,Object> receiveFiltering(@RequestBody HashMap<String, Object> hm) throws IOException {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		
		hm.put("fileName", fileName);
		
		resultMap = modelService.requestFeatureTrain(hm);
        
        // 결과 메시지 반환
        return resultMap;
    }
	
	
	@RequestMapping(value="insertModelInfo")
	@ResponseBody
	public String insertModelInfo(@RequestBody HashMap<String, Object> hm) {
		
		modelService.insertModelInfo(hm);
		
		return "성공";
	}
	
	@RequestMapping(value="requestFeatures")
	@ResponseBody
	public List<String> requestFeatures(@RequestBody HashMap<String, Object> hm) throws Exception {
		List<String> resultList = new ArrayList<String>();
		resultList = modelService.requestFeatures(hm);
		
		return resultList;
		
	}
	
	@RequestMapping(value="requestPredict")
	@ResponseBody
	public List<HashMap<String,Object>> requestPredict(@RequestBody HashMap<String, Object> hm) throws JsonProcessingException {
		List<HashMap<String,Object>> resultList = new ArrayList<HashMap<String,Object>>();
		
		resultList = modelService.requestPredict(hm);
//		System.out.println("resultList : " + resultList);
		return resultList;
	}
	
	@RequestMapping(value="requestData")
	@ResponseBody
	public List<HashMap<String,Object>> requestData(@RequestBody HashMap<String, Object> hm) {
		List<HashMap<String,Object>> resultList = new ArrayList<HashMap<String,Object>>();
		
		resultList = modelService.requestCsvData(hm);
		
		return resultList;
	}
	
	
	// 모델학습 파트
	/**
	 * @description 재학습 목록 select
	 * @return
	 */
	@RequestMapping(value="reTrainList")
	@ResponseBody
	public List<ModelVO> reTrainList() {
		List<ModelVO> resultList = new ArrayList<ModelVO>();
		
		resultList = modelService.requestReTrainList();
		
		return resultList;
	}
	
	@RequestMapping(value="requestExistData")
	@ResponseBody
	public HashMap<String,Object> requestExistData(@RequestBody HashMap<String, Object> hm) throws JSchException, SftpException, IOException {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		
		resultMap = modelService.requestExistData(hm);
		
		fileName= (String) ((HashMap<String,Object>) resultMap.get("existInfo")).get("fileName");
		
		return resultMap;
	}
}
