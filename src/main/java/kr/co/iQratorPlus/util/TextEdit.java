package kr.co.iQratorPlus.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

public class TextEdit {
	
	private static final Logger logger = LogManager.getLogger(TextEdit.class);
	
	
//	public static void main(String[] args) {
//        try {
//            // 사용자가 선택한 컬럼과 target column 지정
//            List<String> selectedColumns = Arrays.asList("Open", "Adj_Close"); // 사용자가 선택한 컬럼
//            String targetColumn = "Adj_Close"; // target column
//            proceedFilter("C:\\Temp\\file\\temp_input.csv", "C:\\Temp\\file\\temp_input2.csv", selectedColumns, targetColumn);
//            System.out.println("CSV 처리 완료.");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
	
	
	/**
     * 서버 파일을 로컬 경로로 복사하는 함수
     *
     * @param serverFilePath 서버상의 파일 경로 (예: /home/itrinity/store/result.txt)
     * @param localFilePath  로컬 파일 경로 (예: C:\\irskorea\\workspace\\...)
     * @return 파일 복사 성공 여부
     */
    public static boolean serverToHostFile(String serverFilePath, String localFilePath) {
        Path sourcePath = Paths.get(serverFilePath);
        Path destinationPath = Paths.get(localFilePath);

        try {
            // 파일 복사 (기존 파일 덮어쓰기 옵션 포함)
            Files.copy(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("파일 복사가 완료되었습니다.");
            return true;
        } catch (IOException e) {
            // 예외 처리
            System.err.println("파일 복사 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
	
	private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#.##");
	
	public static boolean isNumeric(String value) {
        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
	
	public static boolean isValidDate(String dateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false); // 엄격한 날짜 유효성 검사
        try {
            // 날짜 형식에 맞게 파싱 시도
            sdf.parse(dateStr);
            return true; // 파싱 성공, 올바른 날짜 형식
        } catch (ParseException e) {
            return false; // 파싱 실패, 잘못된 날짜 형식
        }
    }
    
	public static Map<String, Object> calculateNumericStatistics(List<Double> values) {
        Map<String, Object> stats = new HashMap<>();
        double min = values.stream().min(Double::compare).orElse(Double.NaN);
        double max = values.stream().max(Double::compare).orElse(Double.NaN);
        long uniqueCount = values.stream().distinct().count();
        long duplicateCount = values.size() - uniqueCount;
        long missingCount = values.size() - values.stream().filter(Objects::nonNull).count();
        double mean = values.stream().mapToDouble(Double::doubleValue).average().orElse(Double.NaN);
        double meanDeviation = values.stream().mapToDouble(val -> Math.abs(val - mean)).average().orElse(Double.NaN);

        stats.put("min", DECIMAL_FORMAT.format(min));
        stats.put("max", DECIMAL_FORMAT.format(max));
        stats.put("uniqueCnt", uniqueCount);
        stats.put("duplicateCnt", duplicateCount);
        stats.put("missingCnt", missingCount);
        stats.put("mean", DECIMAL_FORMAT.format(mean));
        stats.put("meanDeviation", DECIMAL_FORMAT.format(meanDeviation));
        stats.put("valueType", "NUM");
        
        return stats;
    }

//	public static Map<String, Object> calculateDateStatistics(List<String> values) {
//		System.out.println("values: " +values);
//        Map<String, Object> stats = new HashMap<>();
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // 날짜 형식에 맞게 조정
//        
//        // String -> LocalDateTime 변환
//        List<LocalDateTime> dateTimes = values.stream()
//                                              .map(value -> {
//                                                  try {
//                                                      return LocalDateTime.parse(value, formatter);
//                                                  } catch (Exception e) {
//                                                      return null; // 변환 실패 시 null 처리
//                                                  }
//                                              })
//                                              .filter(Objects::nonNull) // null 제외
//                                              .collect(Collectors.toList());
//
//        // 최소값, 최대값 계산
//        LocalDateTime min = dateTimes.stream().min(LocalDateTime::compareTo).orElse(null);
//        LocalDateTime max = dateTimes.stream().max(LocalDateTime::compareTo).orElse(null);
//
//        // 유일값, 중복값, 결측값 계산
//        long uniqueCount = dateTimes.stream().distinct().count();
//        long duplicateCount = dateTimes.size() - uniqueCount;
//        long missingCount = values.size() - dateTimes.size();
//
//        stats.put("Min", min != null ? min.format(formatter) : null);
//        stats.put("Max", max != null ? max.format(formatter) : null);
//        stats.put("UniqueCnt", uniqueCount);
//        stats.put("DuplicateCnt", duplicateCount);
//        stats.put("MissingCnt", missingCount);
//        stats.put("Mean", "-");
//        stats.put("MeanDeviation", "-");
//        stats.put("ValueType", "DATE");
//        
//        return stats;
//    }
	public static Map<String, Object> calculateDateStatistics(List<String> values) {
        Map<String, Object> stats = new HashMap<>();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // List<String>을 List<LocalDateTime>으로 변환
        List<LocalDateTime> dateList = values.stream()
                .map(date -> LocalDateTime.parse(date + "T00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")))
                .collect(Collectors.toList());
        
        LocalDateTime min = dateList.stream().min(LocalDateTime::compareTo).orElse(null);
        LocalDateTime max = dateList.stream().max(LocalDateTime::compareTo).orElse(null);
        long uniqueCount = dateList.stream().distinct().count();
        long duplicateCount = dateList.size() - uniqueCount;
        long missingCount = dateList.size() - dateList.stream().filter(Objects::nonNull).count();

        stats.put("min", min);
        stats.put("max", max);
        stats.put("uniqueCnt", uniqueCount);
        stats.put("duplicateCnt", duplicateCount);
        stats.put("missingCnt", missingCount);
        stats.put("mean", "-");
        stats.put("meanDeviation", "-");
        stats.put("valueType", "DATE");
        return stats;
    }
	
//	public static Map<String, Object> calculateDateStatistics(List<LocalDateTime> values) {
//        Map<String, Object> stats = new HashMap<>();
//        LocalDateTime min = values.stream().min(LocalDateTime::compareTo).orElse(null);
//        LocalDateTime max = values.stream().max(LocalDateTime::compareTo).orElse(null);
//        long uniqueCount = values.stream().distinct().count();
//        long duplicateCount = values.size() - uniqueCount;
//        long missingCount = values.size() - values.stream().filter(Objects::nonNull).count();
//
//        stats.put("Min", min);
//        stats.put("Max", max);
//        stats.put("UniqueCnt", uniqueCount);
//        stats.put("DuplicateCnt", duplicateCount);
//        stats.put("MissingCnt", missingCount);
//        stats.put("Mean", "-");
//        stats.put("MeanDeviation", "-");
//        stats.put("ValueType", "DATE");
//        return stats;
//    }
	
	public static String convertFormat(String key) {
		
		List<DateTimeFormatter> dateFormatters = new ArrayList<>();
		List<DateTimeFormatter> dateTimeFormatters = new ArrayList<>();
        
		
		dateFormatters.add(DateTimeFormatter.ofPattern("yy-M-d"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yy-M-dd"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yy-MM-d"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yy-MM-dd"));
		
		dateFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-d"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-d"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-dd"));
		dateFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm"));
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-d H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-d H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-d HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-d HH:mm:ss"));
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-dd H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-dd H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-dd HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-M-dd HH:mm:ss"));
        
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-d H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-d H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-d HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-d HH:mm:ss"));
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-dd H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-dd H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm:ss"));
        
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-d H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-d H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-d HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-d HH:mm:ss"));
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-dd H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-dd H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-dd HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-M-dd HH:mm:ss"));
        
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-d H:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-d H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-d HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-d HH:mm:ss"));
        
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd H:mm:ss"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        dateTimeFormatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        for (DateTimeFormatter formatter : dateTimeFormatters) {
            try {
                // 각각의 포맷으로 파싱 시도
                LocalDateTime date = LocalDateTime.parse(key, formatter);
                String dateTimeStr = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                return dateTimeStr;
            } catch (DateTimeParseException e) {
//            	System.out.println("데이트 타임 형식 아님:"+e);
            }
        }
        
        for (DateTimeFormatter formatter2 : dateFormatters) {
        	try {
        		LocalDate date = LocalDate.parse(key, formatter2);
        		String dateTimeStr = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        		return dateTimeStr;
        		
        	} catch (DateTimeParseException ignored) {
//        		System.out.println("데이트 형식 아님:"+ignored);
        	}
        }
        
        return null;
	}
	
	//서버용
	public static void processCSV(String inputFilePath, String outputFilePath) {
		System.out.println("inputFilePath : " + inputFilePath);
		System.out.println("outputFilePath : " + outputFilePath);
        try (
                Reader reader = new FileReader(inputFilePath);
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader());
                BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath));
                CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(csvParser.getHeaderMap().keySet().toArray(new String[0])))
            ) {
                // 헤더를 추출
                List<String[]> allData = new ArrayList<>();

                // 첫 번째 행(헤더)을 포함하여 처리
                for (CSVRecord record : csvParser) {
                    String[] updatedLine = new String[record.size()];

                    // 날짜 컬럼 인덱스 찾기 (Date 또는 DateTime)
                    String originalDate = null;
                    int dateColumnIndex = -1;

                    for (int i = 0; i < record.size(); i++) {
                        String columnName = csvParser.getHeaderMap().keySet().toArray(new String[0])[i];
                        updatedLine[i] = record.get(i); // 각 셀 값 업데이트

                        if ("Date".equalsIgnoreCase(columnName) || "DateTime".equalsIgnoreCase(columnName)) {
                            dateColumnIndex = i;
                            originalDate = record.get(i);
                        }
                    }

                    // 날짜 변환
                    if (originalDate != null && !originalDate.trim().isEmpty()) {
                        String convertedDate = convertFormat(originalDate);

                        if (convertedDate != null && dateColumnIndex != -1) {
                            updatedLine[dateColumnIndex] = convertedDate;
                        }
                    }

                    allData.add(updatedLine);
                }

                // 변환된 데이터를 새 CSV 파일로 저장
                for (String[] data : allData) {
                    csvPrinter.printRecord((Object[]) data);
                }

                csvPrinter.flush();
            } catch (IOException e) {
            	System.out.println("processCSV Err : ");
                e.printStackTrace();
            }
        }
	
