<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>머신러닝 관리자 로그인</title>
<style>
/* 기본 스타일 설정 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
}

/* 배경 설정 */
body {
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* 로그인 컨테이너 */
.login-container {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 350px;
    color: white;
}

/* 제목 스타일 */
h2 {
    margin-bottom: 20px;
    font-size: 24px;
}

/* 입력 그룹 */
.input-group {
    margin-bottom: 15px;
    text-align: left;
}

.input-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: bold;
}

.input-group input {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    outline: none;
}

.input-group input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

/* 로그인 버튼 */
.login-button {
    background: #ff7eb3;
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.login-button:hover {
    background: #ff5e90;
}

/* 에러 메시지 */
.error-message {
    color: #ffcccb;
    font-size: 14px;
    margin-bottom: 10px;
}

/* 반응형 디자인 */
@media (max-width: 400px) {
    .login-container {
        width: 90%;
    }
}

</style>
</head>
<body>
    <div class="login-container">
        <h2>머신러닝 관리자 로그인</h2>
        
        <%-- 로그인 실패 시 에러 메시지 표시 --%>
        <c:if test="${not empty param.error and param.error eq 'true'}">
	        <p class="error-message">아이디 또는 비밀번호가 잘못되었습니다.</p>
	    </c:if>


        <form action='/login' method="post">
            <div class="input-group">
                <label for="username">아이디</label>
                <input type="text" id="username" name="username" placeholder="아이디 입력" value="${param.username}" required>
            </div>

            <div class="input-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" placeholder="비밀번호 입력" required>
            </div>

            <button type="submit" class="login-button">로그인</button>
        </form>
    </div>
</body>
</html>
