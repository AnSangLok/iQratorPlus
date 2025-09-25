package kr.co.iQratorPlus.util;


import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.Socket;


public class PredictSocketUtil {
	
	
//	public static void main(String[] args) throws UnsupportedEncodingException {
//		PredictSocketUtil socketUtil = new PredictSocketUtil("127.0.0.1",8887,"UTF-8");
//		// 문장요약 소켓 호출 문자열
//		String sendData = "evtcl:차가 사람을 치고 도망쳤어요@@@1";
//		System.out.println(sendData);
//		String recvData = socketUtil.getReciveData(sendData);
//		System.out.println(recvData);
//	}
	
	private String host;
	private int port;
	private String serverEncode;
	
	public PredictSocketUtil(String host, int port,String serverEncode) {
		super();
		this.host = host;
		this.port = port;
		this.serverEncode = serverEncode;
	}
	
	public String getReciveDataSimple(String sendData) {
		DataOutputStream dos = null;
		DataInputStream dis = null;
		Socket socket = null;
		String result = "";
		
		try{
			socket = new Socket(this.host,this.port);			
			
			dos = new DataOutputStream(socket.getOutputStream());
			
			dos.writeUTF(sendData);
			
			dos.flush();
			
			dis = new DataInputStream(socket.getInputStream());
			
			result = dis.readUTF();			
			
		}catch(Exception e){
			System.out.println(e.toString());			
		}finally {
			try {
				dos.close();
				dis.close();
				socket.close();
			} catch (IOException e) {
				System.out.print("getReciveDataSimple Error : "+e.toString());
			}
			
		}
		return result;
	}
	
	public String getReciveData(String sendData) {
		StringBuffer returnStr = new StringBuffer();
		Socket soc = null;
		// 데이터 전송
		BufferedWriter bw = null;
		// 데이터 수신
		BufferedInputStream bis = null;
		String recvData = "";
		try {
//			System.out.println( this.host );
//			System.out.println( this.port );
			soc = new Socket(this.host,this.port);
			soc.setSoTimeout(30*1000);
			soc.isConnected();
			int len = sendData.getBytes("UTF-8").length;
			String send_data = len + ":" + sendData;
			bw = new BufferedWriter(new OutputStreamWriter(soc.getOutputStream(), this.serverEncode));
			bw.write(send_data);
			bw.newLine(); // 아주 중요..생략시 서버로 부터 데이타 수신이 안되는 경우 발생 됨.
			bw.flush();
			bis = new BufferedInputStream(soc.getInputStream());
			String recv_data = recvData(bis, soc);
			recvData = recv_data;
		} catch (Exception e) {
			System.out.print("Socket getReciveData = " + e.toString());
		} finally {
			try {
				bw.close();
				bis.close();
				soc.close();
			} catch (Exception e2) {
				System.out.println("e2 = " + e2.toString());
			}
		}
		return recvData;
	}
	
	public String recvData(BufferedInputStream bis, Socket socket) {
		String retStr = "";
		try {

			byte[] buf = new byte[1];
			int read = 0;
			Thread.sleep(20);
			int totalRead = 0;
			int totalLength = 0;
			int cnt = 0;
			boolean chk = true;
			while (true) {
				read = bis.read(buf, 0, 1);
				String chkStr = new String(buf, this.serverEncode);
				retStr += chkStr;
				
				if (chkStr.equals(":")) {
					totalLength = Integer.parseInt(retStr.replace(":", ""));
					break;
				}
				cnt++;
				if (cnt > 30) {
					chk = false;
					break;
				}
			}

			if (chk) {
				buf = new byte[totalLength];
				bis.read(buf, 0, totalLength);
				retStr = new String(buf, this.serverEncode);
			} else {
				retStr = "";
			}

		} catch (Exception e) {
			System.out.print("Socket recvData = " + e.toString());
		}
		return retStr;
	}

}