	public static void copyFile(String orgPath, String fileName, String targetPath) {
		try {
			File file = new File(orgPath+"/"+fileName);
			File newFile = new File(targetPath+"/"+fileName);
			
			Files.copy(file.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
			
			if(!file.exists()) {
				file.createNewFile();
				System.out.println("복사할 파일 존재함");
			}
			
			FileWriter writer = new FileWriter(file, true);
			writer.write("");
			writer.close();
			
		} catch (IOException e) {
			System.out.println("saveCsv Err:");
			e.printStackTrace();
		}
	}
	
	// SFTP 연결 및 파일 처리
	// 로컬용
    public static void processSFTP(String sftpHost, int sftpPort, String sftpUser, String sftpPassword, 
                                   String remoteFilePath, String remoteOutputPath) {
        ChannelSftp channelSftp = null;
        Session session = null;
        try {
            // SFTP 연결 설정
            JSch jsch = new JSch();
            session = jsch.getSession(sftpUser, sftpHost, sftpPort);
            session.setPassword(sftpPassword);

            Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.connect();

            channelSftp = (ChannelSftp) session.openChannel("sftp");
            channelSftp.connect();

            // SFTP에서 파일 다운로드
            File tempInputFile = File.createTempFile("input", ".csv");
            try (OutputStream outputStream = new FileOutputStream(tempInputFile)) {
                channelSftp.get(remoteFilePath, outputStream);
            }

            // 변환된 데이터를 저장할 임시 파일 생성
            File tempOutputFile = File.createTempFile("output", ".csv");

            // CSV 처리
            pcsCSV(tempInputFile, tempOutputFile);

            // 변환된 파일을 SFTP 서버에 업로드
            try (InputStream inputStream = new FileInputStream(tempOutputFile)) {
                channelSftp.put(inputStream, remoteOutputPath);
            }

            System.out.println("SFTP 파일 처리가 완료되었습니다: " + remoteOutputPath);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (channelSftp != null) {
                channelSftp.disconnect();
            }
            if (session != null) {
                session.disconnect();
            }
        }
    }
	
//    try (CSVReader reader = new CSVReader(new FileReader(inputFile));
//    		CSVWriter writer = new CSVWriter(new FileWriter(outputFile))) {
    public static void pcsCSV(File inputFile, File outputFile) throws IOException {
        try (
                Reader reader = new FileReader(inputFile);
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader());
                BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
                CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(csvParser.getHeaderMap().keySet().toArray(new String[0])))
            ) {
                // 헤더를 추출
                List<String[]> allData = new ArrayList<>();

                // 첫 번째 행(헤더)을 포함하여 처리
                for (CSVRecord record : csvParser) {
                    String[] updatedLine = new String[record.size()];

                    // 날짜 컬럼 인덱스 찾기 (Date 또는 DateTime)
                    String originalDate = null;
                    int dateColumnIndex = -1;

                    for (int i = 0; i < record.size(); i++) {
                        String columnName = csvParser.getHeaderMap().keySet().toArray(new String[0])[i];
                        updatedLine[i] = record.get(i); // 각 셀 값 업데이트

                        if ("Date".equalsIgnoreCase(columnName) || "DateTime".equalsIgnoreCase(columnName)) {
                            dateColumnIndex = i;
                            originalDate = record.get(i);
                        }
                    }

                    // 날짜 변환
                    if (originalDate != null && !originalDate.trim().isEmpty()) {
                        String convertedDate = convertFormat(originalDate);

                        if (convertedDate != null && dateColumnIndex != -1) {
                            updatedLine[dateColumnIndex] = convertedDate;
                        }
                    }

                    allData.add(updatedLine);
                }

                // 변환된 데이터를 새 CSV 파일로 저장
                for (String[] data : allData) {
                    csvPrinter.printRecord((Object[]) data);
                }

                csvPrinter.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    
	public static String RemoteCpCommand(String orgPath, String targetPath, String containerNm, String sftpHost, int sftpPort, String sftpUser, String sftpPwd, String uploadPath) {
		
		String host = sftpHost;
        int port = sftpPort;
        String user = sftpUser;
        String password = sftpPwd;
        String command = "docker cp "+orgPath+" "+containerNm+":"+targetPath;
        System.out.println("command : "+command);

        try {
            // JSch 객체 생성 및 세션 설정
            JSch jsch = new JSch();
            Session session = jsch.getSession(user, host, port);
            session.setPassword(password);

            // 보안 설정 무시 (테스트 용도)
            session.setConfig("StrictHostKeyChecking", "no");

            // 세션 연결
            session.connect();

            // 명령어 실행을 위한 채널 설정
            ChannelExec channelExec = (ChannelExec) session.openChannel("exec");
            channelExec.setCommand(command);

            // 명령어 출력 스트림 연결
            InputStream inputStream = channelExec.getInputStream();
            channelExec.connect();

            // 명령어 결과 출력
            byte[] tmp = new byte[1024];
            while (inputStream.read(tmp) != -1) {
                System.out.print(new String(tmp));
            }

            // 채널 및 세션 종료
            channelExec.disconnect();
            session.disconnect();

            System.out.println("원격 서버에서 cp 명령어가 실행되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
        }
		return "";
	}
	
	public static String ReverseCpCommand(String orgPath, String targetPath, String containerNm, String sftpHost, int sftpPort, String sftpUser, String sftpPwd, String uploadPath) {
		
		String host = sftpHost;
	    int port = sftpPort;
	    String user = sftpUser;
	    String password = sftpPwd;
	    String command = "docker cp "+containerNm+":"+targetPath+" "+orgPath;
	    System.out.println("command : "+command);
	
	    try {
	        // JSch 객체 생성 및 세션 설정
	        JSch jsch = new JSch();
	        Session session = jsch.getSession(user, host, port);
	        ChannelSftp channelSftp = null;

	        session.setPassword(password);
	
	        // 보안 설정 무시 (테스트 용도)
	        session.setConfig("StrictHostKeyChecking", "no");
	
	        // 세션 연결
	        session.connect();
	
	        // 명령어 실행을 위한 채널 설정
	        ChannelExec channelExec = (ChannelExec) session.openChannel("exec");
	        channelExec.setCommand(command);
	
	        // 명령어 출력 스트림 연결
	        InputStream inputStream = channelExec.getInputStream();
	        channelExec.connect();
	
	        // 명령어 결과 출력
	        byte[] tmp = new byte[1024];
	        while (inputStream.read(tmp) != -1) {
	            System.out.print(new String(tmp));
	        }
	        
	        channelSftp = (ChannelSftp) session.openChannel("sftp");
            channelSftp.connect();
	        
	        try (OutputStream outputStream = new FileOutputStream("C:\\irskorea\\workspace\\workspace_ftc\\iQratorPlus\\src\\main\\webapp\\WEB-INF\\result.txt")) {
                channelSftp.get("/home/itrinity/store/result.txt", outputStream);
            }
	
	        // 채널 및 세션 종료
	        channelExec.disconnect();
	        session.disconnect();
	
	        System.out.println("원격 서버에서 cp 명령어가 실행되었습니다.");
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
		return "";
	}

	public static void uploadServerDirect(@RequestParam("file") MultipartFile file, String filesPath) {
		
		try {
			String filePath = filesPath + "/" + file.getOriginalFilename();
			File dest = new File(filePath);
			file.transferTo(dest);
		} catch (Exception e) {
			System.out.println("uploadServerDirect Err : ");
			e.printStackTrace();
		}
	}
	
	public static String uploadFileToServer(@RequestParam("file") MultipartFile file, String sftpHost, int sftpPort, String sftpUser, String sftpPwd, String uploadPath) {
        if (file.isEmpty()) {
        	return "파일을 선택해주세요.";
        }

        // SFTP 서버 정보
        String host = sftpHost;
        int port = sftpPort;
        String user = sftpUser;
        String password = sftpPwd;
        String remoteDir = uploadPath;  // 서버의 저장 경로

        // JSch를 이용한 SFTP 전송
        JSch jsch = new JSch();
        Session session = null;
        ChannelSftp channelSftp = null;
        
        String returnMessage = "";

        try {
            // SFTP 세션 생성 및 연결
            session = jsch.getSession(user, host, port);
            session.setPassword(password);

            // 세션 설정 및 연결
            Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.connect();

            // SFTP 채널 열기
            channelSftp = (ChannelSftp) session.openChannel("sftp");
            channelSftp.connect();

            // 파일 전송
            try (InputStream inputStream = file.getInputStream()) {
                channelSftp.cd(remoteDir);  // 서버 디렉토리로 이동
                channelSftp.put(inputStream, file.getOriginalFilename());  // 파일 전송
                returnMessage = "파일 업로드 성공: " + file.getOriginalFilename();
            }
        } catch (Exception e) {
            e.printStackTrace();
            returnMessage = "파일 업로드 실패: " + e.getMessage();
        } finally {
            // SFTP 채널 및 세션 종료
            if (channelSftp != null) {
                channelSftp.disconnect();
            }
            if (session != null) {
                session.disconnect();
            }
        }

        return remoteDir;
    }
	
//	RemoteCpCommand
	
	//로컬용
	public static void filterCsvColumns(String sftpHost, int sftpPort, String sftpUser, String sftpPwd,
		            String inputFile, String outputFile, List<String> selectedColumns, String targetColumn) throws Exception {
		// SFTP 연결 설정
		JSch jsch = new JSch();
		Session session = jsch.getSession(sftpUser, sftpHost, sftpPort);
		session.setPassword(sftpPwd);
		
		// SFTP 설정
		session.setConfig("StrictHostKeyChecking", "no");
		session.connect();
		
		Channel channel = session.openChannel("sftp");
		ChannelSftp sftpChannel = (ChannelSftp) channel;
		sftpChannel.connect();
		
		// 로컬 임시 파일 경로
		String localInputFile = "C:\\Temp\\file\\temp_input.csv";
		String localOutputFile = "C:\\Temp\\file\\temp_output.csv";
		
		try {
			// SFTP로 원격 파일 다운로드
			sftpChannel.get(inputFile, localInputFile);
			
			// 기존 CSV 처리 코드
			proceedFilter(localInputFile, localOutputFile, selectedColumns, targetColumn);
			
			// SFTP로 결과 파일 업로드
			sftpChannel.put(localOutputFile, outputFile);
		
		} finally {
			// 리소스 정리
			sftpChannel.disconnect();
			session.disconnect();
			
			// 로컬 임시 파일 삭제
			new File(localInputFile).delete();
			new File(localOutputFile).delete();
		}
	}
	
	public static void proceedFilter(String inputFile, String outputFile, List<String> selectedColumns, String targetColumn) throws IOException {
        // CSV 파일 읽기
        try (CSVReader reader = new CSVReader(new FileReader(inputFile))) {
            List<String[]> allRows = reader.readAll();
            
            // 첫 번째 행 (헤더) 가져오기
            String[] header = allRows.get(0);
            
            // 선택된 컬럼만 남기기
            List<Integer> selectedIndexes = new ArrayList<>();
            for (String col : selectedColumns) {
                for (int i = 0; i < header.length; i++) {
                    if (header[i].equalsIgnoreCase(col)) {
                        selectedIndexes.add(i);
                        break;
                    }
                }
            }

            // target column의 위치를 찾아서 첫 번째 컬럼으로 설정
            List<String[]> newRows = new ArrayList<>();
            String[] newHeader = new String[selectedColumns.size()];
            
            // target column을 첫 번째로 위치시킴
            newHeader[0] = targetColumn; 
            int targetIndex = Arrays.asList(header).indexOf(targetColumn);
            int idx = 1;
            
            // 나머지 선택된 컬럼은 target column 이후에 배치
            for (String col : selectedColumns) {
                if (!col.equals(targetColumn)) {
                    newHeader[idx++] = col;
                }
            }
            newRows.add(newHeader);
            
            // 데이터 행 처리
            for (int i = 1; i < allRows.size(); i++) {
                String[] originalRow = allRows.get(i);
                String[] newRow = new String[selectedColumns.size()];
                
                // target column을 첫 번째로 위치시킴
                newRow[0] = originalRow[targetIndex];
                
                // 나머지 선택된 컬럼 배치
                idx = 1;
                for (String col : selectedColumns) {
                    if (!col.equals(targetColumn)) {
                        int columnIndex = Arrays.asList(header).indexOf(col);
                        newRow[idx++] = originalRow[columnIndex];
                    }
                }
                
                newRows.add(newRow);
            }
            
            // 새로운 CSV 파일로 출력
            try (CSVWriter writer = new CSVWriter(new FileWriter(outputFile))) {
                writer.writeAll(newRows);
            }
        }
    }
	
	public static HashMap<String, Object> FileToHashMap(String filePath) {
        // HashMap을 선언
		HashMap<String, Object> metrics = new HashMap<>();
        
        // 파일 경로 지정
//        String filePath = "metrics.txt"; // 예시 파일 경로
        
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            
            // 파일에서 한 줄씩 읽어들여 처리
            while ((line = br.readLine()) != null) {
                // 라인이 비어있지 않으면 ':'로 분리하여 key와 value 추출
                if (!line.trim().isEmpty()) {
//                    String[] parts = line.split(":");
                    String[] parts = line.split(":", 2);
                    if (parts.length == 2) {
                        // key와 value를 trim하고 HashMap에 넣음
                        String key = parts[0].trim();
                        String value =parts[1].trim();
                        metrics.put(key, value);
                    }
                }
            }
            
            // HashMap 내용 출력
            System.out.println("Metrics HashMap: " + metrics);
        } catch (IOException e) {
            e.printStackTrace();
            return metrics;
        }
        return metrics;
    }
	
	public static HashMap mapToString(String str) {
		HashMap<String, String> map = new HashMap<String, String>();

		try {
			ObjectMapper mapper = new ObjectMapper();
			map = (HashMap<String, String>) mapper.readValue(str, Map.class);
		} catch (IOException e) {
			logger.error("mapToString  -> IOException = " +  e.toString());
		}catch (Exception e) {
			logger.error("Socket mapToString = " +  e.toString());
		}

		return map;

	}
	
	public static Date getDate(String pattern, int addDay) throws Exception {

		if (pattern.equals("")) {
			pattern = "yyyyMMdd";
		}
		String nowDate;
		SimpleDateFormat formatter = new SimpleDateFormat(pattern, new Locale(
				"ko", "KOREA"));
		java.util.Date date = new java.util.Date();
		nowDate = formatter.format(date);

		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(formatter.parse(nowDate));
		} catch( ParseException e ) {
			System.out.println("date parse fail ..");
		} catch (Exception e) {
			throw new Exception();
		}
		calendar.add(Calendar.DATE, addDay);

		return calendar.getTime();

	}

	/*
	 * 작성자/작성일: 인자:패턴 내용:해당패턴으로 연산일만큼 연산한 String형 날짜값
	 */
	public static String getdate(String pattern) throws Exception {
		return getdate(pattern, 0);
	}

	/*
	 * 작성자/작성일: 인자:패턴,연산일(-1,0,1...) 내용:해당패턴으로 연산일만큼 연산한 String형 날짜값
	 */
	public static String getdate(String pattern, int addDay) throws NullPointerException, ParseException {

		if (pattern.equals("")) {
			pattern = "yyyyMMdd";
		}

		String nowDate;
		SimpleDateFormat formatter = new SimpleDateFormat(pattern, new Locale(
				"ko", "KOREA"));
		java.util.Date date = new java.util.Date();
		nowDate = formatter.format(date);

		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(formatter.parse(nowDate));
		} catch (NullPointerException e) {
			throw new NullPointerException();
		}
		calendar.add(Calendar.DATE, addDay);

		return (formatter.format(calendar.getTime()));

	}
	
