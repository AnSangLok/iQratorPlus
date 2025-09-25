package kr.co.iQratorPlus.util;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/SendDataServlet")
public class SendDataServlet extends HttpServlet {
    public static void main(String[] args) {
        String host = "121.78.116.98";
        int port = 18888;

        try (Socket socket = new Socket(host, port)) {
            // 데이터 전송 준비
            Map<String, Object> data = new HashMap<>();
            data.put("value", 10);  // 자바에서 전달할 값
            String jsonData = new ObjectMapper().writeValueAsString(data);

            // 서버에 데이터 전송
            OutputStream output = socket.getOutputStream();
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(output), true);
            writer.println(jsonData);

            // 서버 응답 수신
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            String response;
            while ((response = reader.readLine()) != null) {
                // JSON 파싱
                Map<String, Object> resultMap = new ObjectMapper().readValue(response, Map.class);
                
                if (resultMap.containsKey("result")) {
                    System.out.println("Python 서버 응답: " + resultMap.get("result"));
                }

                // 서버에서 응답이 null이 오면 종료
                if (resultMap.get("result") == null) {
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
