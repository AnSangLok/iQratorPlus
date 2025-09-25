package kr.co.iQratorPlus.socket.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;

import kr.co.iQratorPlus.util.PredictSocketUtil;

@Service
public class SocketService {

	private static Logger logger = LogManager.getLogger(SocketService.class);

	public List<HashMap> sendCmplText(String cmpl_text) throws UnsupportedEncodingException, ParseException {
		
		List<HashMap> resultList = new ArrayList<HashMap>();
		
		PredictSocketUtil socketUtil = new PredictSocketUtil("127.0.0.1",8887,"UTF-8");

		String sendData = "evtcl:"+cmpl_text+"@@@1";

		String recvData = socketUtil.getReciveData(sendData);
		
		String parse_str = "";

        System.out.println("recvData : " + recvData);
		JSONParser parser = new JSONParser();
        System.out.println("@@@@");
        JSONArray jSONArray = (JSONArray) parser.parse(recvData);
        System.out.println("@@222@@");
        
        for (int i=0; i<jSONArray.size(); i++) {
    		HashMap hm = new HashMap();
        	parse_str = jSONArray.get(i).toString();
            JSONObject jsonObj = (JSONObject) parser.parse(parse_str);
            
            System.out.println("cmpl_data : " + jsonObj.get("evtcl_cd").toString());
    		
            String cmpl_data = jsonObj.get("evtcl_cd").toString();
            cmpl_data = cmpl_data.replaceAll("\\{", "").replaceAll("\\}", "").replaceAll("\\'", "");
            System.out.println("@@@@ : " + cmpl_data);
            String cmpl_code = cmpl_data.split(":")[1].split("@@")[0];
            String cmpl_name = cmpl_data.split(":")[1].split("@@")[1];
            String cmpl_score = jsonObj.get("score").toString();
            
            hm.put("rank", (i+1));
            hm.put("code", cmpl_code);
            hm.put("name", cmpl_name);
            hm.put("score", cmpl_score);
            
            
            resultList.add(hm);
        }
        
        
        
		return resultList;
	}
}
