package kr.co.iQratorPlus.util;
import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JavaClient {
    public static void main(String[] args) {
        String host = "127.0.0.1";
        int port = 18888;

        try (Socket socket = new Socket(host, port)) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(socket.getOutputStream()), true);

            // 보낼 문자열
            String inputData = "안녕하세요";
            int totalLength = inputData.length();

            for (int i = 0; i < totalLength; i += 5) {
                // 5글자씩 잘라서 전송
                String substring = inputData.substring(i, Math.min(i + 5, totalLength));
                Map<String, Object> data = new HashMap<>();
                data.put("value", substring);
                String jsonData = new ObjectMapper().writeValueAsString(data);

                // 서버에 데이터 전송
                writer.println(jsonData);

                // 서버 응답 수신
                String response;
                while ((response = reader.readLine()) != null) {
                    // JSON 파싱
                    Map<String, Object> resultMap = new ObjectMapper().readValue(response, Map.class);
                    
                    if (resultMap.containsKey("result")) {
                        System.out.println("Python 서버 응답: " + resultMap.get("result"));
                    }

                    // 서버에서 응답이 null이 오면 종료
                    if (resultMap.get("result") == null) {
                    	socket.close();
                        break;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

