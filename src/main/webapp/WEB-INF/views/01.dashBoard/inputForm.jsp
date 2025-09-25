<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- inputForm.jsp -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Python 서버로 데이터 전송</title>
</head>
<body>
    <h1>Python 서버로 데이터 전송</h1>
    <form action="/sendData" method="post">
        <label for="data">전송할 문자열:</label>
        <input type="text" id="data" name="data" required>
        <button type="submit">전송</button>
    </form>
</body>
</html>
