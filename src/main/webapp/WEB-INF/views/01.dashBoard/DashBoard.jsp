<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html dir="ltr" lang="en">

<body>
    <script src="js/dashboard/dashboard.js"></script>

    <div class="title_area">
        <div class="title fl"><img src="images/icon_01.png"> 대시보드
        </div>
        <div class="fr">
        </div>
    </div> <!-- title_area -->

    <div class="clear"></div>

    <div class="right_contents">
        
        <div class="count_area">
            <div class="card-body">
                <div class="text_center border-right">
                    <h2 id="totalCnt"><span class="count">count</span></h2>
                    <h5 class="color_gray">모델 개수</h5>
                </div>
            </div>
            <div class="card-body">
                <div class="text_center border-right">
                    <h2 id="activeCnt"><span class="count">count</span></h2>
                    <h5 class="color_blue">실행중</h5>
                </div>
            </div>
            <div class="card-body">
                <div class="text_center">
                    <h2 id="deactiveCnt"><span class="count">count</span></h2>
                    <h5 class="color_yellow">대기중</h5>
                </div>
            </div>
        </div> <!-- count_area -->

        <div class="graph_area mt_20">
            <div class="graph_box mr">
                <h4 class="card-title" id="modelName">모델 학습 현황</h4>
               	<canvas id="modelGraph" width="550px" height="230px" style="margin: 0 auto;"></canvas>
            </div>
            <div class="graph_box">
                <h4 class="card-title">API 호출 현황</h4>
                <canvas id="apiCnt" width="230px;" height="230px;" style="margin: 0 auto;"></canvas>
            </div>
        </div>

        <div class="graph_area">
            <div class="graph_box mr">
                <h4 class="card-title">알고리즘 사용 현황</h4>
                <div class="graph">
					<canvas id="algorithmDetail" width="550px;" height="230px;" style="margin: 0 auto;"></canvas>
				</div>
            </div>
            <div class="graph_box">
                <h4 class="card-title"> 그래프</h4>
                <div>
					<canvas id="trainModelGraph" width="550px" height="230px" style="margin: 0 auto;"></canvas>
				</div>
            </div>
        </div>

    </div>  <!--right_contents-->   
</body>

</html>