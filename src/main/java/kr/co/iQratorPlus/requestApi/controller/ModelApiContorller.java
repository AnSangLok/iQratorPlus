package kr.co.iQratorPlus.requestApi.controller;

import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.iQratorPlus.requestApi.service.ModelApiService;

@Controller
public class ModelApiContorller {
	
	@Autowired
	ModelApiService modelapiService;
	
	/**
	 * @description 업체id를 기준으로 배출량의 이상치를 검증함
	 * @param hm
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/wasteApi")
	@ResponseBody
	public HashMap<String,Object> wasteApiGet(@RequestParam HashMap<String, Object> hm) throws Exception {
		System.out.println("@#$@#$@#$"+hm);
		HashMap<String,Object> resultMap = modelapiService.requestEmissions(hm);
		System.out.println("resultMap : " + resultMap);
		return resultMap;
	}
	
	@PostMapping("/wasteApi")
	@ResponseBody
	public HashMap<String,Object> wasteApiPost(@RequestBody  HashMap<String, Object> hm) throws Exception {
		System.out.println("@#$@#$@#$"+hm);
		HashMap<String,Object> resultMap = modelapiService.requestEmissions(hm);
		
		return resultMap;
	}
}
