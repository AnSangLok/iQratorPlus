<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
<style>
        .graph_area img {
		    width: 100%;
		    height: 100%;
		}
		.graph_area2 {
		    width: 50%;
		    height: 100%;
		}
		
    
    
    /* 오른쪽 아래 input 박스와 버튼 스타일 */
    .right-panel {
        position: absolute;
        right: 40px;
        top: 130px;
        width: 40%;
        height: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    /* 차트 영역 (오른쪽 위, 넓이 40%, 높이 50%) */
    .chart-container {
        width: 100%;
        height: 50%;
    }

    #myChart {
        width: 100%;
        height: 100%;
    }

    /* 입력 필드 & 버튼 (오른쪽 아래) */
    .input_area {
        display: flex;
        gap: 10px;
    }

    .input_area input {
        padding: 5px;
        width: 200px;
    }

    .input_area button {
        padding: 6px 12px;
        cursor: pointer;
    }
    
    .pagination {
	    margin-top: 20px;
	    text-align: center;
	}

	.pagination a {
	    margin: 0 3px; /* 버튼 간격을 좁히기 */
	    padding: 3px 8px; /* 버튼 크기를 작게 */
	    text-decoration: none;
	    background-color: #f0f0f0;
	    border: 1px solid #ccc;
	    border-radius: 5px;
	    color: #333;
	    font-size: 12px; /* 글자 크기를 작게 */
	}
	
	.pagination a:hover {
	    background-color: #e0e0e0;
	}
	
	.pagination .btn_first,
	.pagination .btn_preview,
	.pagination .btn_next,
	.pagination .btn_last {
	    font-weight: bold;
	    background-color: #007bff;
	    color: white;
	    border: none;
	}
	
	.pagination .btn_first:hover,
	.pagination .btn_preview:hover,
	.pagination .btn_next:hover,
	.pagination .btn_last:hover {
	    background-color: #0056b3;
	}
	
	.pagination strong {
	    font-weight: bold;
	    margin: 0 5px;
	    font-size: 12px; /* 강한 페이지 번호 크기 줄이기 */
	}
    
    
    .pagination2 {
	    margin-top: 20px;
	    width: 40%;    /* 컨테이너에 맞게 전체 너비 사용 */
	    text-align: center; /* 내부 페이징 요소들을 가운데 정렬 */
	}
	
	/* 기존 페이징 스타일은 그대로 유지 */
	.pagination2 a {
	    margin: 0 3px;
	    padding: 3px 8px;
	    text-decoration: none;
	    background-color: #f0f0f0;
	    border: 1px solid #ccc;
	    border-radius: 5px;
	    color: #333;
	    font-size: 12px;
	}
	
	.pagination2 a:hover {
	    background-color: #e0e0e0;
	}
	
	.pagination2 .btn_first,
	.pagination2 .btn_preview,
	.pagination2 .btn_next,
	.pagination2 .btn_last {
	    font-weight: bold;
	    background-color: #007bff;
	    color: white;
	    border: none;
	}
	
	.pagination2 .btn_first:hover,
	.pagination2 .btn_preview:hover,
	.pagination2 .btn_next:hover,
	.pagination2 .btn_last:hover {
	    background-color: #0056b3;
	}
	
	.pagination2 strong {
	    font-weight: bold;
	    margin: 0 5px;
	    font-size: 12px;
	}
</style>

</head>

<body>
	<input type="hidden" id="ENTN" value=>
	<input type="hidden" id="T_DEMO" value="firmSearch">
	<input type="hidden" id="PAGE" value="1">
	
	<script src="js/common/chart.js"></script>
	<script src="js/model/modeltest.js?ver=1.03"></script>
			<div class="title_area">
                <div class="title fl"><img src="images/icon_02.png"> 시범서비스 화면
		        	<span class="tooltip-bottom" data-tooltip="학습된 모델을 테스트 할 수 있습니다.">
					<i class="fas fa-question-circle .tooltip-icon"></i>
					</span>
                </div>
            </div> <!-- title_area -->
            
            <div class="clear"></div>
            
			
            <div class="right_contents">
            
                           <div class="bottom_10 fr" id="searchTab" style="display:;">
                               <input type="text" class="text_box2" id="firmName" placeholder="업체명 검색" onkeypress="searchEnter(event)" >
                               <button type="button" class="btn waves-effect waves-light btn-sm btn-secondary btn_search" onclick="searchClick();">검색</button>
                           </div>
          <div id="excuteDiv">
                           
                <div class="bottom_10 fl select_area3"></div>
                	<select class="select" id="demoOption" onchange=optionSelect();>
                        <option value="firmSearch">업체별 보관량 검증(실적보고)</option>
                        <option value="firmDemo">업체별 배출량 검증</option>
                    </select>
                <!-- table-->
                <div class="table_area3" id="firmSearch">
                    <table width="100%" cellspacing="0" cellpadding="0" class="table" id="firmTb">
                        <thead>
                          <tr>
                            <th scope="col">업체명</th>
                            <th scope="col">폐기물 종류</th>
                            <th scope="col">선택</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <button type="button" class="btn_select">선택</button>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                    <!-- 페이징 -->
    
    <!-- 페이징 끝 -->
                </div>
               
               <div id="firmDemo">
	               <div class="table_area3">
	                    <table width="40%" cellspacing="0" cellpadding="0" class="table" id="emisTb">
	                        <thead>
	                          <tr>
	                            <th scope="col">업체명</th>
	                            <th scope="col">폐기물 종류</th>
	                            <th scope="col">선택</th>
	                          </tr>
	                        </thead>
	                        <tbody>
	                          <tr>
	                            <td>-</td>
	                            <td>-</td>
	                            <td>
	                                <button type="button" class="btn_select">선택</button>
	                            </td>
	                          </tr>
	                        </tbody>
	                    </table>
	                </div>             
	                <div class="right-panel">
					    <!-- Chart.js 그래프 영역 -->
					    <div class="chart-container">
					        <canvas id="myChart"></canvas>
					    </div>
					    <!-- 입력 필드 및 버튼 -->
					    <div class="input_area">
					        <input type="text" id="inputValue" placeholder="(ton)값을 입력하세요">
					        <button type="button" id="submitBtn">확인</button>
					    </div>
					</div>
				</div>
          </div>
	</div>
<!-- column -->
</body>