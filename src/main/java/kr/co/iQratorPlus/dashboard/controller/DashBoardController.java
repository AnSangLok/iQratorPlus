package kr.co.iQratorPlus.dashboard.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.iQratorPlus.util.TextEdit;

@Controller
public class DashBoardController {

	@RequestMapping(value="dashboard")
	public ModelAndView dashboard(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("01.dashBoard/DashBoard"); 
		
		HashMap hm = TextEdit.convertMap(request);

		
		return mv;
	}
	
	@RequestMapping(value="inputForm")
	public ModelAndView inputForm(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("01.dashBoard/inputForm"); 
		
		HashMap hm = TextEdit.convertMap(request);
		
		
		return mv;
	}
	
	@RequestMapping(value="response")
	public ModelAndView response(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("01.dashBoard/response"); 
		
		HashMap hm = TextEdit.convertMap(request);
		
		
		return mv;
	}
}
