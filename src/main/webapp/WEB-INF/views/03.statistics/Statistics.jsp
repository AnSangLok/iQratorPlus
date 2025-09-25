<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

	<!DOCTYPE html>
	<html dir="ltr" lang="en">

	<head>
	</head>

	<body>
		<script src="js/statistics/statistics.js" defer></script>
		<div class="title_area">
            <div class="title fl"><img src="images/icon_03.png"> 학습통계 
            	<span class="tooltip-bottom" data-tooltip="학습 횟수에 따른 학습지표를 확인할 수 있습니다.">
				<i class="fas fa-question-circle .tooltip-icon"></i>
				</span>
            </div>
        </div> <!-- title_area -->

        <div class="clear"></div>

		<div class="right_contents">

				<div class="graph_area">
					<div class="graph_box">
							<div class="graph_area_fl">
								<div class="table_area5" id="sttsTb">
									<table width="100%" cellspacing="0" cellpadding="0" class="table">
										<thead>
											<tr>
												<th scope="col" width="40%">모델명</th>
												<th scope="col" width="25%">데이터셋명</th>
												<th scope="col" width="15%">정확도</th>
												<th scope="col" width="10%">학습횟수</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>지역별 보관량 예측 모델</td>
												<td>시계열_데이터.csv</td>
												<td>92%</td>
												<td>12회</td>
											</tr>
											<tr>
												<td>업체&폐기물별 이상치 검증</td>
												<td>폐기물_데이터.csv</td>
												<td>89%</td>
												<td>15회</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div> <!-- graph_area_fl -->

							<div class="graph_area_fr">
								<h4 class="card-title">R2_SCORE 그래프 
									<span class="tooltip-bottom" data-tooltip="예측 오차를 실제 값에 대해 백분율로 나타낸 지표로, 예측의 상대적 정확도를 평가합니다. 값이 작을수록 예측 정확도가 높습니다.(값이 작을수록 좋습니다.)">
									<i class="fas fa-question-circle .tooltip-icon"></i>
									</span>
								</h4>
								<div class="mtb_1020" style="text-align: center;">
									<canvas id="graph_r2" width="400" height="180" style="margin: 0 auto;"></canvas>
								</div>
							
								<h4 class="card-title">MSE 그래프 
									<span class="tooltip-bottom" data-tooltip="예측 값과 실제 값 간의 차이를 제곱하여 평균을 구한 값으로, 예측 오차의 크기를 나타냅니다. 값이 작을수록 모델의 예측이 정확하다는 의미입니다. (값이 작을수록 좋습니다.)">
									<i class="fas fa-question-circle .tooltip-icon"></i>
									</span>
								</h4>
								<div class="mtb_1020" style="text-align: center;">
									<canvas id="graph_mse" width="400" height="180" style="margin: 0 auto;"></canvas>
								</div>

								<h4 class="card-title">RMSE 그래프 
									<span class="tooltip-bottom" data-tooltip="MSE의 제곱근으로, 예측 오차의 크기를 원래 단위로 변환하여 직관적으로 이해할 수 있게 합니다. 값이 작을수록 모델의 예측 정확도가 높습니다. (값이 작을수록 좋습니다.)">
									<i class="fas fa-question-circle .tooltip-icon"></i>
									</span>
								</h4>
								<div class="mtb_1020" style="text-align: center;">
									<canvas id="graph_rmse" width="400" height="180" style="margin: 0 auto;"></canvas>
								</div>

								<h4 class="card-title">MAPE 그래프 
									<span class="tooltip-bottom" data-tooltip="예측 오차를 실제 값에 대해 백분율로 나타낸 지표로, 예측의 상대적 정확도를 평가합니다. 값이 작을수록 예측 정확도가 높습니다.(값이 작을수록 좋습니다.)">
									<i class="fas fa-question-circle .tooltip-icon"></i>
									</span>
								</h4>
								<div class="mtb_1020" style="text-align: center;">
									<canvas id="graph_mape" width="400" height="180" style="margin: 0 auto;"></canvas>
								</div>
							</div> <!-- graph_area_fr -->

					</div>
				</div>
		</div>
	</body>
	
	
