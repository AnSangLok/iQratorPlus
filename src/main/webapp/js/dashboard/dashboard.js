/**
 * 엔터버튼 동작 기능
 */
let search_enter = function(event){
	if (event.keyCode == 13 ) {
		getStatClass();
	} 
}

function selectModelCnt() {
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "modelCntSelect",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridModelCnt(data);

		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridModelCnt(data){
	
	let cntD = data.ttlCnt - data.cntS;
	document.getElementById("totalCnt").innerHTML = data.ttlCnt;
	document.getElementById("activeCnt").innerHTML = data.cntS;
	document.getElementById("deactiveCnt").innerHTML = cntD;
}

function selectLatestGraph() {
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectLatestGraph",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridGraph(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridGraph(data) {
	graphAlgorithm(data.algorithmCntList);
	graphCallApi(data.apiCallCntList);
}

function graphAlgorithm(data) {

	let chartList = data;

	// x축 : 알고리즘
	let xs = chartList.map(function(item) {
        return item.algorithmType;
    });
	
	// y축 : 사용횟수
    var ys = chartList.map(function(item) {
        return item.algorithmCnt;
    });
    
    var ctx = document.getElementById('algorithmDetail').getContext('2d');
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

function graphCallApi(data) {

	let chartList = data;

	// x축 : 모델명
	let xs = chartList.map(function(item) {
        return item.modelViewName;
    });
	
	// y축 : 호출횟수
    var ys = chartList.map(function(item) {
        return item.callApiCnt;
    });
	
	var ctx = document.getElementById('apiCnt').getContext('2d');
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
      options: {
          plugins: {
              legend: {
                  position: 'left'
              }
          }
      }
	});
}


function selectMaxTrainDetail() {
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectMaxTrainDetail",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			girdGraphMAPE(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
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
	
    let chartStatus = Chart.getChart('modelGraph');
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    
	var ctx = document.getElementById('modelGraph').getContext('2d');
    var mapeChart = new Chart(ctx, {
        type: 'line',  // 선 그래프
        data: {
            labels: labels,
            datasets: [{
                label: '정확도',
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
                        text: '정확도'
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

function selectModelId() {
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectLatestClusterModel",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			requestCluster(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function requestCluster(data) {
	let features = data.features;
	let modelId = data.modelId;
	let algorithmType = "cluster";
	let outlierVal = {};
	console.log(features);
	let featureList = features.split(",");
	console.log(featureList);
	
	for(let i=0; i<featureList.length; i++){
		outlierVal[featureList[i]] = "0";
	}
	console.log(outlierVal);
	
	$.ajax({
        url: 'requestPredict', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	id: modelId,
        	algorithmType: algorithmType,
        	outlierVal: outlierVal
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridCluster(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
//        	Load.hideLoader();
        }
    });
}

function gridCluster(data) {
	let myChart = null;
	let chartList = data;
	let chartData = chartList.map(function(item) {
        return JSON.parse(item.jsonResponse);
    });
	console.log(chartData);
	
	let input_outliar = chartData.map(function(item) {
        return item.input_outliar;
    });
	
	let datasets = chartData.map(function(item) {
		return item.datasets;
	});
	
	let labels = chartData.map(function(item) {
        return item.labels;
    });

    labels = labels.flat();
	input_outliar = input_outliar.flat();
    datasets = datasets.flat();
	console.log(input_outliar);
	console.log(datasets);
//	console.log(outliar_result);
    
	var ctx = document.getElementById('trainModelGraph').getContext('2d');
	// 기존 차트를 삭제
    if (myChart !== null) {
        myChart.destroy(); // 기존 차트를 삭제
    }
	
	myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
        	labels : input_outliar,
        	datasets : datasets
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            // 데이터 포인트의 인덱스 가져오기
                            const index = context.dataIndex;
                            const pointData = datasets[0].data[index];

                            // 툴팁에 표시할 내용 구성
                            return [
                                `x: ${pointData.x}`,
                                `y: ${pointData.y}`,
                                `Score: ${pointData.score.toFixed(2)}`,
                                `Outlier: ${pointData.outlier ? '이상치' : '정상'}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Index'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Feature Value'
                    }
                }
            }
        }
    });
}

$(document).ready(function () { // 처음 호출되었을 때 세팅
	selectModelCnt();
	selectLatestGraph();
	selectMaxTrainDetail();
	selectModelId();
	
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl current\"><a href=\"dashboard\">대시보드</a></li>";
	topNav.innerHTML = navText;
});