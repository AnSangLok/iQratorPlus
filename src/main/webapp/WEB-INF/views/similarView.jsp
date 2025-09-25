<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%> --%>
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>공정거래위원회</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
<meta name="format-detection" content="telephone=no" />
    
    <link rel='stylesheet' href='./css/common.css'>
	<script src='js/index.js'></script>
	<script src="./js/jquery-1.9.1.js"></script>
	<script src="./js/common.js"></script>
</head>


<body>
   
    <div id="Wrap">
           
        <header id="Header">
        	<div class="top">
        		<a href="https://www.ftc.go.kr/www/index.do" target="_blank"><img src="./images/logo.png" alt="LOGO"></a>
            </div>
        </header>
        
        <div id="Cont">
            <div>
                <div class="title fl">민원내용</div>
                <button type="button" class="btn_send fr" onclick="cmpl_process();" >민원전송</button>
                <div class="clear"></div>
                <div class="bar"></div>
                <textarea style="height:180px;" id="cmpl_text"></textarea>
            </div>

            <!--<div style="margin-top: 20px;">
                <div class="title">추천내용</div>
                <div class="bar"></div>
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <th scope="col">순번</th>
                      <th scope="col">유형코드</th>
                      <th scope="col">유형명</th>
                      <th scope="col" class="last">추천율</th>
                    </tr>
                    <tr>
                      <td id='result_rank1'>-</td>
                      <td id='result_code1'>-</td>
                      <td id='result_name1'>-</td>
                      <td class="last" id='result_score1'>-</td>
                    </tr>
                    <tr>
                      <td id='result_rank2'>-</td>
                      <td id='result_code2'>-</td>
                      <td id='result_name2'>-</td>
                      <td class="last" id='result_score2'>-</td>
                    </tr>
                    <tr>
                      <td class="td_last" id='result_rank3'>-</td>
                      <td class="td_last" id='result_code3'>-</td>
                      <td class="td_last" id='result_name3'>-</td>
                      <td class="last td_last" id='result_score3'>-</td>
                    </tr>
                  </table>
            </div> -->
            <div style="margin-top: 20px;">
                <div class="title">유사민원목록</div>
                <div class="bar"></div>
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <th scope="col">순번</th>
                      <th scope="col">유형명</th>
                      <th scope="col" class="last">추천율</th>
                    </tr>
                    <tr>
                      <td id='similar_rank1'>-</td>
                      <td id='similar_name1'>-</td>
                      <td class="last" id='similar_score1'>-</td>
                    </tr>
                    <tr>
                      <td id='similar_rank2'>-</td>
                      <td id='similar_name2'>-</td>
                      <td class="last" id='similar_score2'>-</td>
                    </tr>
                    <tr>
                      <td id='similar_rank3'>-</td>
                      <td id='similar_name3'>-</td>
                      <td class="last" id='similar_score3'>-</td>
                    </tr>
                    <tr>
                      <td id='similar_rank4'>-</td>
                      <td id='similar_name4'>-</td>
                      <td class="last" id='similar_score4'>-</td>
                    </tr>
                    <tr>
                      <td class="td_last" id='similar_rank5'>-</td>
                      <td class="td_last" id='similar_name5'>-</td>
                      <td class="last td_last" id='similar_score5'>-</td>
                    </tr>
                  </table>
            </div>
        </div>  <!--Cont-->
        
    </div>  <!--Wrap-->
    
</body>

</html>