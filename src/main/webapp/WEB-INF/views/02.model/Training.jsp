<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
   
<%
    String modelId = request.getParameter("modelId") != null ? request.getParameter("modelId") : "";
    String callTrainChk = request.getParameter("callTrainChk") != null ? request.getParameter("callTrainChk") : "0";
    String reTrainChk = request.getParameter("reTrainChk") != null ? request.getParameter("reTrainChk") : "0";
%>

<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
<style>
        .slider-container {
            position: relative;
            width: 95%; /* 슬라이더의 전체 길이 */
            margin: 20px;
        }

        .slider-track {
            position: relative;
            height: 10px;
            background-color: #ddd;
            border-radius: 5px;
        }

        .slider-bar {
            position: absolute;
            height: 100%;
            background-color: #2196F3; /* 바 색상 */
            border-radius: 5px;
        }

        .slider-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border: 2px solid #2196F3; /* 핸들 색상 */
            border-radius: 50%;
            cursor: pointer;
            top: -5px; /* 핸들이 트랙 위에 나타나도록 설정 */
        }

        .tooltipp {
            position: absolute;
            background-color: #68cea1; /* 투명한 파란색 */
            color: white; /* 텍스트 색상 */
            padding: 5px;
            border-radius: 3px;
            transform: translate(-50%, -0); /* 핸들 위에 위치시키기 */
            white-space: nowrap;
            z-index: 10; /* 다른 요소보다 위에 표시되도록 설정 */
            font-size: 14px; /* 글자 크기 조절 */
            width: 45px; /* 툴팁의 고정 너비 */
            text-align: center; /* 텍스트 중앙 정렬 */
            visibility: visible; /* 항상 보이도록 설정 */
            top: 20px; /* 툴팁을 핸들에서 떨어뜨림 */
        }

        .slider-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        
        .graph_area img {
		    width: 100%;
		    height: 100%;
		}
		
		/* Modal 배경 */
        .modal {
            display: none; /* 기본적으로 숨김 */
            position: fixed;
            z-index: 1; /* 가장 위에 표시 */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4); /* 반투명 검은 배경 */
            overflow: auto;
        }

        /* Modal 내용 */
        .modal-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 20px;
            border-radius: 8px;
            width: 300px; /* 크기 조정 */
            text-align: center;
            position: relative; /* X 버튼을 절대 위치로 배치하기 위한 설정 */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* 그림자 */
        }

        /* 닫기 버튼 */
        .close {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
        }
        
        /* 모달 내부 textarea 스타일 */
		.modal-content textarea {
		    width: 100%;
		    height: 200px;
		    padding: 10px;
		    margin: 15px 0;
		    border: 1px solid #ddd;
		    border-radius: 4px;
		    font-size: 14px;
		    box-sizing: border-box;
		    resize: none; /* 크기 조정 막기 */
		    background-color: #f9f9f9; /* 연한 배경 */
		    transition: border-color 0.3s ease, box-shadow 0.3s ease;
		}
		
		.modal-content textarea:focus {
		    border-color: #4CAF50;
		    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); /* 초록색 그림자 */
		    outline: none;
		}
        
       /* 입력 필드 */
		.input-row {
		    display: flex;
		    justify-content: space-between;
		    align-items: center;
		    gap: 5px; /* 입력 필드 간 간격 */
		    margin: 15px 0;
		}
		
		.input-row input {
		    flex: 1; /* 입력 필드가 균등하게 크기를 가짐 */
		    max-width: 80px; /* 입력 필드의 최대 너비 */
		    padding: 8px; /* 내부 여백 */
		    border: 1px solid #ddd;
		    border-radius: 4px;
		    font-size: 14px;
		    box-sizing: border-box;
		    transition: border-color 0.3s ease;
		}
		
		.input-row input:focus {
		    border-color: #4CAF50;
		    outline: none;
		}
	        

        /* 입력 필드와 전송 버튼 스타일 */
        .input-container {
            margin: 0px 0;
        }

        .input-container input {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .input-container button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;
        }

        .input-container button:hover {
            background-color: #45a049;
        }

        /* 타이틀 스타일 */
        h2 {
            font-size: 18px;
            color: #333;
            font-weight: 600;
        }
</style>
  
    <!-- Custom CSS -->
</head>

<body>
<script src="js/model/modeltrain.js?ver=1.5"></script>