	/*
	 * 작성자/작성일: 인자:파일크기(byte) 내용:해당파일의 크기를 단위별 String으로 변환
	 */
	public static String getFileToString(long inxSize) {

		DecimalFormat df = new DecimalFormat("##,###.##");

		double FileSize = 0;
		String unit = "";

		if (Long.toString(inxSize).length() > 9) {
			FileSize = (((double) inxSize) / (1000000000));
			unit = "GB";
		} else if (Long.toString(inxSize).length() > 6) {
			FileSize = (((double) inxSize) / (1000000));
			unit = "MB";
		} else if (Long.toString(inxSize).length() > 3) {
			FileSize = ((double) inxSize / 1000);
			unit = "KB";
		} else {
			FileSize = (inxSize);
			unit = "byte";
		}

		return (df.format(FileSize) + " " + unit);
	}

	/*
	 * 작성자/작성일: 인자:url,character set 내용:url의 내용을 String으로 반환
	 */
	public static String getURLText(String strURL, String charset) {

		String tmp = "";
		StringBuffer text = new StringBuffer();

		BufferedReader in = null;

		try {
			in = new BufferedReader(new InputStreamReader(
					(new URL(strURL)).openStream(), charset));

			while ((tmp = in.readLine()) != null) {
				text.append(tmp + '\n');
			}

		} catch(IllegalArgumentException e) {
			logger.info( "charset IF 0 -> IllegalArgumentException" + e );
		} catch (Exception e) {
			text = new StringBuffer();
		} finally {
			if(in != null) try { in.close(); } catch(IOException e) {logger.info("bufferedReader resoure 해제");}
		}

		return text.toString();
	}

