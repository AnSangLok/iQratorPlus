package kr.co.iQratorPlus.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class MyInterceptor implements HandlerInterceptor {

	@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        String loginUser = (String) session.getAttribute("loginUser");

        // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
        if (loginUser == null) {
            response.sendRedirect("/login");
            return false; // 요청 처리 중단
        }

        return true; // 로그인된 경우 요청 계속 진행
    }
	
	@Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HttpSession session = request.getSession();
        String loginUser = (String) session.getAttribute("loginUser");

        if (modelAndView != null && loginUser != null) {
            modelAndView.addObject("loginUser", loginUser); // 로그인한 사용자 ID 전달
        }
    }
}