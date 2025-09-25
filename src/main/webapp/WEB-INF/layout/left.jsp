<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="left_contents">
    <!--사이드네비-->
    <div class="cssmenu">
        <ul>
            <li class="active"><a href='dashboard'><span><img src="images/icon_01.png">대시보드</span></a>
                <ul></ul>
            </li>
            <li class="has-sub"><a href='javascript:void(0)'><span><img src="images/icon_02.png">모델</span></a>
                <ul>
                    <li><a href="modelMgmt">모델관리</a></li> <!-- active 시에 hover 와 동일한 style 적용 요망 -->
                    <li><a href="model-tr">모델학습</a></li>
                    <li><a href="model-execute">모델검증</a></li>
                    <li><a href="model-test">시범서비스화면</a></li>
                </ul>
            </li>
            <li><a href='statisticsView'><span><img src="images/icon_03.png">학습통계</span></a>
                <ul></ul>
            </li>
            <!-- <li><a href='unstrutMgmt'><span><img src="images/icon_04.png">비정형 관리</span></a>
                <ul></ul>
            </li> -->
            <li><a href='moniteringView'><span><img src="images/icon_05.png">모니터링</span></a>
                <ul></ul>
            </li>
        </ul>
        <div class="ban_area">
            <img src="images/side_ban.png">
        </div>
    </div>
	<!--사이드네비-->
</div>  <!--left_contents-->