	/*
	 * 작성자/작성일: 인자:url 내용:url의 내용을 String으로 반환
	 */
	public static String getURLText(String strURL) {

		String tmp = "";
		StringBuffer text = new StringBuffer();

		BufferedReader in=null;

		try {
			in = new BufferedReader(new InputStreamReader(
					(new URL(strURL)).openStream()));

			while ((tmp = in.readLine()) != null) {
				text.append(tmp + '\n');
			}

		}catch(IllegalArgumentException e) {
			logger.info( "charset IF 0 -> IllegalArgumentException" + e );
		}  catch (Exception e) {
			text = new StringBuffer();
		} finally {
			if(in != null) try { in.close(); } catch(IOException e) {logger.info("bufferedReader resoure 해제");}
		}

		return text.toString();
	}

	// -----------------start
	/*
	 * 내용:int,String형의 null값처리 및 공백제거,한글처리,암호화/복호화
	 */
	public static String trim(Object value) {

		return trim((String) value);
	}
	
	public static String Req_trim(String value) {
		String ret_str = "";
		if (value == null || value.equals("null") || value.equals("NULL")) {
			return ret_str;
		}
		ret_str = value.trim();
		ret_str = ret_str.replaceAll("<", "&lt;");
		ret_str = ret_str.replaceAll("'", "\"");
		ret_str = ret_str.replaceAll(">", "&gt;");
		return value.trim();
	}

