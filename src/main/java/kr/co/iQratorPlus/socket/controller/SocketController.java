package kr.co.iQratorPlus.socket.controller;
//package kr.co.iQratorPlus.socket.controller;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import kr.co.iQratorPlus.socket.service.SocketService;
//import kr.co.iQratorPlus.util.TextEdit;
//
//@RestController
//public class SocketController {
//	
//	@Autowired
//	private SocketService socketService;
//	
//	@RequestMapping(value = "/complain")
//	@ResponseBody
//	public List<HashMap> complain_result(@RequestParam String cmpl_text) {
//
//		System.out.println("argsMap ========================================= " );
//		
//		HashMap hm = new HashMap();
//		List<HashMap> resultList = new ArrayList<HashMap>();
//		try {
//			
//			resultList = socketService.sendCmplText(cmpl_text);
//			
//		} catch (Exception e) {
//			System.out.println("error : " + e.toString());
//		}
//		
//		return resultList;
//	}
//}
