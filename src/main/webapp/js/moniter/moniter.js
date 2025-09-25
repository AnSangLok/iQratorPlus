//function displaySelector(Id) {
//	
//	const trainDiv = document.getElementById("trainDiv");
//	const childDivs = trainDiv.children;
//	
//	Array.from(childDivs).forEach(child => {
//		if(child.tagName === "DIV") {
//			child.style.display = "none";
//		}
//	});
//	
//	document.getElementById(id).style.display = "";
//}
//
//function gridTrainMode() {
//	let setpId = "moniterView";
//	displaySelector(setpId);
//	let black = "";
//		
//	let resultStr = 
//		"<div class=\"col-lg-4 col-md-12\">\r\n" + 
//		"    <div class=\"card\">\r\n" + 
//		"        <div class=\"card-body\" style=\"text-align: center;\">\r\n" + 
//		"            <h4 class=\"card-title\">알고리즘 유형</h4>\r\n" + 
//		"            <canvas id=\"graph_algorithm\" width=\"500\" height=\"400\" style=\"margin: 0 auto;\"></canvas>\r\n" + 
////		"            <img src=\"C:/Users/irskorea/Desktop/화면설계/그림5.png\">\r\n" + 
//		"        </div>\r\n" + 
//		"    </div>\r\n" + 
//		"</div>\r\n" + 
//		"<div class=\"col-lg-4 col-md-12\" style=\"text-align: center;\">\r\n" + 
//		"    <div class=\"card\">\r\n" + 
//		"        <div class=\"card-body\">\r\n" + 
//		"            <h4 class=\"card-title\">API별 CPU 사용률</h4>\r\n" + 
////		"            <img src=\"C:/Users/irskorea/Desktop/화면설계/그림2.png\">\r\n" + 
//		"        </div>\r\n" + 
//		"    </div>\r\n" + 
//		"</div>\r\n" + 
//		"<div class=\"col-lg-4 col-md-12\" style=\"text-align: center;\">\r\n" + 
//		"    <div class=\"card\">\r\n" + 
//		"        <div class=\"card-body\">\r\n" + 
//		"            <h4 class=\"card-title\">모델별 호출회수</h4>\r\n" + 
////		"            <img src=\"C:/Users/irskorea/Desktop/화면설계/그림4.png\">\r\n" + 
//		"        </div>\r\n" + 
//		"    </div>\r\n" + 
//		"</div>";
//	
//	document.getElementById(setpId).innerHTML = resultStr;
//}

document.addEventListener("DOMContentLoaded", function() {
	
	getMonitoringAlgorithm();
	getMonitoringCallApiCnt();
	containerStatRequest();
	
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl current\"><a href=\"moniteringView\">모니터링</a></li>";
	topNav.innerHTML = navText;
	
});

function getMonitoringAlgorithm() {

	$.ajaxSetup({cache:false});
	$.ajax({
		contentType :  "application/json; charset=UTF-8",
		type : "POST",
		url : "selectMonitoringAlgorithm",
		cache: false,
		timeout : 30000,
		success : function(data) {
//			console.log(data);
			graphAlgorithm(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function graphAlgorithm(data) {

	let chartList = data;

	// x축 : 알고리즘
	let xs = chartList.map(function(item) {
        return item.algorithmType;
    });
	
	// y축 : 사용횟수
    var ys = chartList.map(function(item) {
        return item.cnt;
    });
    
	var ctx = document.getElementById('graph_algorithm').getContext('2d');
    var algorithmChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xs,
            datasets: [{
                label: '사용횟수',
                data: ys,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
        	responsive: false,
            scales: {
                y: {
                	beginAtZero: true
                }
            },
            plugins: {
            	legend: {
            		display: false
            	},
            }
        }
    });
}

function getMonitoringCallApiCnt() {

	$.ajaxSetup({cache:false});
	$.ajax({
		contentType :  "application/json; charset=UTF-8",
		type : "POST",
		url : "selectMonitoringCallApiCnt",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			graphCallApiCnt(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function graphCallApiCnt(data) {

	let chartList = data;

	// x축 : 모델명
	let xs = chartList.map(function(item) {
        return item.modelViewName;
    });
	
	// y축 : 호출횟수
    var ys = chartList.map(function(item) {
        return item.callApiCnt;
    });
    
	var ctx = document.getElementById('graph_callApiCnt').getContext('2d');
    var callApiCntChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: xs,
            datasets: [{
                label: '호출횟수',
                data: ys,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                hoverOffset: 4
            }]
        },
    });
}

function containerStatRequest() {
    $.ajax({
        url: 'getContainerStats', // Java Controller URL
        method: 'POST',
        success: function(data) {
        	console.log(data);
        	gridContainerStat(data);
        }
    });
}

function gridContainerStat(data) {
    const labels = [];
    const cpuData = [];
    const memData = [];

    // 데이터를 Bar 차트 형식으로 변환
    data.forEach((stat) => {
        labels.push(stat.containerNm); // 컨테이너 이름
        cpuData.push(stat.cpuPer.replace("%", ""));    // CPU 사용량
        memData.push(stat.memPer.replace("%", ""));    // 메모리 사용량
    });
    
    const maxCpu = Math.max(...cpuData);
    const maxMem = Math.max(...memData);
    const dynamicMax = Math.ceil(Math.max(maxCpu, maxMem) * 2); // 최대값의 2배, 올림 처리
    
    console.log(labels);
    console.log(cpuData);
    console.log(memData);
    
    const ctx = document.getElementById("graph_resource").getContext("2d");
    let dockerStatsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels:labels, // 컨테이너 이름
            datasets: [
                {
                    label: "CPU 사용률 (%)",
                    data: cpuData, // CPU 사용량
                    backgroundColor: "rgba(255, 99, 132, 0.6)", // Bar 색상 (CPU)
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Memory 사용률 (%)",
                    data: memData, // 메모리 사용량
                    backgroundColor: "rgba(54, 162, 235, 0.6)", // Bar 색상 (메모리)
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Usage (%)",
                    },
                },
            },
        },
    });
}