	public static String utf8(Object Value) {
		String str = trim((String) Value);
		return str;
	}

	public static String trimAndDot(Object value) {

		return trimAndDot((String) value);
	}

	public static String trim(String value) {
		if (value == null || value.equals("null") || value.equals("NULL")) {
			return "";
		}
		return value.trim();
	}

	public static String trimAndDot(String value) {
		if (value == null || value.length() == 0) {
			return "-";
		}
		return value.trim();
	}

	public static int numberFormat(Object value) {

		return numberFormat((String) value);
	}

	public static int numberFormat(String value) {

		try {
			if (value == null || value.equals("")) {
				return 0;
			} else {
				return Integer.parseInt(value);
			}
		} catch (NumberFormatException e) {
			return 0;
		} catch (Exception e) {
			return 0;
		}
	}

	// 한글 처리
	public static String encoding(String value, String format) {
		if (value == null) {
			return "";
		}
		try {
			return new String(value.getBytes("ISO-8859-1"), format);
		} catch (UnsupportedEncodingException e) {
			return "";
		} catch (Exception e) {
			return "";
		}

	}

	public static String decode(String value, String encoding)
			throws UnsupportedEncodingException {
		value = trim(value);
		value = URLDecoder.decode(value, encoding);
		return value;
	}

	public static String encode(String value, String encoding)
			throws UnsupportedEncodingException {
		value = trim(value);
		value = URLEncoder.encode(value, encoding);
		return value;
	}

	// ----------------------end

	public static String substringBetween(String str, String open, String close) {
		if (str == null || open == null || close == null) {
			return "";
		}
		int start = str.indexOf(open);
		if (start != -1) {
			int end = str.indexOf(close, start + open.length());
			if (end != -1) {
				return str.substring(start + open.length(), end);
			}
		}
		return "";
	}

	public static String replaceString(String source, String oldStr,
			String newStr) {

		String replaceStr = ""; // Retrun value 변경된 문자열
		int startPosition = 0; // 검색 시작위치
		int resultPosition; // 검색된 위치

		if ((source == null) || (source.length() == 0))
			return source;

		while (true) {
			// 변경하고자하는 문자열의 위치를 검색
			resultPosition = source.indexOf(oldStr, startPosition);
			// 변경하고자하는 문자열이 검색되지 않았을경우 Loop를 벗어난다.
			if (resultPosition == -1)
				break;
			// 문자열(source)에서 검색된 위치까지 문자열을 잘라낸다.
			replaceStr += source.substring(startPosition, resultPosition);
			// 잘라낸 문자열에 변경할 문자열(replaceStr)을 붙힌다.
			replaceStr += newStr;

			// 검색할 위치를 새로붙힌(newStr)의 문자열 만큼 전진시킨다.
			startPosition = resultPosition + oldStr.length();
		}

		// 변경한 문자열에 뒤에 남은 문자열을 붙힌다.
		// 변경할 문자열이 검색되지 않았을경우는 처음 부터
		replaceStr += source.substring(startPosition);

		return replaceStr;

	}
	
	public static String getTextData(String path) {
		return getTextData(path, "", 5000);
	}
	
	public static String getTextData(String path, String encodeing) {

		if (encodeing.equals("")) {
			encodeing = "KSC5601";
		}

		StringBuffer fielData = new StringBuffer();
		File f;
		FileInputStream fi = null ;
		InputStreamReader ir = null;
		BufferedReader br = null;
		try {
			f = new File(path);
			fi = new FileInputStream(f);
			ir = new InputStreamReader(fi, encodeing);
			br = new BufferedReader(ir);

			String line = "";
			int cnt = 0;
			while ((line = br.readLine()) != null) {
				fielData.append(line + "\n");
				cnt++;
				if (cnt == 5000)
					break;
			}

		} catch (IOException e) {
			logger.info("getTextData file read -> IOException : " + e);
		} catch (Exception e) {
			logger.info("getTextData file read -> Exception : " + e);
		} finally {
			if( br != null ) try { br.close(); } catch (IOException e2) { logger.info("br close" ); }
			if( ir != null ) try { ir.close(); } catch (IOException e2) { logger.info("ir close" ); }
			if( fi != null ) try { fi.close(); } catch (IOException e2) { logger.info("fi close" ); }
		}

		return TextEdit.trim(fielData.toString()).replaceAll("[ ]+", " ");
	}

