document.addEventListener("DOMContentLoaded", function() {
	
	getStatisticsModelInfo();
	
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl current\"><a href=\"statisticsView\">학습통계</a></li>";
	topNav.innerHTML = navText;
	
});

function getStatisticsModelInfo() {

	$.ajaxSetup({cache:false});
	$.ajax({
		contentType :  "application/json; charset=UTF-8",
		type : "POST",
		url : "selectStatisticsModelInfo",
		cache: false,
		timeout : 30000,
		success : function(data) {
//			console.log(data);
			gridStatistics(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridStatistics(data) {
	let setpId = "sttsTb";
//	displaySelector(setpId);
	
	let resultStr = 
		"<table id=\"listTb\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n" + 
		"        <th scope=\"col\" width=\"40%\">모델명</th>\r\n" + 
		"        <th scope=\"col\" width=\"25%\">데이터셋명</th>\r\n" + 
		"        <th scope=\"col\" width=\"15%\">정확도</th>\r\n" + 
		"        <th scope=\"col\" width=\"10%\">학습횟수</th>\r\n" + 
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n";
	
	if(data.length > 0){
		
		data.forEach((model)=>{
			resultStr += "      <tr onclick=getStatisticsModelDetail(\"" + model.modelId + "\")>\r\n";
			resultStr += "        <td>" + model.modelViewName + "</td>\r\n";
			resultStr += "        <td>" + model.trainDataFile + "</td>\r\n";
			resultStr += "        <td>" + (model.accuracy*100).toFixed(2) + "%</td>\r\n";
			resultStr += "        <td>" + model.trainCnt + "회</td>\r\n";
			resultStr += "      </tr>\r\n";
		})
		
	}else{
		resultStr += "      <tr>\r\n";
		resultStr += "        <td colspan='4'>학습 통계 정보가 없습니다.</td>\r\n"
		resultStr += "      </tr>\r\n";
	}
	
	resultStr += "    </tbody>\r\n";
	resultStr += "</table>";
	
	
	document.getElementById(setpId).innerHTML = resultStr;
	
	let listTb = document.getElementById("listTb");
	listTb.addEventListener("click", function(event) {
	    let row = event.target.closest("tr");
	    if (row) {
	      // table1의 배경색만 변경
	      let rows = listTb.querySelectorAll("tr");
	      rows.forEach(function(innerRow) {
	        innerRow.style.backgroundColor = "";
	      });
	      row.style.backgroundColor = "#ADD8E6";
	    }
	  });
	const firstRow = listTb.querySelector('tbody tr:nth-child(1)');
	firstRow.querySelector('td').click(); // 두 번째 행의 <td> 클릭
	
}


function getStatisticsModelDetail(modelId) {

	$.ajaxSetup({cache:false});
	$.ajax({
		contentType :  "application/json; charset=UTF-8",
		type : "POST",
		url : "selectStatisticsModelDetail",
		cache: false,
		timeout : 30000,
		data: JSON.stringify({
			modelId: modelId
		}),
		success : function(data) {
			console.log(data);
			girdGraphMSE(data);
			girdGraphRMSE(data);
			girdGraphMAPE(data);
			girdGraphR2(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function girdGraphR2(data) {
	let chartList = data;

	// x축 : 회차
	let labels = chartList.map(function(item, index) {
        return (index+1) + "회차";
    });
	
	// y축 : r2
    var r2 = chartList.map(function(item) {
        return item.r2;
    });
	
    let chartStatus = Chart.getChart('graph_r2');
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    
	var ctx = document.getElementById('graph_r2').getContext('2d');
    var mseChart = new Chart(ctx, {
        type: 'line',  // 선 그래프
        data: {
            labels: labels,
            datasets: [{
                label: 'R2_SCORE',
                data: r2,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                fill: false
            }]
        },
        options: {
        	responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '학습 횟수'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'R2'
                    }
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

function girdGraphMSE(data) {

	let chartList = data;

	// x축 : 회차
	let labels = chartList.map(function(item, index) {
        return (index+1) + "회차";
    });
	
	// y축 : MSE
    var mse = chartList.map(function(item) {
        return item.mse;
    });
	
    let chartStatus = Chart.getChart('graph_mse');
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    
	var ctx = document.getElementById('graph_mse').getContext('2d');
    var mseChart = new Chart(ctx, {
        type: 'line',  // 선 그래프
        data: {
            labels: labels,
            datasets: [{
                label: 'MSE',
                data: mse,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                fill: false
            }]
        },
        options: {
        	responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '학습 횟수'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'MSE'
                    }
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

function girdGraphRMSE(data) {

	let chartList = data;

	// x축 : 회차
	let labels = chartList.map(function(item, index) {
        return (index+1) + "회차";
    });
	
	// y축 : RMSE
    var rmse = chartList.map(function(item) {
        return item.rmse;
    });
	
    let chartStatus = Chart.getChart('graph_rmse');
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    
	var ctx = document.getElementById('graph_rmse').getContext('2d');
    var rmseChart = new Chart(ctx, {
        type: 'line',  // 선 그래프
        data: {
            labels: labels,
            datasets: [{
                label: 'RMSE',
                data: rmse,
                borderColor: 'rgba(75, 192, 192, 0.8)',
                fill: false
            }]
        },
        options: {
        	responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '학습 횟수'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'RMSE'
                    }
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

function girdGraphMAPE(data) {

	let chartList = data;

	// x축 : 회차
	let labels = chartList.map(function(item, index) {
        return (index+1) + "회차";
    });
	
	// y축 : MAPE
    var mape = chartList.map(function(item) {
        return item.mape;
    });
	
    let chartStatus = Chart.getChart('graph_mape');
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    
	var ctx = document.getElementById('graph_mape').getContext('2d');
    var mapeChart = new Chart(ctx, {
        type: 'line',  // 선 그래프
        data: {
            labels: labels,
            datasets: [{
                label: 'MAPE',
                data: mape,
                borderColor: 'rgba(54, 162, 235, 0.8)',
                fill: false
            }]
        },
        options: {
        	responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '학습 횟수'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'MAPE'
                    }
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

