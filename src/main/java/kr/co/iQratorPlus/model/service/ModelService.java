package kr.co.iQratorPlus.model.service;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

import kr.co.iQratorPlus.database.mapper.ModelMapper;
import kr.co.iQratorPlus.model.domain.CalculVO;
import kr.co.iQratorPlus.model.domain.DemoVO;
import kr.co.iQratorPlus.model.domain.ModelVO;
import kr.co.iQratorPlus.model.domain.TableVO;
import kr.co.iQratorPlus.util.TextEdit;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

@Service
public class ModelService {
	
	@Autowired
	ModelMapper modelMapper;
	
	@Value("${upload.file.path}")
    private String uploadPath;
	
	@Value("${jsch.sftp.host}")
	private String sftpHost;
	
	@Value("${jsch.sftp.port}")
	private int sftpPort;
	
	@Value("${jsch.sftp.user}")
	private String sftpUser;
	
	@Value("${jsch.sftp.pwd}")
	private String sftpPwd;
	
	@Value("${docker.kendall.port}")
	private String kendallPort;
	
	@Value("${docker.kendall.url}")
	private String kendallUrl;
	
	@Value("${docker.regression.port}")
	private String regressionPort;
	
	@Value("${docker.regression.train}")
	private String regressionTrain;
	
	@Value("${docker.cluster.train}")
	private String clusterTrain;
	
	@Value("${docker.regression.predict}")
	private String regressionPredict;
	
	@Value("${docker.cluster.predict}")
	private String clusterPredict;
	
	@Value("${docker.container.kendall}")
	private String kendallCtnr;
	
	@Value("${docker.container.regression}")
	private String regressionCntr;
	
	@Value("${docker.volume.ml}")
	private String mlVol;
	
	@Value("${docker.volume.ml.path}")
	private String volPath;
	
	@Value("${docker.volume.ml.score}")
	private String scorePath;
	
	@Value("${docker.volume.ml.files}")
	private String filesPath;
	
	@Value("${spring.datasource1.hikari.jdbc-url}")
	private String dbDns;
	
	@Value("${spring.datasource1.hikari.username}")
	private String dbUser;
	
	@Value("${spring.datasource1.hikari.password}")
	private String dbPwd;
	
	String mappingValue = "";
	
	LocalDate today = LocalDate.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
    String formattedDate = today.format(formatter);
	
	/**
	 * @description 모델명 검색 호출
	 * @return List<ModelVO>
	 * @throws Exception
	 */
	public List<ModelVO> selectModelWithName(HashMap<String,Object> hm) throws Exception {
		String modelViewName = TextEdit.trim(hm.get("modelViewName"));
		ModelVO vo = new ModelVO();
		vo.setModelViewName("%"+modelViewName+"%");
		List<ModelVO> resultList = modelMapper.selectModelWithName(vo);
		return resultList;
	}
	
	/**
	 * @description 테이블 목록 호출
	 * @return List<TableVO>
	 * @throws Exception
	 */
	public List<TableVO> selectTableList() throws Exception {
		List<TableVO> resultList = modelMapper.selectTableList();
		return resultList;
	}
	
	/**
	 * @description 테이블 정보 호출
	 * @return List<TableVO>
	 * @throws Exception
	 */
	public List<TableVO> selectTableInfo(HashMap<String,Object> hm) throws Exception {
		String tableName = TextEdit.trim(hm.get("tableName"));
		TableVO vo = new TableVO();
		vo.setTableName(tableName);
		List<TableVO> resultList = modelMapper.selectTableInfo(vo);
		return resultList;
	}
	
	/**
	 * @description 사용자 쿼리 실행
	 * @param hm
	 * @return HashMap<String,Object>
	 * @throws Exception
	 */
	public HashMap<String,Object> excuteQuery(HashMap<String,Object> hm) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			String query = TextEdit.trim(hm.get("query"));
			String rows = TextEdit.trim(hm.get("rows"));
			List<HashMap<String,Object>> contentsList = modelMapper.excuteQuery(query, rows);
			List<String> columnList = new ArrayList<String>();
			
			HashMap<String,Object> firstRow = contentsList.get(0);
//			System.out.println("firstRow : " + firstRow);
			for(String columnName : firstRow.keySet()) {
				columnList.add(columnName);
			}
			
