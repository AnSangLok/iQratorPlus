package kr.co.iQratorPlus.util;
//package kr.co.iQratorPlus.util;
//
//public class Snippet {
//	public static void main(String[] args) {
//		if(mappingValue.equals("train-pmdarima")) {
//						System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
//						HashMap<String, Object> pmdMap = new HashMap<String, Object>();
//		
//						JSONObject jsonResponse = new JSONObject(response);
//			            
//			            // 필요한 데이터 추출
//			            JSONArray trainData = jsonResponse.getJSONArray("trainData");
//			            JSONArray testData = jsonResponse.getJSONArray("testData");
//			            JSONArray predictions = jsonResponse.getJSONArray("predictions");
//			            JSONArray labels = jsonResponse.getJSONArray("labels");
//			            System.out.println("trainData : " + trainData);
//			            System.out.println("testData : " + testData);
//			            System.out.println("predictions : " + predictions);
//			            System.out.println("labels : " + labels);
//			            pmdMap.put("trainData", trainData);
//			            pmdMap.put("testData", testData);
//			            pmdMap.put("predictions", predictions);
//			            pmdMap.put("labels", labels);
//			            
//			            resultList.add(pmdMap);
//			            
//					} else {
//						System.out.println("$#%@#$%@#$%@#$%@#$%");
//						ObjectMapper objectMapper = new ObjectMapper();
//		//        JsonNode rootNode = objectMapper.readTree(response);
//		//			objectMapper.configure(JsonParser.Feature.ALLOW_NON_NUMERIC_NUMBERS, true);
//						
//						try {
//							// JSON 문자열을 List<HashMap<String, Object>>로 변환
//							resultList = objectMapper.readValue(response, List.class);
//							// 결과 출력
//						} catch (IOException e) {
//							e.printStackTrace();
//						}
//					}
//	}
//}
//
