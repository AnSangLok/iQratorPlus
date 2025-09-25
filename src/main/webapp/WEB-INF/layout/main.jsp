<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>

<html dir="ltr" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>올바로 머신러닝 시스템</title>
    
    <link rel='stylesheet' href='css/style.css'>
    <link rel='stylesheet' href='css/nav_style.css'>
    <script src="js/common/jquery-latest.min.js"></script>
    <script src="js/nvi_menu.js"></script>
	<script src="js/common/chart.js"></script>
	<script src="js/common/d3.min.js"></script>
	<script src="js/common/c3.min.js"></script>
    
    <!-- <script src="js/common/jquery-3.6.0.min.js"></script> -->
    <!-- <link href="css/c3.min.css" rel="stylesheet"> -->
    <!-- <link rel="stylesheet" href="css/c3.min.css"> -->
    <!-- <link href="css/style.min.css" rel="stylesheet">
    <link href="css/style_contents.css" rel="stylesheet"> -->
</head>
<body>
    <div class="preloader">
        <div class="lds-ripple">
            <div class="lds-pos"></div>
            <div class="lds-pos"></div>
        </div>
    </div>
	<div id="Wrap">
    <!-- <div id="main-wrapper" data-theme="light" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed" data-boxed-layout="full"> -->

        <%-- 헤더와 사이드바를 Tiles로 삽입 --%>
        <tiles:insertAttribute name="header"/>
        <tiles:insertAttribute name="top"/>
        
        <div class="cont_wrap">
        	<div class="left">
        		<tiles:insertAttribute name="left"/>
	            <tiles:insertAttribute name="footer"/>
        	</div>
        	<main class="right">
	            <tiles:insertAttribute name="right"/>
        	</main>
        </div>

        <%-- <div class="page-wrapper">
            메인 콘텐츠와 푸터를 Tiles로 삽입
        </div> <!-- page-wrapper --> --%>
    </div> <!-- main-wrapper -->
    
    
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="libs/jquery/dist/jquery.min.js"></script>
    <script src="libs/popper.js/dist/umd/popper.min.js"></script>
    <script src="libs/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- apps -->
    <!-- apps -->
    <script src="js/app-style-switcher.js"></script>
    <script src="js/feather.min.js"></script>
    <script src="libs/perfect-scrollbar/dist/perfect-scrollbar.jquery.min.js"></script>
    <script src="js/sidebarmenu.js"></script>
    <!--Custom JavaScript -->
    <script src="js/custom.min.js"></script>
    <!--This page JavaScript -->
    <!-- <script src="assets/extra-libs/c3/d3.min.js"></script>
    <script src="assets/extra-libs/c3/c3.min.js"></script> -->
    <script src="libs/chartist/dist/chartist.min.js"></script>
    <script src="libs/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.min.js"></script>
    <!-- <script src="extra-libs/jvector/jquery-jvectormap-2.0.2.min.js"></script>
    <script src="extra-libs/jvector/jquery-jvectormap-world-mill-en.js"></script> -->
    <script src="js/pages/dashboards/dashboard1.min.js"></script>
    
    <!-- <script src="js/common/common.js"></script>
    <script src="js/common/jquery-3.6.0.min.js"></script>
    <script src="js/common/jquery-latest.min.js"></script> -->
</body>
</html>