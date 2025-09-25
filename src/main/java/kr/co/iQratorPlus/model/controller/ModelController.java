package kr.co.iQratorPlus.model.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.iQratorPlus.model.service.ModelService;

@Controller
public class ModelController {

	@Autowired
	ModelService modelService;
	
	@RequestMapping(value="modelMgmt")
	public ModelAndView management(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("02.model/Management"); 

		return mv;
	}

	@RequestMapping(value="model-tr")
	public ModelAndView training(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("02.model/Training"); 
		
//		HashMap hm = TextEdit.convertMap(request);

		return mv;
	}

	@RequestMapping(value="model-execute")
	public ModelAndView execution(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("02.model/Execution"); 
		
//		HashMap hm = TextEdit.convertMap(request);

		return mv;
	}

	@RequestMapping(value="model-test")
	public ModelAndView demon(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("02.model/Test"); 
		
//		HashMap hm = TextEdit.convertMap(request);

		return mv;
	}
}
