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
</style>

</head>

<body>
	<input type="hidden" id="MODEL_ORG_NAME" value=>
	<input type="hidden" id="TARGET_VAL" value=>
	<input type="hidden" id="TRAIN_DATA_FILE" value=>
	<input type="hidden" id="MODEL_ID" value=>
	<input type="hidden" id="ALGORITHM_TYPE" value=>
	
	<script src="js/model/modelexcute.js?ver=1.05"></script>
			<div class="title_area">
                <div class="title fl"><img src="images/icon_02.png"> 모델검증 
		        	<span class="tooltip-bottom" data-tooltip="학습된 모델을 테스트 할 수 있습니다.">
					<i class="fas fa-question-circle .tooltip-icon"></i>
					</span>
                </div>
            </div> <!-- title_area -->
            
            <div class="clear"></div>
            
			
            <div class="right_contents">
            
	            <div class="bottom_10 fl select_area3">
	                <select class="select" id="modelOpt" onchange="selectOpt();">
	                </select>
	            </div>
                           <div class="bottom_10 fr" id="searchTab" style="display:;">
                               <input type="text" class="text_box2" id="placeholder" placeholder="업체명 검색">
                               <button type="button" class="btn waves-effect waves-light btn-sm btn-secondary btn_search">검색</button>
                           </div>
                           
                           <div id="excuteDiv">
                            <div id="cluster" style=display:none;>
                             <div class="table_area3">
                                 <table width="100%" cellspacing="0" cellpadding="0" class="table">
                                     <thead>
                                       <tr>
                                         <th scope="col">업체명</th>
                                         <th scope="col">폐기물 종류</th>
                                         <th scope="col">선택</th>
                                       </tr>
                                     </thead>
                                     <tbody>
                                       <tr>
                                         <td>심창기업(주)</td>
                                         <td>생활폐기물</td>
                                         <td>
                                             <button type="button" onclick="selectCompany();" class="btn_select">선택</button>
                                         </td>
                                       </tr>
                                       <tr>
                                         <td>명월산업</td>
                                         <td>폐합성수지류</td>
                                         <td>
                                             <button type="button" onclick="selectCompany();" class="btn_select">선택</button>
                                         </td>
                                       </tr>
                                     </tbody>
                                 </table>
                             </div>
                            </div>
                            
                            <div class="graph_area" id="eval" style=display:none;>
			                    <div class="graph_box">
			                        <h4 class="card-title">A업체 배출량 학습 결과 그래프</h4>
			                        <div class="graph">
			                            	그래프 영역
			                        </div>                        
			                        <div class="fr mt_20">
			                            <p>배출량 (KG) : <input type="text" class="text_box2" placeholder="배출량"><button class="btn waves-effect waves-light btn-sm btn-secondary">검증</button></p>
			                            <p class="mt_10">검증결과 : <span class="color_normal">정상수치</span> or <span class="error_normal">이상수치</span></p>
			                        </div>
			                    </div>
			                </div>
                            
                            <div id="eval" style=display:none;>
                            	<div class="bar">
                                 <h4 class="card-title mt_20">A업체 배출량 학습 결과 그래프</h4>
                                 <div id="graph_area"> <!-- style 삭제 요망 -->
                                     	<img src="images/a.png">
                                 </div>
                                 <div class="fr mt_20">
                                     <p>배출량 (KG) : <input type="text" class="text_box2" placeholder="배출량"><button class="btn waves-effect waves-light btn-sm btn-secondary">검증</button></p>
                                     <p>검증결과 : <span class="color_normal">정상수치</span> or <span class="error_normal">이상수치</span></p>
                                 </div>
                             </div>
                            </div>
                           
                           <div class="bottom_10 fl select_area3">
                    <select class="select">
                        <option>업체 & 폐기물별 이상치 검증</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>
                <div class="bottom_10 fr">
                    <input type="text" class="text_box2" placeholder="업체명 검색">
                    <button type="button" class="btn waves-effect waves-light btn-sm btn-secondary btn_search">검색</button>
                </div>
                            
                   <div class="graph_area mt_20" id="regression" style=display:none;>
                    <div class="graph_box mr">
                        <h4 class="card-title">학습 데이터</h4>
                        <div class="bottom_10 fr">
                            <button class="btn_date">분기별</button>
                            <button class="btn_date">년별</button>
                            <input type="date" class="input_date"> ~ <input type="date" class="input_date">
                        </div>
                        <div class="clear"></div>
                        <div class="graph">그래프 영역</div>
                    </div>
                    <div class="graph_box">
                        <h4 class="card-title">예측 모델 그래프</h4>
                        <div class="bottom_10 fr">
                            <button class="btn_date">분기별</button>
                            <button class="btn_date">년별</button>
                            <input type="date" class="input_date"> ~ <input type="date" class="input_date">
                        </div>
                        <div class="clear"></div>
                        <div class="graph">그래프 영역</div>
                    </div>
                </div>
                           </div>
	</div>
<!-- column -->
</body>