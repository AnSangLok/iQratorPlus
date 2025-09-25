package kr.co.iQratorPlus.statistics.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class StatisticsController {

	@RequestMapping(value="statisticsView")
	public ModelAndView management(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("03.statistics/Statistics"); 
		
//		HashMap hm = TextEdit.convertMap(request);

		return mv;
	}
}
