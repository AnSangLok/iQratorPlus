<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- response.jsp -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>서버 응답</title>
</head>
<body>
    <h1>서버 응답</h1>
    <%
        String serverResponse = (String) request.getAttribute("serverResponse");
        String error = (String) request.getAttribute("error");
    %>
    <% if (error != null) { %>
        <p style="color: red;"><%= error %></p>
    <% } else if (serverResponse != null) { %>
        <p>Python 서버 응답: <%= serverResponse %></p>
    <% } else { %>
        <p>서버 응답이 없습니다.</p>
    <% } %>
    <a href="/inputForm">다시 전송하기</a>
</body>
</html>
