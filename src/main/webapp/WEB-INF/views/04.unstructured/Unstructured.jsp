<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="dist/images/favicon.png">
    <title>i QratorPlus</title>
  
    <!-- Custom CSS -->
    <link href="dist/css/style.min.css" rel="stylesheet">
    <link href="dist/css/style_contents.css" rel="stylesheet">
</head>

<div class="container-fluid">
<script src="js/unstruct/unstruct.js?ver=1.4"></script>

				<div class="row">
					<!-- column -->
					<div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                
                                <div class="graph_area_fl">
                                    <h4 class="card-title">문장 속성 분류</h4>
                                    <textarea placeholder="문장을 입력해 주세요."></textarea>
                                </div> <!-- graph_area_fl -->

                                <div class="graph_area_fr" id="nerColumn">
                                    <h4 class="card-title">기간</h4>
                                    <div class="mtb_1020"> 
                                        <input type="text" class="text_box3">
                                    </div>

                                    <h4 class="card-title">날짜</h4>
                                    <div class="mtb_1020"> 
                                        <input type="text" class="text_box3">
                                    </div>

                                    <h4 class="card-title">기관</h4>
                                    <div class="mtb_1020"> 
                                        <input type="text" class="text_box3">
                                    </div>

                                    <h4 class="card-title">단체</h4>
                                    <div class="mtb_1020"> 
                                        <input type="text" class="text_box3">
                                    </div>
                                    <button type="button" class="btn waves-effect waves-light btn-sm btn-secondary fr">분류</button>
                                </div> <!-- graph_area_fr -->
                                
                            </div>
                        </div>
                    </div>
					<!-- column -->
				</div> <!-- row -->
                
            </div>