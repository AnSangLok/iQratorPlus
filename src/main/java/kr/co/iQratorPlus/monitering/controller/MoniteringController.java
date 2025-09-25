package kr.co.iQratorPlus.monitering.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MoniteringController {

	@RequestMapping(value="moniteringView")
	public ModelAndView moniteringView(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView("05.moniter/Moniter"); 
		
//		HashMap hm = TextEdit.convertMap(request);

		return mv;
	}
}
