<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header class="header">
    <div class="logo"><img src="images/logo.png" style=height:70px;>올바로 머신러닝 시스템</div>
    <div class="admin">
		<c:choose>
            <c:when test="${not empty loginUser}">
                ${loginUser}(관리자) <!-- 로그인한 사용자 ID 출력 -->
            </c:when>
            <c:otherwise>
                Admin(관리자) <!-- 기본값 -->
            </c:otherwise>
        </c:choose>
	    <form action="/logout" method="get" style="display: inline;">
		    <button class="logout_button_style" type="submit">로그아웃</button>
		</form>
    </div>
</header>
<div style="display: none;" id="load"><img src="images/loading.gif"></div>
<!-- <header class="topbar" data-navbarbg="skin6">
    <nav class="navbar top-navbar navbar-expand-md">
        <div class="navbar-header" data-logobg="skin6">
            <a class="nav-toggler waves-effect waves-light d-block d-md-none" href="javascript:void(0)">
                <i class="ti-menu ti-close"></i>
            </a>
            <div class="navbar-brand">
                <a href="dashboard">
                    <b class="logo-icon" style="margin-right: -3px;">
                        <img src="images/logo-icon.png" alt="homepage" class="dark-logo" />
                        <img src="images/logo-icon.png" alt="homepage" class="light-logo" />
                    </b>
                    <span class="logo-text">
                        <img src="images/logo-text.png" alt="homepage" class="dark-logo" />
                    </span>
                </a>
            </div>
            <a class="topbartoggler d-block d-md-none waves-effect waves-light" href="javascript:void(0)" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i class="ti-more"></i>
            </a>
            <div style="display: none;" id="load"><img src="images/loading.gif"></div>  loading display:none or show
        </div>
    </nav>
</header> -->
