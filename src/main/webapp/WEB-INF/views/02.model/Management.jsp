<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
    <!-- <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    Tell the browser to be responsive to screen width
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    Favicon icon
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png">
    <title>i QratorPlus</title>
  
    Custom CSS
    <link href="css/style.min.css" rel="stylesheet">
    <link href="css/style_contents.css" rel="stylesheet"> -->
	<!-- <style>
	  .table td, .table th {
	    vertical-align: middle;
	    word-break: break-all;
	  }
	</style> -->
</head>


<body>
    <script src="js/model/modelmgnt.js?ver=1.1"></script>
	<form action="model-tr" method="post" id="reTrainFrom"></form>
	<input type="hidden" id="trainId">
	
		<div class="title_area">
                <div class="title fl"><img src="images/icon_02.png">
                	모델관리
                	<span class="tooltip-bottom" data-tooltip="모델의 관리 및 호출정보를 확인할 수 있습니다.">
					<i class="fas fa-question-circle .tooltip-icon"></i>
					</span>
                </div>
                <div class="search_box fr">
                    <input class="search" onkeypress="searchEnter(event)" type="search" placeholder="모델명을 입력해 주세요." aria-label="Search">
                    <i class="icon_search"><img src="images/search.png"></i>
                </div>
            </div> <!-- title_area -->

            <div class="clear"></div>

            <div class="right_contents">
                
                <div class="table_area"> <!-- display: none; 일 경우 width: 100%; -->

                    <div class="table_box mr">
                        <h4 class="card-title">학습모델 목록</h4>
                        <div class="table_div" id="modelInfoTb">
                            <table width="100%" cellspacing="0" cellpadding="0" class="table">
                                <thead>
                                <tr>
                                    <th scope="col" width="20%">모델명</th>
                                    <th scope="col" width="20%">상태</th>
                                    <th scope="col" width="30%">데이터셋명</th>
                                    <th scope="col" width="17%">배포 / 중지</th>
                                    <th scope="col" width="13%">이력관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>-</td>
                                    <td><h5 class="color_blue">실행중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td>-</td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h5 class="color_yellow">대기중</h5></td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/play.png"></a><a href='javascript:void(0)'><img src="images/stop.png" class="left_10"></a></td>
                                    <td><a href='javascript:void(0)'><img src="images/history.png"></a></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> <!-- table_box -->

                    <div class="table_box">
                        <h4 class="card-title">모델 상세</h4>
                        <div class="table_div2" style="display:;" id="detailTb">
                            <table width="100%" cellspacing="0" cellpadding="0" class="table">
                                <thead>
                                  <tr>
                                    <th scope="col" width="40%">모델명</th>
                                    <th scope="col" width="30%">학습 일시</th>
                                    <th scope="col" width="15%">모델 정확도</th>
                                    <th scope="col" width="15%">모델 삭제</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td></td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td><a href='javascript:void(0)'><img src="images/delete.png"></a></td>
                                  </tr>
                                </tbody>
                            </table>
                        <button type="button" id="detail_btn" class="btn fr mtb_1020">재학습</button>
                        </div>
                                    
                        <div style="display:none " id="historyTb" class="table_div2">
                            <table width="100%" cellspacing="0" cellpadding="0" class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" width="40%">모델명</th>
                                        <th scope="col" width="30%">학습 일시</th>
                                        <th scope="col" width="15%">모델 정확도</th>
                                        <th scope="col" width="15%">모델 삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td><a href='javascript:void(0)'><img src="images/delete.png"></a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="display:none" id="dockerTb" class="table_area2"></div>
                    </div> <!-- table_box -->

                </div> <!--table_area-->

            </div>  <!--right_contents-->   
</body>