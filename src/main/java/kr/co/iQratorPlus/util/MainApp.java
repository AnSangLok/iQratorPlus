package kr.co.iQratorPlus.util;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

public class MainApp {
    public static void main(String[] args) {
        // 요청 URL 설정
        String url = "http://localhost:8533/wasteApi";

        // 요청 데이터 생성
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("cid", "200414868");
        requestData.put("waste", "3524.816");
        requestData.put("wKind", "emis");
        requestData.put("contamination", "0.01");

        try {
            // RestTemplate 생성
            RestTemplate restTemplate = new RestTemplate();
            
            // JSON 변환을 위한 ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonRequest = objectMapper.writeValueAsString(requestData);

            // HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // HTTP 요청 본문 설정
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonRequest, headers);

            // POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

            // 응답 출력
            System.out.println("응답 코드: " + response.getStatusCode());
            System.out.println("응답 데이터: " + response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
