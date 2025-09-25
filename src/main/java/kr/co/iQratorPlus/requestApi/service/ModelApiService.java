package kr.co.iQratorPlus.requestApi.service;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kr.co.iQratorPlus.util.TextEdit;

@Service
public class ModelApiService {
	
	@Value("${jsch.sftp.host}")
	private String sftpHost;
	
	@Value("${docker.regression.port}")
	private String regressionPort;
	
	/**
	 * @description 배출량, 보관량 모델 호출
	 * @return JSONObject
	 * @throws Exception
	 */
	public HashMap<String,Object> requestEmissions(HashMap<String,Object> hm) throws Exception {
	    String cid = TextEdit.trim(hm.get("cid"));
	    String waste = TextEdit.trim(hm.get("waste"));
	    String wKind = TextEdit.trim(hm.get("wKind"));
	    String contamination = "0.01";
	    JSONObject resultJson = null;
	    HashMap<String,Object> resultMap = new HashMap<String,Object>();
	    
	    try {
	        String urlString = "http://"+sftpHost+":"+regressionPort+"/predict-api";
	        
	        URL url = new URL(urlString);
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        
	        // POST 요청 설정
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/json");
	        conn.setDoOutput(true);
	        
	        // JSON 객체 생성
	        JSONObject jsonData = new JSONObject();
	        jsonData.put("cid", cid);
	        jsonData.put("waste", waste);
	        jsonData.put("w_kind", wKind);
	        jsonData.put("contamination", contamination);
	        
	        // 데이터 전송
	        try (OutputStream os = conn.getOutputStream()) {
	            byte[] input = jsonData.toString().getBytes("utf-8");
	            os.write(input, 0, input.length);
	        }
	        
	        // 응답 코드 확인
	        int responseCode = conn.getResponseCode();
	        
	        // 응답 내용 출력
	        if(wKind.equals("emis")) {
	        	String response;
		        try (InputStream is = conn.getInputStream();
		             ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
		            byte[] data = new byte[1024];  // 1KB 버퍼 크기
		            int nRead;
		            // InputStream에서 데이터를 읽고 ByteArrayOutputStream에 저장
		            while ((nRead = is.read(data, 0, data.length)) != -1) {
		                buffer.write(data, 0, nRead);
		            }
		            // 결과를 UTF-8로 변환하여 응답 출력
		            response = new String(buffer.toByteArray(), "utf-8");
//		            System.out.println("Response: " + response);
		        }
		        
		        try {
					JSONObject jsonResponse = new JSONObject(response);
					HashMap<String,Object> jsonMap = new HashMap<String,Object>();
					jsonMap.put("jsonResponse", jsonResponse.toString());
					resultMap.put("outliar", jsonResponse.toString());
		            // 결과 출력
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
	        	
//	        	try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
//	        		StringBuilder response = new StringBuilder();
//	        		String responseLine;
//	        		while ((responseLine = br.readLine()) != null) {
//	        			response.append(responseLine.trim());
//	        		}
//	        		// 응답 문자열을 JSON으로 변환
//	        		resultJson = new JSONObject(response.toString());
//	        		System.out.println("resultJson:" + resultJson);
//	        		resultMap.put("outliar", resultJson.getString("outliar"));
//	        	}
	        } else {
	        	
	        	try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
	                StringBuilder response = new StringBuilder();
	                String responseLine;
	                while ((responseLine = br.readLine()) != null) {
	                    response.append(responseLine.trim());
	                }
	                
	                // JSON 응답을 HashMap으로 변환
	                JSONObject responseJson = new JSONObject(response.toString());
	                System.out.println("response.toString() : " + response.toString());
	                System.out.println("responseJson : " + responseJson);
	                // JSON 배열을 Java List로 변환
	                List<HashMap<String, Object>> outlierList = new ArrayList<>();
	                JSONArray outlierArray = responseJson.getJSONArray("outliers");
	                try {
	                	for (int i = 0; i < outlierArray.length(); i++) {
	                		JSONObject outlierObject = outlierArray.getJSONObject(i);
	                		HashMap<String, Object> outlierData = new HashMap<>();
	                		outlierData.put("date", outlierObject.getString("date"));
	                		outlierData.put("value", outlierObject.getDouble("value"));
	                		outlierList.add(outlierData);
	                	}
	                	
	                } catch(Exception ee) {
	                	System.out.println("!@#$!@#$"+outlierArray.get(0));
                		HashMap<String, Object> outlierData = new HashMap<>();
	                	outlierData.put("none", outlierArray.get(0));
	                	outlierList.add(outlierData);
	                }
	                
	                // HashMap에 이상치 리스트 추가
	                resultMap.put("outlier", outlierList);
	            }
	        }
	    } catch(Exception e) {
	    	
//	        e.printStackTrace();
	    }
	    
	    return resultMap; // 응답을 JSON 형식으로 반환
	}
}
