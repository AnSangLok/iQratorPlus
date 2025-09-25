package kr.co.iQratorPlus.unstruct.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class unstructController {

	@RequestMapping(value="unstrutMgmt")
	public ModelAndView unstrutMgmt(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("04.unstructured/Unstructured"); 
		
		return mv;
	}
}