<input type="hidden" id="callTrainChk" value="<%= callTrainChk %>">
<input type="hidden" id="reTrainChk" value="<%= reTrainChk %>">
<input type="hidden" id="reTrainId" value="<%= modelId %>">
<input type="hidden" id="reTrainDataChk" value="">
<input type="hidden" id="algorithmVal" value="">
<input type="hidden" id="algorithmType" value="">
<input type="hidden" id="selectedTb" value="">
<input type="hidden" id="tbColList" value="">
<input type="hidden" id="chkObject" value="0">
<input type="hidden" id="season" value="">

<form id="hiddenUploadForm" action="/uploadFile" method="post" enctype="multipart/form-data" style="display: none;">
    <input type="file" id="fileInput" name="file" accept=".csv" onchange="uploadFile()">
</form>

<!-- 모달 -->
    <div id="reTrainModal" class="modal">
        <!-- 모달 내용 -->
        <div class="modal-content">
            <span class="close" onclick="reTrainClose();">&times;</span>
            <h2>기존 데이터를 사용하시겠습니까?</h2>

            <!-- 모델 이름 입력 필드 -->
            <div class="input-container">
                <button id="submitBtnn1">기존</button>
                <button id="submitBtnn2">신규</button>
            </div>
        </div>
    </div>
    
    <div id="sqlModal" class="modal">
        <!-- 모달 내용 -->
        <div class="modal-content">
        	<h5>쿼리 확인</h5>
            <span class="close" onclick="sqlClose();">&times;</span>
            <textarea id="sqltext" disabled></textarea>
				<!-- <h2>범위 입력</h2> -->
                <div class="input-row">
		            적용 범위 : <input type="text" id="offset" placeholder="0">
		            <span>~</span>
		            <input type="text" id="fetch" placeholder="1000">
		        </div>
            <!-- 모델 이름 입력 필드 -->
            <div class="input-container">
                <button id="sqlSubmit" onclick="trainQuery();">적용</button>
            </div>
        </div>
    </div>

            <!-- <div class="input-row" style="justify-content: flex-start; margin:10px 0;">
                <input type="checkbox" style="max-width:20px;" id="seasonalCheck" onchange="toggleSeasonCheckboxes();" />
                <label for="seasonalCheck" style="margin-left:5px;">계절성 여부</label>
            </div> -->
<div id="modelModal" class="modal">
    <!-- 모달 내용 -->
    <div class="modal-content">
        <span class="close" onclick="modalClose();">&times;</span>
        <h2>저장할 모델 이름을 입력하세요</h2>
        
        <!-- 모델 이름 입력 및 옵션 -->
        <div class="input-container">
            <input type="text" id="modalModelName" placeholder="모델 이름을 입력하세요" />
            
            <!-- 계절성 여부 체크박스 -->
            <div class="input-row" style="justify-content: flex-start; margin:10px 0;">
                <input type="checkbox" style="max-width:20px;" id="seasonalCheck" onchange="toggleSeasonCheckboxes();" />
                <label for="seasonalCheck" style="margin-left:5px;">계절성 여부</label>
            </div>
            
            <!-- 선택된 계절 값을 저장할 hidden input -->
            <input type="hidden" id="season" value="">
            
            <!-- 계절 선택 옵션 (초기 숨김, 가로 정렬 및 가운데 정렬) -->
            <div id="seasonOptions" style="display: none; margin-bottom:10px; justify-content: center; align-items: center; gap: 10px;">
                <label style="display: inline-flex; align-items: center;">
                    <input type="checkbox" class="season-checkbox" name="season" value="spring" onclick="handleSeasonSelection(this);" style="margin-right:5px;">
                    봄
                </label>
                <label style="display: inline-flex; align-items: center;">
                    <input type="checkbox" class="season-checkbox" name="season" value="summer" onclick="handleSeasonSelection(this);" style="margin-right:5px;">
                    여름
                </label>
                <label style="display: inline-flex; align-items: center;">
                    <input type="checkbox" class="season-checkbox" name="season" value="fall" onclick="handleSeasonSelection(this);" style="margin-right:5px;">
                    가을
                </label>
                <label style="display: inline-flex; align-items: center;">
                    <input type="checkbox" class="season-checkbox" name="season" value="winter" onclick="handleSeasonSelection(this);" style="margin-right:5px;">
                    겨울
                </label>
            </div>
            
            <button id="submitBtn" onclick="insertModelInfo();">모델확정</button>
        </div>
    </div>
