package kr.co.iQratorPlus.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;

import kr.co.iQratorPlus.database.mapper.LoginMapper;
import kr.co.iQratorPlus.login.domain.LoginVO;

@Service
public class LoginService {
	
	@Autowired
	LoginMapper loginMapper;
	
	// SHA-256 해싱 함수
    private String hashSHA256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 해싱 실패", e);
        }
    }

    public boolean isValidAdmin(String userName, String rawPassword) {
        LoginVO paramVO = new LoginVO();
        paramVO.setUserName(userName);
        LoginVO admin = loginMapper.selectAdminInfo(paramVO);

        if (admin == null) {
            return false; // 사용자가 존재하지 않으면 false 반환
        }

        String dbPwd = admin.getPassword();
        String shaPwd = hashSHA256(rawPassword).toUpperCase(); // 솔트를 사용자명으로 설정

        return shaPwd.equals(dbPwd);
    }
}