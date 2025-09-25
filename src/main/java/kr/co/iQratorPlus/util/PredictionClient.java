package kr.co.iQratorPlus.util;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import org.json.JSONArray;
import org.json.JSONObject;

public class PredictionClient {
    public static void main(String[] args) throws IOException {
        // 요청 URL
        String urlString = "http://121.78.116.98:6000/predict-prophet";
        
        // 요청 데이터 설정 (JSON 형태로)
        JSONObject requestData = new JSONObject();
        requestData.put("model_save_path", "prophet_20241204081123.pkl");
        requestData.put("csv_file", "amazone_stock_data.csv");
        requestData.put("target", "Adj Close");
        requestData.put("file_name", new JSONArray().put("Low").put("Close").put("High"));
        
        // 서버에 요청 보내기
        String response = sendPostRequest(urlString, requestData.toString());
        
        // 응답 결과 출력 (예측값)
        System.out.println("Response: " + response);
    }
    
    // POST 요청을 보내는 메서드
    private static String sendPostRequest(String urlString, String jsonInputString) throws IOException {
        // URL 객체 생성
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        
        // POST 요청 설정
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        
        // 요청 본문 데이터 전송
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        // 응답 받기
        int statusCode = connection.getResponseCode();
        if (statusCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return response.toString(); // 예측 결과 반환
        } else {
            return "Error: " + statusCode; // 오류 발생 시 반환
        }
    }
}
