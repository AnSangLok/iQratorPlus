package kr.co.iQratorPlus.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor())
                .addPathPatterns("/**")   // 모든 요청에 인터셉터 적용
                .excludePathPatterns("/login", "/loginRequest", "/logout", "/resources/**", "/wasteApi"); // 로그인, 정적 리소스 제외
    }
}