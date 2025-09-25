package kr.co.iQratorPlus.login.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import kr.co.iQratorPlus.login.service.LoginService;

@Controller
public class LoginController {
	
	@Autowired
	LoginService loginService;
	
	@GetMapping(value="login")
	public String loginPage() {
        return "login"; // login.html 또는 login.jsp 반환
    }
//	public ModelAndView loginPage(HttpServletRequest request) throws Exception {
//		ModelAndView mv = new ModelAndView("00.login/Login"); 
//		return mv;
//	}
	
	@PostMapping(value="login")
    public String login(@RequestParam String username, @RequestParam String password, HttpServletRequest request) {
		if (loginService.isValidAdmin(username, password)) {
            HttpSession session = request.getSession();
            session.setAttribute("loginUser", username);
            return "redirect:/dashboard"; // 로그인 성공 시 대시보드 이동
//            return "mainTemplate"; // 로그인 성공 시 대시보드 이동
        }
        return "redirect:/login?error=true"; // 로그인 실패
    }

	@GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return "redirect:/login";
    }
}
