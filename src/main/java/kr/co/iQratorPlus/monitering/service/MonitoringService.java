package kr.co.iQratorPlus.monitering.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import kr.co.iQratorPlus.database.mapper.MoniterMapper;
import kr.co.iQratorPlus.monitering.domain.AlgorithmVO;
import kr.co.iQratorPlus.monitering.domain.CallApiCntVO;
import kr.co.iQratorPlus.monitering.domain.ContainerStatVO;
import kr.co.iQratorPlus.statistics.domain.StatisticsVO;

@Service
public class MonitoringService {
	
	@Autowired
	MoniterMapper moniterMapper;
	
	@Value("${jsch.sftp.host}")
	private String sftpHost;
	
	@Value("${jsch.sftp.port}")
	private int sftpPort;
	
	@Value("${jsch.sftp.user}")
	private String sftpUser;
	
	@Value("${jsch.sftp.pwd}")
	private String sftpPwd;
	
	public List<AlgorithmVO> selectMonitoringAlgorithm() throws Exception {
		
		List<AlgorithmVO> algoList = moniterMapper.selectMonitoringAlgorithm();
		
		return algoList;
	}
	
	public List<CallApiCntVO> selectMonitoringCallApiCnt() throws Exception {
		
		List<CallApiCntVO> callCntList = moniterMapper.selectMonitoringCallApiCnt();
		
		return callCntList;
	}
	
	public List<ContainerStatVO> getContainerStats() throws Exception {
	    List<ContainerStatVO> statsList = new ArrayList<>();
	    JSch jsch = new JSch();
	    Session session = null;
	    ChannelExec channel = null;

	    // 필터링할 컨테이너 이름들 (grep 명령어로 필터링할 패턴 생성)
//	    String containerFilter = "ml-flask-app|corr-python-app";
	    String containerFilter = "ml-flask-app|corr-python-app|ml-tomcat";

	    try {
	        // SFTP 서버에 연결
	        session = jsch.getSession(sftpUser, sftpHost, sftpPort);
	        session.setPassword(sftpPwd);

	        // 호스트 키 검증을 건너뛰기 위해 설정
	        session.setConfig("StrictHostKeyChecking", "no");
	        session.connect();

	        // exec 채널을 사용하여 명령어 실행
	        channel = (ChannelExec) session.openChannel("exec");

	        // 단일 docker stats 명령어로 필터링된 데이터 가져오기
	        String command = String.format(
	            "docker stats --no-stream --format \"{{.Name}}: {{.CPUPerc}}, {{.MemPerc}}\" | grep -E \"%s\"",
	            containerFilter
	        );
	        channel.setCommand(command);

	        // 명령어 실행 및 결과 처리
	        InputStream inputStream = channel.getInputStream();
	        channel.connect();

	        // 명령어 실행 결과 읽기
	        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
	        String line;

	        // 결과를 읽어와 ContainerStatVO에 담기
	        while ((line = reader.readLine()) != null) {
//	            System.out.println("Output: " + line); // 디버깅을 위한 출력

	            // 예: ml-flask-app: 0.02%, 1.1%
	            String[] parts = line.split(":");
	            if (parts.length < 2) continue;

	            String containerName = parts[0].trim();
	            String[] usageParts = parts[1].split(", ");
	            if (usageParts.length < 2) continue;

	            String cpuUsage = usageParts[0].trim();
	            String memUsage = usageParts[1].trim();

	            // ContainerStatVO 객체 생성 및 데이터 설정
	            ContainerStatVO containerStats = new ContainerStatVO();
	            containerStats.setContainerNm(containerName);
	            containerStats.setCpuPer(cpuUsage);
	            containerStats.setMemPer(memUsage);

	            // 리스트에 추가
	            statsList.add(containerStats);
	        }

	    } catch (JSchException | IOException e) {
	        e.printStackTrace();
	    } finally {
	        if (channel != null && channel.isConnected()) {
	            channel.disconnect();
	        }
	        if (session != null && session.isConnected()) {
	            session.disconnect();
	        }
	    }

	    return statsList;
	}
}