	public static String getTextData(String path, String encodeing, int max) {

		if (encodeing.equals("")) {
			encodeing = "KSC5601";
		}

		StringBuffer fielData = new StringBuffer();
		File f;
		FileInputStream fi = null ;
		InputStreamReader ir = null;
		BufferedReader br = null;
		try {
			f = new File(path);
			fi = new FileInputStream(f);
			ir = new InputStreamReader(fi, encodeing);
			br = new BufferedReader(ir, max);
			
			String line = "";
			int cnt = 0;
			while ((line = br.readLine()) != null) {
				fielData.append(line + "\n");
				cnt++;
				if (cnt == 5000)
					break;
			}

		} catch (IOException e) {
			logger.info("getTextData file read -> IOException : " + e);
		} catch (Exception e) {
			logger.info("getTextData file read -> Exception : " + e);
		} finally {
			if( br != null ) try { br.close(); } catch (IOException e2) { logger.info("br close" ); }
			if( ir != null ) try { ir.close(); } catch (IOException e2) { logger.info("ir close" ); }
			if( fi != null ) try { fi.close(); } catch (IOException e2) { logger.info("fi close" ); }
		}

		return TextEdit.trim(fielData.toString()).replaceAll("[ ]+", " ");
	}
	
	/*
	 * 작성자/작성일: 인자:파일명(경로포함된 파일도 가능) 내용:확장자추출
	 */
	public static String getExt(String fileName) {

		try {
			int start_pos = fileName.lastIndexOf(".") + 1;
			fileName = fileName.substring(start_pos, fileName.length());
			fileName = fileName.toLowerCase();
			return fileName;
		} catch (IndexOutOfBoundsException  e) {
			logger.info("getExt -> IndexOutOfBoundsException : " +e.toString());
			return "";
		}catch (Exception e) {
			logger.info(e.toString());
			logger.info("fileName=" + fileName);
			return "";
		}

	}

	/*
	 * 작성자/작성일: 인자:파일명(경로포함된 파일도 가능) 내용:확장자를 제외한 파일명 추출
	 */
	public static String getNameWithoutExt(String fileName) {

		try {
			int start_pos = 0;
			int end_pos = fileName.lastIndexOf(".");
			if (end_pos > -1) {
				if (fileName.indexOf(File.separator) > -1) {
					start_pos = fileName.lastIndexOf(File.separator) + 1;
				}
				fileName = fileName.substring(start_pos, end_pos);
			}

			return fileName;

		}catch (IndexOutOfBoundsException  e) {
			logger.info("getExt -> IndexOutOfBoundsException : " +e.toString());
			return "";
		} catch (Exception e) {
			logger.info(e.toString());
			logger.info("fileName=" + fileName);
			return "";
		}

	}

	/*
	 * 작성자/작성일: 내용:한글여부확인
	 */
	public static boolean hanCheck(String str) {
		// 문자열의 길이와 문자열의 바이트배열의 길이를 비교해서 체크
		if (str.length() == str.getBytes().length) {
			// //System.out.println(str + " is not Han-gul");
			return false;
		} else {
			// //System.out.println(str + " has Han-gul");
			return true;
		}
	}
	
	
	//md5 암호화
//	public static String toMd5(String str, String encoding){
//		String result = ""; 
//		try{
//			MessageDigest md = MessageDigest.getInstance("MD5"); 
//			md.update(str.getBytes(encoding)); 
//			byte byteData[] = md.digest();
//			StringBuffer sb = new StringBuffer(); 
//			for(int i = 0 ; i < byteData.length ; i++){
//				sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
//			}
//			result = sb.toString();
//			
//		}catch(NoSuchAlgorithmException e){
//			e.printStackTrace(); 
//			result = null; 
//		} catch (UnsupportedEncodingException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			result = null;
//		}
//		return result;
//	}

	public static String getQratorPageList(int countTotal, int pageNo, int lineCnt) {
		
		/** 총 페이지 수 */
		int pageTotal = 0;
	
		/** 페이지 그룹단위(1~10 & 1 ~ 20)로 화면에 보여준다. */
		int pageGroup = 0;
		
		/** 화면에 보여질 페이지 그룹의 갯수. 기본은 10개 */
		int pageLimit = 10;
	
		StringBuffer pageList = new StringBuffer();
	
		if(countTotal > 0) {
	
			// 총 글 수에 대한 페이지 그룹과 총 페이지 수를 구한다.
			pageGroup = (int) Math.ceil( pageNo / (float)pageLimit );
			pageTotal = countTotal / lineCnt;
			if ( ( countTotal % lineCnt ) != 0 ) pageTotal += 1;
	
			//System.out.println("pageNo="+pageNo);
			//System.out.println("pageLimit="+pageLimit);
			//System.out.println("pageGroup="+pageGroup);
			//System.out.println("pageTotal="+pageTotal);
	
			// 총 페이지 수가 pageLimit보다 작으면 [처음]이 보이지 않게 한다.
//			if( pageGroup > 1 ) {
//				pageList.append( "<a href=\"#\" class=\"pre_end\" alt=\"첫페이지\" onclick=\"goAnalysisPage('1');\"><img src=\"images/search/pag_first.gif\" /></a> ");
//			}else {
//				pageList.append( "<img src=\"images/search/pag_first.gif\" /> " );				
//			}
	
			// 총 페이지 수가 pageLimit보다 작으면 [이전]이 보이지 않게 한다.
			if( pageGroup > 1 ) {
				pageList.append( "<a href=\"#\" alt=\"이전\" onclick=\"goPage('").append( ( pageLimit * ( pageGroup-2 ) ) + 1 ).append("')\">&laquo;</a> " );
			}else {
				//pageList.append( " <a href=\"#\">&laquo;</a> " );			
			}//<a class="pre" alt=\"이전10개\" ></a> "
	
	
			// 총 페이지수가 pageLimit를 넘지 않으면 ..
			if ( pageTotal <= pageLimit ) {
				
				for ( int i=1; i <= pageTotal; i++ ) {
	
					if ( i == pageNo ) {
						pageList.append( "<a href=\"#\" class=\"on\">").append( i ).append( "</a>" ); 
					} else {
						pageList.append( "<a href=\"#\"" );
						pageList.append( " onclick=\"goPage('").append(i).append("')\">" ).append( i ).append( "</a>" );
					}
				}	// end of for
				
				/*		<a href="#" class="next">다음</a>
						<a href="#" class="next_end">끝</a>   
						
						<a href="#" class="next_end" alt=\"마지막페이지\" >끝</a> 
					*/
				
				//pageList.append( "<a  alt=\"다음\" >&raquo;</a> " );	
				//pageList.append( "<a class=\"next_end\" alt=\"마지막페이지\" ><img src=\"images/search/pag_end.gif\" /></a>" );		
				
			} else {	// 총 페이지 수가 pageLimit보다 크면...
	
				int startPage = ( ( pageGroup - 1 ) * pageLimit ) + 1;	// 시작 페이지 번호
				int endPage = ( ( pageGroup - 1 ) * pageLimit ) + pageLimit;		// 마지막 페이지 번호
				boolean lastPage = false;
				int j = 0;
				for ( j=startPage; j <= endPage; j++ ) {
	
					if ( j > pageTotal ) {
						break;
					}
					
					if ( j == pageNo ) {
						pageList.append( "<a href=\"#\" class=\"on\" >" ).append( j ).append( "</a>" );
					} else {
						pageList.append( "<a href=\"#\"" );
						pageList.append( "\"  onclick=\"goPage('").append(j).append("')\">" ).append( j ).append( "</a>" );
	
					}
	
	
				}	// end of for
				
	
				if ( j > pageTotal ) {
					lastPage = true;
				}
	
				if( !lastPage ) {	 // 마지막 페이지가 아니면
					pageList.append( "<a href=\"#\"  alt=\"다음\" onclick=\"goPage('").append( (pageLimit * pageGroup) + 1 ).append("')\">&raquo;</a> ");
				}else {
					//pageList.append( "<a href=\"#\">&raquo;</a> " );					
				}
	
//				if( !lastPage ) {	 // 마지막 페이지가 아니면
//					pageList.append( "<a href=\"#\" class=\"next_end\" alt=\"마지막페이지\" onclick=\"goAnalysisPage('").append( pageTotal ).append("')\"><img src=\"images/search/pag_end.gif\" /></a> " );
//				}else {
//					pageList.append( "<img src=\"images/search/pag_end.gif\" /> " );					
//				}
	
			}	// end of if
	
			return pageList.toString();
	
		}else {
			return "";
		}
	
	}


