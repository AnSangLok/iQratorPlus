<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
    <script src="js/moniter/moniter.js" defer></script>
 	<!-- <script src="js/common/chart.js" defer></script> -->
</head>


               <div class="title_area">
	                <div class="title fl"><img src="images/icon_05.png"> 모니터링 
	                	<span class="tooltip-bottom" data-tooltip="자원이나 모델의 현황을 확인 할 수 있습니다.">
						<i class="fas fa-question-circle .tooltip-icon"></i>
						</span>
	                </div>
	                <div class="fr"></div>
	            </div> <!-- title_area -->

            <div class="clear"></div>
            
            <div class="right_contents" id="moniterView">
            	<div class="graph_area">
                    <div class="graph_box mr">
                        <h4 class="card-title">API별 CPU 사용률</h4>
                        <canvas id="graph_resource" width="450" height="450" style="margin: 0 auto;"></canvas>
                    </div>
                    <div class="graph_box">
                        <h4 class="card-title">모델별 호출회수</h4>
                        <canvas id="graph_callApiCnt" width="450" height="450" style="margin: 0 auto;"></canvas>
                    </div>
                    <div class="graph_box mr">
                        <h4 class="card-title">알고리즘 유형</h4>
                        	<canvas id="graph_algorithm" width="450" height="450" style="margin: 0 auto;"></canvas>
                    </div>
                </div>
            </div>  <!-- row -->
                
	                   <!-- <div class="col-lg-4 col-md-12">
	                       <div class="card">
	                           <div class="card-body" style="text-align: center;">
	                               <h4 class="card-title">알고리즘 유형</h4>
	                               <canvas id="graph_algorithm" width="500" height="500" style="margin: 0 auto;"></canvas>
	                           </div>
	                       </div>
	                   </div>
	                   <div class="col-lg-4 col-md-12" style="text-align: center;">
	                       <div class="card">
	                           <div class="card-body">
	                               <h4 class="card-title">API별 CPU 사용률</h4>
	                           </div>
	                       </div>
	                   </div>
	                   <div class="col-lg-4 col-md-12" style="text-align: center;">
	                       <div class="card">
	                           <div class="card-body">
	                               <h4 class="card-title">모델별 호출회수</h4>
	                               <canvas id="graph_callApiCnt" width="500" height="500" style="margin: 0 auto;"></canvas>
	                           </div>
	                       </div>
	                   </div> -->
	               <!-- *************************************************************** -->
	               <!-- End First Cards -->
	               <!-- *************************************************************** -->
	               
           
           
           