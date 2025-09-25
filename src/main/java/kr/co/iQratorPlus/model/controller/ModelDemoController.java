package kr.co.iQratorPlus.model.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.iQratorPlus.model.domain.DemoVO;
import kr.co.iQratorPlus.model.service.ModelDemoService;

@Controller
public class ModelDemoController {
	@Autowired
	ModelDemoService modelDemoService;

	
	@RequestMapping(value="selectFirmList")
	@ResponseBody
	public HashMap<String,Object> selectFirmList(@RequestBody HashMap<String, Object> hm) throws Exception {
		HashMap<String,Object> resultMap = modelDemoService.selectFirmList(hm);
		
		return resultMap;
	}
	
	@RequestMapping(value="selectEmisFirm")
	@ResponseBody
	public HashMap<String,Object> selectEmisFirm(@RequestBody HashMap<String, Object> hm) throws Exception {
		HashMap<String,Object> resultMap = modelDemoService.selectEmisFirm(hm);
		
		return resultMap;
	}
	
}