	public static String mgsSpecialCharacteCheck (String message, String specialCharacte) {
		String finalMsg ="";
		try {
			if(message.indexOf(specialCharacte) >-1) {
				String firstMsg = message.substring(0,message.indexOf(specialCharacte));
	//			//System.out.println("firstMsg : "+firstMsg);
				String lastMsg = message.substring(message.indexOf(specialCharacte),message.length());
	//			//System.out.println("lastMsg : "+lastMsg);
				String checkMsg ="";
				if(lastMsg.indexOf(" ") >-1) {
					checkMsg = lastMsg.substring(lastMsg.indexOf(" "));
				}
				finalMsg = firstMsg + checkMsg;
	//			//System.out.println("finalMsg : "+finalMsg);
				if(finalMsg.indexOf(specialCharacte) >-1) {
					finalMsg =mgsSpecialCharacteCheck(finalMsg, specialCharacte);
				}
			}else {
				finalMsg = message;
			}
		} catch (IndexOutOfBoundsException e) {
			logger.info("mgsSpecialCharacteCheck func exe -> IndexOutOfBoundsException : " + e);
		} catch (Exception e) {
			logger.info("mgsSpecialCharacteCheck func exe -> Exception : " + e);
		}
		
		return finalMsg;
	}
	
//	public static void del(String target){
//		File delPath = new File(target);
//		if(delPath.exists()){
//			String fileList[] = delPath.list();
//			for(int i=0;i<fileList.length;i++){
//				String filePath = target+File.separator+fileList[i];
//				File delFilePath = new File(filePath);
//				if(delFilePath.isDirectory()){
//					del(filePath);					
//				}				
//				delFilePath.delete();
//			}
//			delPath.delete();
//		}
//	}
	
	public static String[] getArray(String value, String delimeter) {
		
		String[] array = null;
		
		if(value.equals("")) return null;
		
		if(value.indexOf(delimeter) > -1) {
			array = value.split(delimeter);
		}
		//여러개일때
		else {
			array = new String[1];
			array[0] = value;
		}
		
		return array;
	}
	
	//해당인코딩에 맞춰 파일 생성
	public static boolean makeFileWithEncoding(String path, String content, String encoding) {

		boolean result = false;

		//if (path==null || path.equals("") || content==null || content.equals("")) return false;
		if (path==null || path.equals("")) return false;
		BufferedWriter out=null;

		try {
				out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path), encoding));

				synchronized(out) {
				out.write(content);
			}
			result = true;
		} catch (IOException ex) {
			//ex.printStackTrace();
			result = false;
		} finally {
			if(out != null) try { out.close(); } catch(IOException e) {logger.info("out resoure 해제");}
		}

		return result;
	}
	
	public static boolean checkSpecialChar(String word, String exception_symbol) {

		boolean result = false;

		for (int j = 0; j < word.length(); j++) {
			char chr = word.charAt(j);
			String str = word.substring(j, j + 1);
			// logger.info(str);
			
			if (exception_symbol.indexOf(str) > -1) {
				continue;
			}
			
			if (Character.getType(chr) == Character.OTHER_NUMBER
					|| Character.getType(chr) == Character.FINAL_QUOTE_PUNCTUATION
					|| Character.getType(chr) == Character.INITIAL_QUOTE_PUNCTUATION
					|| Character.getType(chr) == Character.CONTROL
					|| Character.getType(chr) == Character.START_PUNCTUATION
					|| Character.getType(chr) == Character.END_PUNCTUATION
					|| Character.getType(chr) == Character.DASH_PUNCTUATION
					|| Character.getType(chr) == Character.CONNECTOR_PUNCTUATION
					|| Character.getType(chr) == Character.OTHER_PUNCTUATION
					|| Character.getType(chr) == Character.OTHER_SYMBOL
					|| Character.getType(chr) == Character.MATH_SYMBOL
					|| Character.getType(chr) == Character.MODIFIER_SYMBOL
					|| Character.getType(chr) == Character.CURRENCY_SYMBOL
					|| 1 > 1) {

				result = true;
				break;

			}

		}

		return result;

	}	
		
	//여러개의 공백을 하나의 공백으로 교체 등 기타처리