			resultMap.put("columnList", columnList);
			resultMap.put("contentsList", contentsList);
		}  catch (Exception e) {
			List<String> errList = new ArrayList<String>();
			List<HashMap<String,Object>> errContentsList = new ArrayList<HashMap<String,Object>>();
			HashMap<String,Object> errMap = new HashMap<String,Object>();
			errList.add("Error");
			errMap.put("Error", e.toString());
			errContentsList.add(errMap);
			
			resultMap.put("columnList", errList);
			resultMap.put("contentsList", errContentsList);
		}
		
		return resultMap;
	}
	
	/**
	 * @description 특정 모델을 삭제
	 * @param hm
	 * @return
	 * @throws Exception
	 */
	public String deleteModelHistory(HashMap<String, Object> hm) throws Exception {
		String detailId = TextEdit.trim(hm.get("detailId"));
		int deatilCnt = Integer.parseInt(TextEdit.trim(hm.get("detailCnt")));
		String modelId = TextEdit.trim(hm.get("modelId"));
		String detailState = TextEdit.trim(hm.get("detailState"));
		
		ModelVO vo = new ModelVO();
		vo.setDetailId(detailId);
		vo.setModelId(modelId);
		vo.setModelState(detailState);
		
		try {
			if(deatilCnt==1) {
				modelMapper.deleteModelHistory(vo);
				modelMapper.deleteModelOrg(vo);
			} else {
				modelMapper.deleteModelHistory(vo);
				if(detailState.equals("A")) {
					ModelVO resultVO = modelMapper.selectLatestDetail(vo);
					detailId = resultVO.getDetailId();
					vo.setDetailId(detailId);
					modelMapper.updateModelStates(vo);
					modelMapper.updateDetailState(vo);
					modelMapper.startModelStates(vo);
				}
			}
			return "success";
		}catch(Exception e) {
			return e.toString();
		}
	}
	
	/**
	 * @description 특정 모델을 중지
	 * @param hm
	 * @return
	 * @throws Exception
	 */
	public String stopRunningModel(HashMap<String, Object> hm) throws Exception {
		try {
			ModelVO vo = new ModelVO();
			vo.setModelId(TextEdit.trim(hm.get("modelId")));
			modelMapper.updateModelStates(vo);
			modelMapper.stopModelStates(vo);
			return "success";
		}catch(Exception e) {
			return e.toString();
		}
	}
	
	/**
	 * @description 적용중인 모델을 변경
	 * @param hm
	 * @return
	 * @throws Exception
	 */
	public String updateActiveModel(HashMap<String, Object> hm) throws Exception {
		try {
			ModelVO vo = new ModelVO();
			vo.setModelId(TextEdit.trim(hm.get("modelId")));
			vo.setDetailId(TextEdit.trim(hm.get("detailId")));
			modelMapper.updateModelStates(vo);
			modelMapper.updateDetailState(vo);
			modelMapper.startModelStates(vo);
			return "success";
		}catch(Exception e) {
			return e.toString();
		}
	}
	
	public ModelVO selectViewAndDetailList(HashMap<String, Object> hm) throws Exception {
		ModelVO vo = new ModelVO();
		vo.setModelId(TextEdit.trim(hm.get("id")));
		ModelVO resultMap = modelMapper.selectViewAndDetailList(vo);
		return resultMap;
	}
	
	/**
	 * @description 모델 정보 select
	 * @return
	 * @throws Exception
	 */
	public List<ModelVO> selectModelInfo() throws Exception {
		List<ModelVO> resultList = modelMapper.selectModelInfo();
		return resultList;
	}
	
	/**
	 * @description 모델 전체 정보 select
	 * @return
	 * @throws Exception
	 */
	public List<ModelVO> selectModelInfoAll() throws Exception {
		List<ModelVO> resultList = modelMapper.selectModelInfoAll();
		return resultList;
	}
	
	public ModelVO selectModelDetail(HashMap<String,Object> hm) throws Exception {
		String modelId = TextEdit.trim(hm.get("modelId"));
		String modelState = TextEdit.trim(hm.get("modelState"));
		ModelVO vo = new ModelVO();
		vo.setModelId(modelId);
		vo.setModelState(modelState);
		if(modelState.equals("R")) {
			ModelVO resultMap = modelMapper.selectModelDetail(vo);
			return resultMap;
		}else {
			ModelVO resultMap = modelMapper.selectWaitModelDetail(vo);
			return resultMap;
		}
	}
	
	
	public List<HashMap<String,Object>> selectModelHistory(HashMap<String,Object> hm) throws Exception {
		List<HashMap<String,Object>> resultLis = modelMapper.selectModelHistory(hm);
		return resultLis;
	}
	
	
	public List<String> requestFeatures(HashMap<String,Object> hm) throws Exception {
		List<String> resultList = new ArrayList<String>();
		String modelId = TextEdit.trim(hm.get("id"));
		ModelVO vo = new ModelVO();
		vo.setModelId(modelId);
		
		ModelVO resultVO = modelMapper.selectFeatures(vo);
		String features = resultVO.getFeatures();
		
		resultList = Arrays.asList(features.split(","));
		
		return resultList;
	}
	
	public ModelVO selectRequestInfo(HashMap<String,Object> hm) throws Exception {
		String modelId = TextEdit.trim(hm.get("modelId"));
		String modelState = TextEdit.trim(hm.get("modelState"));
		
		ModelVO vo = new ModelVO();
		vo.setModelId(modelId);

		if(modelState.equals("R")) {
			ModelVO resultVO = modelMapper.selectRequestInfo(vo);
			return resultVO;
		}else {
			ModelVO resultMap = modelMapper.selectWaitRequestInfo(vo);
			return resultMap;
		}
	}
	
	public List<HashMap<String, Object>> cleaningFile(@RequestParam("file") MultipartFile file) {
		List<HashMap<String, Object>> resultList = new ArrayList();
		
		//서버용
		TextEdit.uploadServerDirect(file, filesPath+formattedDate+"/");
		System.out.println("!@#$!@#$" + filesPath+formattedDate+"/");
		//로컬용
//		TextEdit.uploadFileToServer(file,sftpHost,sftpPort,sftpUser,sftpPwd,uploadPath);
		
		 try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
	        	String line = reader.readLine();

	            // 첫 줄을 컬럼명으로 처리
	            String[] headers = line.split(",");
	            Map<String, List<String>> columns = new HashMap<>();
	            for (String header : headers) {
	                columns.put(header.trim(), new ArrayList<>());
	            }

	            // CSV 데이터 읽기
	            while ((line = reader.readLine()) != null) {
	                String[] values = line.split(",");
	                for (int i = 0; i < headers.length; i++) {
	                    String header = headers[i].trim();
	                    if (i < values.length) {
	                        columns.get(header).add(values[i].trim());
	                    } else {
	                        columns.get(header).add("");  // 값이 없는 경우 빈 문자열 추가
	                    }
	                }
	            }
	            // 컬럼별 통계 계산
	            for (String header : headers) {
	                List<String> values = columns.get(header);
	                List<Double> numericValues = new ArrayList<>();
	                List<String> dateValues = new ArrayList<>();

	                // 타입별로 분류
	                for (String value : values) {
	                    if (value.isEmpty()) {
	                    	continue;  // 결측값 처리
	                    }
	                    if (TextEdit.isNumeric(value)) {
	                        numericValues.add(Double.parseDouble(value));
	                    } else if ((header.toLowerCase()).contains("date")) {
	                        dateValues.add(TextEdit.convertFormat(value));
	                    } else {
	                    	if(header.toLowerCase().equals("date")) {
//	                    		System.out.println("else : " + value);
	                    	}
	                    }
	                }

	                HashMap<String, Object> columnStats = new HashMap<>();
	                if (!numericValues.isEmpty()) {
	                    columnStats.putAll(TextEdit.calculateNumericStatistics(numericValues));
	                } else if (!dateValues.isEmpty()) {
//	                	System.out.println("날짜 개수 : " + dateValues.size());
	                    columnStats.putAll(TextEdit.calculateDateStatistics(dateValues));
	                } else {
	                	columnStats.put("min", "-");
	                    columnStats.put("max", "-");
	                    columnStats.put("uniqueCnt", "-");
	                    columnStats.put("duplicateCnt", "-");
	                    columnStats.put("missingCnt", "-");
	                    columnStats.put("mean", "-");
	                    columnStats.put("meanDeviation", "-");
	                    columnStats.put("valueType", "String");
	                    columnStats.put("message", "문자열 컬럼 - 통계 생략");
	                }
	                columnStats.put("columnName", header);
	                resultList.add(columnStats);
	            }
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
		
		return resultList;
	}
	
	public List<CalculVO> cleaningWithQuery(HashMap<String, Object> hm) {
		String query = TextEdit.trim(hm.get("query"));
		List<String> tmpList = TextEdit.getColumnNames(dbDns, dbUser, dbPwd, query);
		List<TableVO> columnList = new ArrayList<TableVO>();
		for(String columnName : tmpList) {
			TableVO vo = new TableVO();
			vo.setColumnName(columnName);
			columnList.add(vo);
		}
		//숫자여부를 판단하는 쿼리를 실행한다.
		List<CalculVO> chkNumCol = modelMapper.checkNumber(query, columnList);
		//데이터의 최대 최소 평균... 계산 쿼리를 실행한다.
		List<CalculVO> cleanDatas = modelMapper.calculatateInfo(query, columnList);
//		System.out.println("cleanDatas : " + cleanDatas);
//		System.out.println("cleanDatas : " + cleanDatas.size());
		
		for(int j=0; j<chkNumCol.size(); j++) {
			for(int i=0; i<cleanDatas.size(); i++) {
				if(cleanDatas.get(i).getColumnName().equals(chkNumCol.get(j).getColumnName()) && chkNumCol.get(j).getValidationResult()==0) {
					if(cleanDatas.get(i).getMean()==null) {
						System.out.println(1);
						if((cleanDatas.get(i).getMin()==null)||(cleanDatas.get(i).getMax()==null)) {
							System.out.println(2);
							cleanDatas.get(i).setValueType("String");
							cleanDatas.get(i).setMessage("문자열 컬럼 - 통계 생략");
						}else {
							System.out.println(3);
							if(TextEdit.isValidDate(cleanDatas.get(i).getMin())||TextEdit.isValidDate(cleanDatas.get(i).getMax())) {
								System.out.println(4);
								cleanDatas.get(i).setValueType("DATE");
							} else {
								System.out.println(5);
								cleanDatas.get(i).setValueType("String");
								cleanDatas.get(i).setMessage("문자열 컬럼 - 통계 생략");
							}
						}
					}else {
						System.out.println(6);
						cleanDatas.get(i).setValueType("NUM");
					}
				}if(cleanDatas.get(i).getColumnName().equals(chkNumCol.get(j).getColumnName()) && chkNumCol.get(j).getValidationResult()==1) {
					System.out.println(7);
					if(TextEdit.isValidDate(cleanDatas.get(i).getMin())||TextEdit.isValidDate(cleanDatas.get(i).getMax())) {
						System.out.println(8);
						cleanDatas.get(i).setValueType("DATE");
					} else {
						System.out.println(9);
						cleanDatas.get(i).setValueType("String");
						cleanDatas.get(i).setMessage("문자열 컬럼 - 통계 생략");
					}
				}
			}
		}
		return cleanDatas;
	}
	
	
	public HashMap<String, Object> requestExistData(HashMap<String, Object> hm) throws JSchException, SftpException, IOException {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		List<HashMap<String, Object>> resultList = new ArrayList<HashMap<String, Object>>();
		String modelId = TextEdit.trim(hm.get("modelId"));
		ModelVO vo = new ModelVO();
		vo.setModelId(modelId);
		
		ModelVO pathVo = modelMapper.selectExistDataPath(vo);
		String existPath = pathVo.getOutdataPath()+pathVo.getOutdataName();
		
		HashMap<String, Object> existInfo = new HashMap<String, Object>();
		existInfo.put("fileName", pathVo.getOutdataName());
		existInfo.put("target", pathVo.getTargetVal());
		existInfo.put("features", pathVo.getFeatures());
		
//		서버용
		File csvFile = new File(existPath);
    	InputStream inputStream = new FileInputStream(csvFile);
		
//    	로컬용
//		JSch jsch = new JSch();
//        Session session = null;
//        session = jsch.getSession(sftpUser, sftpHost, sftpPort);
//        session.setPassword(sftpPwd);
//        session.setConfig("StrictHostKeyChecking", "no");
//        session.connect();
//        Channel channel = session.openChannel("sftp");
//        channel.connect();
//        ChannelSftp sftpChannel = (ChannelSftp) channel;
//        InputStream inputStream = sftpChannel.get(existPath);
		

		 try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
	        	String line = reader.readLine();

	            // 첫 줄을 컬럼명으로 처리
	            String[] headers = line.split(",");
	            Map<String, List<String>> columns = new HashMap<>();
	            for (String header : headers) {
	                columns.put(header.trim(), new ArrayList<>());
	            }

	            // CSV 데이터 읽기
	            while ((line = reader.readLine()) != null) {
	                String[] values = line.split(",");
	                for (int i = 0; i < headers.length; i++) {
	                    String header = headers[i].trim();
	                    if (i < values.length) {
	                        columns.get(header).add(values[i].trim());
	                    } else {
	                        columns.get(header).add("");  // 값이 없는 경우 빈 문자열 추가
	                    }
	                }
	            }
	            // 컬럼별 통계 계산
	            for (String header : headers) {
	                List<String> values = columns.get(header);
	                List<Double> numericValues = new ArrayList<>();
	                List<String> dateValues = new ArrayList<>();

	                // 타입별로 분류
	                for (String value : values) {
	                    if (value.isEmpty()) {
	                    	continue;  // 결측값 처리
	                    }
	                    if (TextEdit.isNumeric(value)) {
	                        numericValues.add(Double.parseDouble(value));
	                    } else if ((header.toLowerCase()).equals("date")) {
	                        dateValues.add(TextEdit.convertFormat(value));
	                    } else {
	                    	if(header.toLowerCase().equals("date")) {
//	                    		System.out.println("else : " + value);
	                    	}
	                    }
	                }

	                HashMap<String, Object> columnStats = new HashMap<>();
	                if (!numericValues.isEmpty()) {
	                    columnStats.putAll(TextEdit.calculateNumericStatistics(numericValues));
	                } else if (!dateValues.isEmpty()) {
	                    columnStats.putAll(TextEdit.calculateDateStatistics(dateValues));
	                } else {
	                	columnStats.put("min", "-");
	                    columnStats.put("max", "-");
	                    columnStats.put("uniqueCnt", "-");
	                    columnStats.put("duplicateCnt", "-");
	                    columnStats.put("missingCnt", "-");
	                    columnStats.put("mean", "-");
	                    columnStats.put("meanDeviation", "-");
	                    columnStats.put("valueType", "String");
	                    columnStats.put("message", "문자열 컬럼 - 통계 생략");
	                }
	                columnStats.put("columnName", header);
	                resultList.add(columnStats);
	            }
	        } catch (IOException e) {
	            e.printStackTrace();
	        } finally {
//	        	로컬용
//	            if (session != null && session.isConnected()) {
//	                session.disconnect();
//	            }
//	            if (sftpChannel != null && sftpChannel.isConnected()) {
//	            	sftpChannel.disconnect();
//	            }
//	        	로컬용(여기까지)
	            if (inputStream != null) {
	            	inputStream.close();
	            }
	        }
		resultMap.put("dataList", resultList);
		resultMap.put("existInfo", existInfo);
		return resultMap;
	}
	
	/**
	 * @description 목표변수 외의 변수들과의 상관관계를 계산하는 함수
	 * @param hm
	 * @return
	 */
	public List<HashMap<String, Object>> requestFeatureTargetCorr(HashMap hm){
		List<HashMap<String, Object>> resultList = new ArrayList();
        
		List<String> features = (List<String>) hm.get("selectedVariables");
		String target = TextEdit.trim(hm.get("target"));
		String fileName = TextEdit.trim(hm.get("fileName"));
		String query = TextEdit.trim(hm.get("query"));
		String orgPath = uploadPath;
		String targetPath = filesPath;	//변경 확인 필
		String containerNm = kendallCtnr;
		String volumePath = filesPath;
		//서버용 (필요없음)
//		TextEdit.copyFile(volumePath, fileName, volumePath);
		//로컬용
//		TextEdit.RemoteCpCommand(orgPath+fileName, targetPath+formattedDate+"/"+fileName, containerNm, sftpHost, sftpPort, sftpUser, sftpPwd, uploadPath);
		
		try {
			String urlString = "http://"+sftpHost+":"+kendallPort+"/"+kendallUrl;
	        URL url = new URL(urlString);
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

	        // POST 요청 설정
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/json");
	        conn.setDoOutput(true);

	        // JSON 객체 생성
	        JSONObject jsonData = new JSONObject();
	        jsonData.put("features", features);
	        jsonData.put("target", target);
	        jsonData.put("file_name", fileName);
	        jsonData.put("file_path", volumePath);
	        jsonData.put("query", query);
			jsonData.put("dbDns", dbDns);
			jsonData.put("dbUser", dbUser);
			jsonData.put("dbPwd", dbPwd);

	        // 데이터 전송
	        try (OutputStream os = conn.getOutputStream()) {
	            byte[] input = jsonData.toString().getBytes("utf-8");
	            os.write(input, 0, input.length);
	        }

	        // 응답 코드 확인
	        int responseCode = conn.getResponseCode();
//	        System.out.println("Response Code: " + responseCode);
	        
	        // 응답 내용 출력
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
	            response = response.replace("NaN", "null");
//	            System.out.println("Response: " + response);
	        }
	        
	        ObjectMapper objectMapper = new ObjectMapper();
	        JsonNode rootNode = objectMapper.readTree(response);
	        
	        rootNode.fieldNames().forEachRemaining(fieldName -> {
                HashMap<String, Object> map = new HashMap<>();
                map.put(fieldName, rootNode.get(fieldName).asDouble());
                resultList.add(map);
            });
		}catch(Exception e) {
			e.printStackTrace();
		}
		return resultList;
	}
	
	/**
	 * @description automl 학습 처리
	 * @param hm
	 * @return
	 * @throws IOException 
	 */
	public HashMap<String, Object> requestFeatureTrain(HashMap hm) throws IOException{
		HashMap<String,Object> resultMap = new HashMap<String,Object>();
		List<HashMap<String, Object>> resultList = new ArrayList<HashMap<String, Object>>();
		
		String orgPath = uploadPath;
		String targetPath = filesPath;	//변경 확인 필요
		String containerNm = regressionCntr;
		List<String> features = (List<String>) hm.get("selectedFiltering");
		String target = TextEdit.trim(hm.get("target"));
		String query = TextEdit.trim(hm.get("query"));
		String volumePath = volPath;
		String fileName = TextEdit.trim(hm.get("fileName"));
		String evalRatio = TextEdit.trim(hm.get("evalRatio"));
		String algorithmType = TextEdit.trim(hm.get("algorithmType"));
		String algorithmVal = TextEdit.trim(hm.get("algorithmVal"));
		HashMap<String,Object> params = (HashMap<String, Object>) hm.get("params");
		String reTrain = TextEdit.trim(hm.get("reTrain"));
		String reTrainDataChk = TextEdit.trim(hm.get("reTrainDataChk"));
		String modelId = TextEdit.trim(hm.get("modelId"));
		String existData = "";
		if(modelId.length()==0) {	//신규 학습
			modelId = modelMapper.latestModelId();
		}
//		System.out.println("algorithmType : " + algorithmType);
		String trainType = "";
		if(algorithmType.equals("cluster")) {
			trainType = clusterTrain;
		} else if(algorithmType.equals("regression")) {
			trainType = regressionTrain;
		}
		if(reTrainDataChk.equals("1")) {
			ModelVO vo = new ModelVO();
			vo.setModelId(modelId);
			vo = modelMapper.selectExistDataPath(vo);
			existData = vo.getOutdataPath() + vo.getOutdataName();
		}
		//서버용 (필요없음)
//		TextEdit.copyFile(targetPath, fileName, targetPath);
		//로컬용
//		TextEdit.RemoteCpCommand(orgPath+fileName, targetPath+formattedDate+"/"+fileName, containerNm, sftpHost, sftpPort, sftpUser, sftpPwd, uploadPath);
		
		try {
			String urlString = "http://"+sftpHost+":"+regressionPort+"/"+trainType;

			URL url = new URL(urlString);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			
			// POST 요청 설정
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json");
			conn.setDoOutput(true);
			
			// JSON 객체 생성
			JSONObject jsonData = new JSONObject();
			jsonData.put("features", features);
			jsonData.put("target", target);
			jsonData.put("volumePath", volumePath);
			jsonData.put("file_name", fileName);
			jsonData.put("ratio", evalRatio);
			jsonData.put("modelId", modelId);
			jsonData.put("reTrain", reTrain);
			jsonData.put("reTrainDataChk", reTrainDataChk);
			jsonData.put("existData", existData);
			jsonData.put("algorithmVal", algorithmVal);
			jsonData.put("params", params);
			jsonData.put("dbDns", dbDns);
			jsonData.put("dbUser", dbUser);
			jsonData.put("dbPwd", dbPwd);
			jsonData.put("query", query);

			// 데이터 전송
			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = jsonData.toString().getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			
			// 응답 코드 확인
			int responseCode = conn.getResponseCode();
//			System.out.println("Response Code: " + responseCode);
			
			// 응답 내용 출력
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
//				System.out.println("Response: " + response);
			}
			
			ObjectMapper objectMapper = new ObjectMapper();
			
			try {
				JSONObject jsonResponse = new JSONObject(response);
				HashMap<String,Object> jsonMap = new HashMap<String,Object>();
				jsonMap.put("jsonResponse", jsonResponse.toString());
				resultList.add(jsonMap);
				// 결과 출력
			} catch (Exception e) {
				e.printStackTrace();
			}
	        
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		//서버용
		HashMap<String,Object> socres = TextEdit.FileToHashMap(scorePath+"/result.txt");
//		로컬용
//		TextEdit.ReverseCpCommand(orgPath+fileName, targetPath+fileName, containerNm, sftpHost, sftpPort, sftpUser, sftpPwd, uploadPath);
//        TextEdit.ReverseCpCommand(uploadPath,scorePath+"/result.txt",regressionCntr,sftpHost,sftpPort,sftpUser,sftpPwd,uploadPath);
//        HashMap<String,Object> socres = TextEdit.FileToHashMap("C:\\irskorea\\workspace\\workspace_ftc\\iQratorPlus\\src\\main\\webapp\\WEB-INF\\result.txt");
//		로컬용(여기까지)
		
		resultMap.put("chartList", resultList);
		resultMap.put("scoreMap", socres);
        
		return resultMap;
	}
	
	public String insertModelInfo(HashMap<String, Object> hm) {
		try {
			ModelVO vo = new ModelVO();
			//서버용
			HashMap<String,Object> scores = TextEdit.FileToHashMap(scorePath+"/result.txt");
			//로컬용
//			HashMap<String,Object> scores = TextEdit.FileToHashMap("C:\\irskorea\\workspace\\workspace_ftc\\iQratorPlus\\src\\main\\webapp\\WEB-INF\\result.txt");
			
			vo.setModelId((String) scores.get("model_id"));
			vo.setModelOrgName((String) scores.get("model_name"));
			vo.setModelViewName(TextEdit.trim(hm.get("modelViewName")));
			vo.setModelPath((String) scores.get("model_path"));
			vo.setModelTypes((String) scores.get("model_type"));
			vo.setAlgorithmType((String) scores.get("algorithm"));
			vo.setValidRatio((String) scores.get("ratio"));
			vo.setDataType((String) scores.get("data_type"));
			vo.setTargetVal((String) scores.get("target_column"));
			vo.setFirstTrainDate((String) scores.get("train_date"));
			vo.setDatetime((String) scores.get("train_date"));
			vo.setTrainDataPath((String) scores.get("train_data_path"));
			vo.setTrainDataFile((String) scores.get("data_name"));
			vo.setMse((String) scores.get("mse"));
			vo.setRmse((String) scores.get("rmse"));
			vo.setMape((String) scores.get("mape"));
			String r2 = "";
			try {
				float r2Max = Math.max(Float.parseFloat((String)scores.get("train_score")), Float.parseFloat((String)scores.get("test_score")));
				float r2Min = Math.min(Float.parseFloat((String)scores.get("train_score")), Float.parseFloat((String)scores.get("test_score")));
				if(r2Max>1.0f) {
					r2 = String.valueOf(r2Min);
				}else {
					r2 = String.valueOf(r2Max);
				}
			} catch(Exception e) {
				r2 = "";
			}
			vo.setR2(r2);
			vo.setAlParam1((String) scores.get("param1"));
			vo.setAlParam2((String) scores.get("param2"));
			vo.setAlParam3((String) scores.get("param3"));
			vo.setFeatures((String) scores.get("features"));
			vo.setDockerHost(sftpHost);
			vo.setDockerPort(String.valueOf(regressionPort));
			vo.setDockerUrl("predict-"+scores.get("model_type"));
			String season = "";
			if(TextEdit.trim(hm.get("season"))==null || TextEdit.trim(hm.get("season")).equals("")) {
				try {
					season = modelMapper.selectViewAndDetailList(vo).getSeason();
					System.out.println("season : " + season);
				}catch(Exception e) {
					season = "";
				}
			}else {
				season = TextEdit.trim(hm.get("season"));
				System.out.println("sea222son : " + season);
			}
			
			vo.setSeason(season);
//			System.out.println("@@@@@@@@ : " + vo);
			
			int count = modelMapper.checkModelIdDuplicate(vo);
			if(!(count>0)) {
				modelMapper.insertModelView(vo);
			}else {
				modelMapper.updateTrainCnt(vo);
			}
			// 같은 MODEL_ID를 가진 다른 상세 모델의 MODEL_STATE를 'S'로 update
			modelMapper.updateModelDetails(vo);
			modelMapper.insertModelDetails(vo);
		}catch (Exception e) {
			e.printStackTrace();
			return "실패";
		}
		return "성공";
	}
	
	public List<HashMap<String,Object>> requestPredict(HashMap<String, Object> hm) throws JsonProcessingException{
		List<HashMap<String,Object>> resultList = new ArrayList<HashMap<String,Object>>();
		String period = TextEdit.trim(hm.get("period"));
		String algorithmType = TextEdit.trim(hm.get("algorithmType")); //알고리즘 유형 대분류, ex)cluster OR regression
		String volumePath = volPath;
		
		ModelVO vo = new ModelVO();
		vo.setModelId(TextEdit.trim(hm.get("id")));
		ModelVO resultVO = modelMapper.selectViewAndDetailList(vo);
		String algorithmVal = resultVO.getAlgorithmType(); //알고리즘 유형 세부 분류, ex)lof, dbsacn...
		String modelOrgName = resultVO.getModelOrgName();
		String target = resultVO.getTargetVal();
		String modelPath = resultVO.getModelPath();
		String csvPath = resultVO.getOutdataPath();
		String csvFile = resultVO.getOutdataName();
        String tmpFeatureColumns = resultVO.getFeatures();
        String param1 = resultVO.getAlParam1();
        String param2 = resultVO.getAlParam2();
        String param3 = resultVO.getAlParam3();
        String ratio = resultVO.getValidRatio();
        String season = resultVO.getSeason();
        HashMap<String,Object> params = new HashMap<String,Object>();
        if(param1!=null&&!param1.equals("")) {
        	params.put(param1.split("@@")[0],param1.split("@@")[1]);
        }
        if(param2!=null&&!param2.equals("")) {
        	params.put(param2.split("@@")[0],param2.split("@@")[1]);
        }
        if(param3!=null&&!param3.equals("")) {
        	params.put(param3.split("@@")[0],param3.split("@@")[1]);
        }
        
        Map<String, Object> newData = new HashMap<String, Object>();
        String outlierVal = "";
        
        List<String> featureColumns = new ArrayList<String>();
        if(tmpFeatureColumns!=null&&!(tmpFeatureColumns.equals(""))) {
        	featureColumns = Arrays.asList(tmpFeatureColumns.split(","));
        }
		JSONArray jsonArray = new JSONArray(featureColumns);
        
		String predictType = "";
		if(algorithmType.equals("cluster")) {
			predictType = clusterPredict;
			newData = (Map<String, Object>) hm.get("outlierVal");
//			System.out.println("newData : "+  newData);
	        ObjectMapper objectMapper = new ObjectMapper();
	        outlierVal = objectMapper.writeValueAsString(newData);
			
		} else if(algorithmType.equals("regression")) {
			predictType = regressionPredict;
		}
		
		try {
			String urlString = "http://"+sftpHost+":"+regressionPort+"/"+predictType;
	        URL url = new URL(urlString);
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

	        // POST 요청 설정
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/json");
	        conn.setDoOutput(true);

	        // JSON 객체 생성
	        JSONObject jsonData = new JSONObject();
	        jsonData.put("algorithmVal", algorithmVal);
	        jsonData.put("ratio", ratio);
	        jsonData.put("period", period);
//	        jsonData.put("end_date", end_date);
	        jsonData.put("model_path", modelPath);
	        jsonData.put("model_org_name", modelOrgName);
	        jsonData.put("volumePath", volumePath);
	        jsonData.put("csv_path", csvPath);
	        jsonData.put("csv_file", csvFile);
	        jsonData.put("target", target);
	        jsonData.put("features_columns", jsonArray);
	        jsonData.put("outlierVal", outlierVal);
	        jsonData.put("params", params);
	        jsonData.put("season", season);

	        // 데이터 전송
	        try (OutputStream os = conn.getOutputStream()) {
	            byte[] input = jsonData.toString().getBytes("utf-8");
	            os.write(input, 0, input.length);
	        }

	        // 응답 코드 확인
//	        int responseCode = conn.getResponseCode();
//	        System.out.println("Response Code: " + responseCode);
	        
	        // 응답 내용 출력
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
//	            System.out.println("Response: " + response);
	        }
	        
	        try {
				JSONObject jsonResponse = new JSONObject(response);
				HashMap<String,Object> jsonMap = new HashMap<String,Object>();
				jsonMap.put("jsonResponse", jsonResponse.toString());
				resultList.add(jsonMap);
	            // 결과 출력
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
		}catch(Exception e) {
			e.printStackTrace();
		}
		return resultList;
	}
	
	public List<HashMap<String,Object>> requestCsvData(HashMap<String, Object> hm){
		
		ModelVO vo = new ModelVO();
		vo.setModelId(TextEdit.trim(hm.get("id")));
		ModelVO resultVO = modelMapper.selectViewAndDetailList(vo);
		
		String period =TextEdit.trim(hm.get("period"));
		String csvPath = resultVO.getOutdataPath();
		String csvFilePath = resultVO.getOutdataName();
        String target = resultVO.getTargetVal();
        String tmpFeatureColumns = resultVO.getFeatures();
        List<String> featureColumns = new ArrayList<String>();
        if(tmpFeatureColumns!=null&&!(tmpFeatureColumns.equals(""))) {
        	featureColumns = Arrays.asList(tmpFeatureColumns.split(","));
        }
        
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        try {
        	//서버용
        	File csvFile = new File(csvPath+csvFilePath);
        	InputStream inputStream = new FileInputStream(csvFile);
        	//로컬용
//        	JSch jsch = new JSch();
//        	Session session = jsch.getSession(sftpUser, sftpHost, sftpPort);
//        	session.setPassword(sftpPwd);
//        	session.setConfig("StrictHostKeyChecking", "no");
//        	session.connect();
//        	Channel channel = session.openChannel("sftp");
//        	ChannelSftp sftpChannel = (ChannelSftp) channel;
//        	sftpChannel.connect();
//        	System.out.println("asdasd : " + uploadPath+"alphabet_stock_data.csv");
////        	InputStream inputStream = sftpChannel.get(csvFilePath);
//        	InputStream inputStream = sftpChannel.get(uploadPath+"alphabet_stock_data.csv");
        	//로컬용(여기까지)
        	
            // CSV 파일 읽기
            CSVParser parser = CSVParser.parse(inputStream, StandardCharsets.UTF_8, CSVFormat.DEFAULT.withHeader());
            for (CSVRecord record : parser) {
            	HashMap<String, Object> rowData = new HashMap<>();
                // 날짜 컬럼 처리
                String date = record.get("Date"); // 'Date' 컬럼 이름은 파일에 맞게 수정
                rowData.put("Date", date);
                rowData.put("target", record.get(target));
                HashMap<String,Object> featuresMap = new HashMap<String,Object>();
                List<HashMap<String,Object>> featuresList = new ArrayList<HashMap<String,Object>>();
                for (String column : featureColumns) {
                	featuresMap.put(column, record.get(column));
                }
                featuresList.add(featuresMap);
                rowData.put("features", featuresList);

                resultList.add(rowData);
            }
        } catch (Exception e) {
        	System.out.println("requestCsvData Err : "+ e);
        }

        return resultList;
	}
	
	/**
	 * @description service
	 * @return List<HashMap<String,Object>> resultList
	 */
	public List<ModelVO> requestReTrainList(){
		List<ModelVO> resultList = new ArrayList<ModelVO>();
		
		resultList = modelMapper.reTrainList();
//		System.out.println("resultList : " + resultList);
		
		return resultList;
	}
}