</div>

<script>
// 계절성 여부 체크박스 선택/해제에 따라 계절 옵션 영역을 토글합니다.
function toggleSeasonCheckboxes(){
    var seasonalCheck = document.getElementById("seasonalCheck");
    var seasonOptions = document.getElementById("seasonOptions");
    if(seasonalCheck.checked){
        seasonOptions.style.display = "flex";  // flex 적용으로 가로 정렬
    } else {
        seasonOptions.style.display = "none";
        // 숨겨질 때 모든 계절 체크박스를 초기화하고 활성화, hidden input도 초기화
        var checkboxes = document.querySelectorAll(".season-checkbox");
        checkboxes.forEach(function(cb){
            cb.checked = false;
            cb.disabled = false;
        });
        document.getElementById("season").value = "";
    }
}

// 하나의 계절 체크박스 선택 시 나머지를 비활성화하고, hidden input에 해당 값을 설정합니다.
// 선택 해제 시 hidden input을 비우고 모두 활성화합니다.
function handleSeasonSelection(selectedCheckbox){
    var seasonMapping = {
        "spring": "spring",
        "summer": "summer",
        "fall": "autumn",
        "winter": "winter"
    };
    
    var seasonInput = document.getElementById("season");
    var checkboxes = document.querySelectorAll(".season-checkbox");
    
    if(selectedCheckbox.checked){
        // hidden input에 매핑된 값을 설정
        seasonInput.value = seasonMapping[selectedCheckbox.value] || "";
        // 선택한 체크박스 외에는 비활성화
        checkboxes.forEach(function(cb){
            if(cb !== selectedCheckbox){
                cb.disabled = true;
            }
        });
    } else {
        // 체크 해제 시 hidden input 비우기
        seasonInput.value = "";
        // 모든 체크박스 활성화
        checkboxes.forEach(function(cb){
            cb.disabled = false;
        });
    }
}
</script>
    <!-- <div id="modelModal" class="modal">
        모달 내용
        <div class="modal-content">
            <span class="close" onclick="modalClose();">&times;</span>
            <h2>저장할 모델 이름을 입력하세요</h2>
			
            모델 이름 입력 필드
            <div class="input-container">
                <input type="text" id="modalModelName" placeholder="모델 이름을 입력하세요" />
                <button id="submitBtn" onclick="insertModelInfo();">모델확정</button>
            </div>
        </div>
    </div> -->
    
    <div class="title_area">
        <div class="title fl"><img src="images/icon_02.png"> 모델학습 
        	<span class="tooltip-bottom" data-tooltip="사용자 목적에 맞는 모델을 학습 할 수 있습니다.">
			<i class="fas fa-question-circle .tooltip-icon"></i>
			</span>
        </div>
    </div> <!-- title_area -->

    <div class="clear"></div>

    <div class="right_contents">
    	<div class="tab_area">
    	
            <div class="tab_menu_on mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('trainMode');">
	                <div class="text_center pad_25" style="padding: 25px;">
	                    <img src="images/check_on.png" class="icon_check"> <span>학습유형 선택</span>
	                </div>
                </a>
            </div>
            
            <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('dataTypeSelect');">
	                <div class="text_center pad_25" style="padding: 25px;">
	                    <img src="images/check_on.png" class="icon_check"> <span>데이터유형 선택</span>
	                </div>
                </a>
            </div>
            
            <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('cleaningData');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>데이터 탐색</span>
	                </div>
                </a>
            </div>
            
            <!-- <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('filteringData');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>특징 선택</span>
	                </div>
                </a>
            </div> -->
            
            <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('algorithmSelect');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>알고리즘 선택</span>
	                </div>
                </a>
            </div>
            
            <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('algorithmDetail');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>학습 세부 조정</span>
	                </div>
                </a>
            </div>
            
            <div class="tab_menu_off mr">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('trainResult');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>학습 실행</span>
	                </div>
                </a>
            </div>
            
            <div class="tab_menu_off">
                <a href="javascript:void(0)" onclick="javascript:displaySelector('fixModel');">
	                <div class="text_center pad_25">
	                    <img src="images/check_off.png" class="icon_check"> <span>모델 배포</span>
	                </div>
                </a>
            </div>
            
        </div> <!-- tab_area -->
            
            <!-- train div -->
				<div id="trainDiv">
					<div class="model_arae" id="trainMode" style=display:none;>
					<div class="model_box">
					    <a href="javascript:void(0);" onclick="gridDataTypeSelect();" class="mr_100"><span>신규 학습</span></a> 
					    <a href="javascript:void(0);" onclick="requestReTrainList();"><span>모델 재학습</span></a> 
					</div>
	                </div> 
					
					<div class="select_area" id="reTrainMode" style=display:none;>
	                </div>
	                
	                <div class="model_arae" id="dataTypeSelect" style=display:none;>
	                	<div class="upload_box">
						    <div class="img_area"><img src="images/icon_file.png"></div>
						    <div class="btn_area" onclick="selectFile();">
						        <button type="button" class="btn_upload">파일 업로드</button>
						    </div>
						</div>
						
						<div class="upload_box">
						    <div class="img_area"><img src="images/icon_data.png"></div>
						    <div class="btn_area" onclick="requestTableList();">
						        <button type="button" class="btn_upload">DATA BASE 업로드</button>
						    </div>
						</div>
	                </div>
					
					<div id="dataBaseView" style=display:none;>
						<!-- column -->
						<div class="graph_area mt_10">
	                        <div class="graph_box mr">
	                                <div class="card-title ">테이블 리스트</div>
	                                <!-- table-->
	                                <div class="bottom_10 table_area3_1" id="tableList">
	                                </div>
	                        </div>
							<div class="graph_box mr">
	                                <!-- table-->
	                                <div class="card-title" style="">테이블 필드 정보</div>
	                                <div class="bottom_10 table_area3_2" id="tableInfo">
	                                </div>
							</div>
							<div class="graph_box">
	                                <!-- table-->
		                                <div class="card-title">조회 SQL
		                                	<span class="tooltip-bottom" data-tooltip="쿼리를 실행해하거나 학습데이터로 사용 가능합니다. 10000건 이상의 학습에는 적합하지 않습니다.">
											<i class="fas fa-question-circle .tooltip-icon"></i>
											</span>
		                                </div>
	                                <div class="bottom_10 table_area3_3" id="makeSQL">
	                                </div>
	                                <div class="bottom_10 fr">
	                                    <button type="button" class="btn2" onclick="excuteQuery();">쿼리실행</button>
	                                    <button type="button" class="btn" onclick="sqlModal();">적용하기</button>
	                                </div>
							</div>
						</div>
	
						<div class="graph_area">
	                            <div class="graph_box2">
	                                <div class="card-title fl">데이터 조회</div>
	                                <!-- table-->
	                                <div class="table_area3_4" id="sqlQueryList">
	                                    <table width="100%" cellspacing="0" cellpadding="0" class="table">
	                                        <thead>
	                                          <tr>
	                                            <th scope="col">Columns</th>
	                                          </tr>
	                                        </thead>
	                                        <tbody>
	                                          <tr>
	                                            <td>contents</td>
	                                          </tr>
	                                        </tbody>
	                                    </table>
	                                </div>
	                    		</div>
						</div>
				</div> <!-- row -->
					
				<div id="cleaningData" style=display:none;>
					
                </div>	
				
				<div id="filteringData" style=display:none;>
				</div>
				
				<div class="model_arae" id="algorithmSelect" style=display:none;>
                </div>
                
				<!-- <div class="col-lg-6">
					<div>
						<div class="card-body upload_box">
							
						</div>
					</div>
				</div> -->
				<!-- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@알고리즘 디테일 선택 -->
				<div id="algorithmDetail" style=display:none;>
				</div>
				<!-- 알고리즘 디테일 선택 -->
				
				<div class="graph_area mt_20" id="trainResult" style=display:none;>
                </div>
				
				<div class="select_area" id="fixModel">
                    <ul>
                        <li><h3>시계열모델 재학습이 완료 되었습니다.</h3></li>
                        <li><h3>모델관리에서 모델의 정보를 확인 할 수 있습니다.</h3></li>
                        <li><button type="button" class="btn_upload mt_20">모델 관리</button></li>
                    </ul> 
                </div>
					
            </div>
    </div>
</body>

</html>