//		public static String replaceSpace(String txt, String delimeter){
//			
//			String return_str = "";
//			
//			try {
//				//공백이 여러개일때 모든 공백을 하나로 만든다.
//				int two_space_cnt = StringUtils.countMatches(txt, "  ");
//				
//				for(int i=0; i<two_space_cnt; i++) {
//					if(txt.indexOf("  ") > -1) {
//						txt = txt.replace("  ", " ");
//					}else {
//						break;
//					}
//				}
//				
//				txt = txt.replace(" ", delimeter);
//				
//				return_str = txt.trim();
//				
//			}catch (IndexOutOfBoundsException e) {
//				logger.info("replaceSpace func exe -> IndexOutOfBoundsException : "+ e);
//			}catch(Exception e) {
//				logger.info("replaceSpace func exe -> Exception : "+ e);
//			}
//			
//			return return_str;
//			
//		}

		
		public static HashMap<String, Object> convertMap(HttpServletRequest request) {
			 
		    HashMap<String, Object> hmap = new HashMap<String, Object>();
		    String key;
		 
		    Enumeration<?> enum1 = request.getParameterNames();
		    System.out.println("enum1 : " + enum1);
		    while (enum1.hasMoreElements()) {
		        key = (String) enum1.nextElement();
		        System.out.println("key : " + key);
		        if (request.getParameterValues(key).length > 1) {
		            hmap.put(key, request.getParameterValues(key));
		        } else {
		            hmap.put(key, request.getParameter(key));
		        }
		 
		    }
		 
		    return hmap;
		}
		
		/***
		 * 공백을 제외한 특수문자가 존재하면 true / 존재하지 않으면 false
		 * @param str
		 * @return
		 */
		public static boolean checkSpecialCharacters(String str) {
		    return !str.matches("[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝| ]*");
		}
		
		/***
		 * URL 사용 가능 추가 공백을 제외한 특수문자가 존재하면 true / 존재하지 않으면 false
		 * @param str
		 * @return  <>   
		 */
		public static boolean urlCheckSpecialCharacters(String str) {
		    //return !str.matches("[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝| |\\|,|.|/|:|=|-|?|\n]*");
			return ! ( ( str.indexOf("<") + str.indexOf(">") + str.indexOf("alert") ) == -3 );
		}
		
		/**
		 * @Description 컬럼명 추출 함수
		 * @param jdbcUrl
		 * @param username
		 * @param password
		 * @param query
		 * @return
		 */
		public static List<String> getColumnNames(String jdbcUrl, String username, String password, String query) {
	        List<String> columnNames = new ArrayList<>();
	        Connection connection = null;
	        Statement statement = null;
	        ResultSet resultSet = null;

	        try {
	            // 연결 생성
	            connection = DriverManager.getConnection(jdbcUrl, username, password);

	            // 쿼리 실행
	            statement = connection.createStatement();
	            resultSet = statement.executeQuery(query);

	            // 컬럼명 추출
	            ResultSetMetaData metaData = resultSet.getMetaData();
	            int columnCount = metaData.getColumnCount();

	            for (int i = 1; i <= columnCount; i++) {
	                columnNames.add(metaData.getColumnName(i));
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        } finally {
	            try {
	                if (resultSet != null) resultSet.close();
	                if (statement != null) statement.close();
	                if (connection != null) connection.close();
	            } catch (SQLException e) {
	                e.printStackTrace();
	            }
	        }
	        return columnNames;
	    }
		
		public static String getPageList(int countTotal, int pageNo, int lineCnt) {
		    /** 총 페이지 수 */
		    int pageTotal = 0;

		    /** 페이지 그룹단위(1~10 & 1 ~ 20)로 화면에 보여준다. */
		    int pageGroup = 0;

		    /** 화면에 보여질 페이지 그룹의 갯수. 기본은 10개 */
		    int pageLimit = 10;

		    StringBuffer pageList = new StringBuffer();

		    if(countTotal > 0) {
		        // 총 글 수에 대한 페이지 그룹과 총 페이지 수를 구한다.
		        pageGroup = (int) Math.ceil((double) pageNo / pageLimit);
		        pageTotal = (countTotal + lineCnt - 1) / lineCnt;  // 페이지 계산 수정
		        if (pageTotal == 1) {
		            pageList.append("<strong>1</strong>");
		            return pageList.toString();
		        }

		        // 총 페이지 수가 pageLimit보다 작으면 [이전]이 보이지 않게 한다.
		        if (pageGroup > 1) {
		            pageList.append("<a href=\"javascript:;\" class=\"btn_first\" onclick=\"goPage('1');\"><<</a>");
		            pageList.append("<a href=\"javascript:;\" class=\"btn_preview\" onclick=\"goPage('").append((pageLimit * (pageGroup - 2)) + 1).append("')\"><</a>");
		        } else {
		            pageList.append("<a href=\"javascript:;\" class=\"btn_first\" onclick=\"goPage('1');\"><<</a>");
		            pageList.append("<a href=\"javascript:;\" class=\"btn_preview\"><</a>");
		        }

		        // 총 페이지수가 pageLimit를 넘지 않으면 ..
		        if (pageTotal <= pageLimit) {
		            for (int i = 1; i <= pageTotal; i++) {
		                if (i == pageNo) {
		                    pageList.append("<strong>").append(i).append("</strong>");
		                } else {
		                    pageList.append("<a href=\"javascript:;\" onclick=\"goPage('").append(i).append("')\">").append(i).append("</a>");
		                }
		            }
		            pageList.append("<a href=\"javascript:;\" class=\"btn_next\" onclick=\"goPage('").append(pageNo + 1).append("')\">></a>");
		            pageList.append("<a href=\"javascript:;\" class=\"btn_last\" onclick=\"goPage('").append(pageTotal).append("')\">>></a>");
		        } else {
		            int startPage = (pageGroup - 1) * pageLimit + 1;
		            int endPage = Math.min(pageGroup * pageLimit, pageTotal);
		            boolean lastPage = false;

		            for (int j = startPage; j <= endPage; j++) {
		                if (j > pageTotal) {
		                    break;
		                }
		                if (j == pageNo) {
		                    pageList.append("<strong>").append(j).append("</strong>");
		                } else {
		                    pageList.append("<a href=\"javascript:;\" onclick=\"goPage('").append(j).append("')\">").append(j).append("</a>");
		                }
		            }

		            if (endPage < pageTotal) {
		                pageList.append("<a href=\"javascript:;\" class=\"btn_next\" onclick=\"goPage('").append(endPage + 1).append("')\">></a>");
		                pageList.append("<a href=\"javascript:;\" class=\"btn_last\" onclick=\"goPage('").append(pageTotal).append("')\">>></a>");
		            } else {
		                pageList.append("<a href=\"javascript:;\" class=\"btn_next\">></a>");
		                pageList.append("<a href=\"javascript:;\" class=\"btn_last\" onclick=\"goPage('").append(pageTotal).append("')\">>></a>");
		            }
		        }

		        return pageList.toString();
		    } else {
		        return "";
		    }
		}

}
