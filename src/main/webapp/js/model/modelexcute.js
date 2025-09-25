let prdChart = null;
let dtChart = null;

function displaySelector(id) {
	
	const trainDiv = document.getElementById("excuteDiv");
	const childDivs = trainDiv.children;

	Array.from(childDivs).forEach(child => {
	  if (child.tagName === "DIV") {
	    child.style.display = "none";
	  }
	});
	
	document.getElementById(id).style.display = "";
}

function selectModelList() {

	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelInfoAll",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridModelOpt(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridModelOpt(data) {
	let setpId = "modelOpt";
//	displaySelector(setpId);
	let resultStr = "";
	for(let i=0; i<data.length; i++){
			
			let mdId = data[i].modelId;
			let mdDate = data[i].firstTrainDate;
			let mdState = data[i].modelState;
			let mdStateKr = "";
			let mdName = data[i].modelViewName;
			let mdCnt = data[i].trainCnt;
			let mdFile = data[i].trainDataFile;
			let mdFilePath = data[i].trainDataPath;
			let modelTypes = data[i].modelTypes;
			
			if (mdState=="R"){
				mdStateKr = "실행중";
			} else{
				mdStateKr = "대기중";
			}
			resultStr += 
				"<option value=\""+modelTypes+","+mdId+"\">"+mdName+"</option>\r\n"; 
	}
	
	document.getElementById(setpId).innerHTML = resultStr;

	selectOpt();
}

function selectOpt() {
    const dropdown = document.getElementById('modelOpt');
    const algorithmType = dropdown.value.split(",")[0]; // 선택된 알고리즘 유형 regression OR cluster
    console.log("선택된 값:", algorithmType);
    const modelId = dropdown.value.split(",")[1]; // 선택된 값 가져오기
    document.getElementById("ALGORITHM_TYPE").value = algorithmType;
    document.getElementById("MODEL_ID").value = modelId;
	
    const trainDiv = document.getElementById("excuteDiv");
	const childDivs = trainDiv.children;

	Array.from(childDivs).forEach(child => {
	  if (child.tagName === "DIV") {
	    child.style.display = "none";
	  }
	});
	
	document.getElementById(algorithmType).style.display = "";
	document.getElementById(algorithmType).style.display = "";

	document.getElementById('searchTab').style.display = "none";
	
	if(algorithmType=="cluster"){
		requestFeatures();
	} else if(algorithmType=="regression"){
		gridRegression();
		requestRegression("365"); 
		requestData("365");
	} else if(algorithmType=="frimSearch"){
		gridFirm();
	}
}


function requestFeatures() {
	let modelId = document.getElementById("MODEL_ID").value;
	Load.showLoader();
	$.ajax({
        url: 'requestFeatures', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	id: modelId
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridCluster(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
	
} 

function gridFirm() {
	let selectOpt = document.getElementById("firmSearch");
	let modelName = selectOpt.options[selectOpt.selectedIndex].text;
	let setpId = "firmSearch";
	displaySelector(setpId);
	
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\" id=\"firmTb\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n" + 
		"        <th scope=\"col\">업체명</th>\r\n" + 
		"        <th scope=\"col\">폐기물 종류</th>\r\n" + 
		"        <th scope=\"col\">선택</th>\r\n" + 
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n" + 
		"      <tr>\r\n" + 
		"        <td>-</td>\r\n" + 
		"        <td>-</td>\r\n" + 
		"        <td>\r\n" + 
		"            <button type=\"button\" class=\"btn_select\">선택</button>\r\n" + 
		"        </td>\r\n" + 
		"      </tr>\r\n" + 
		"    </tbody>\r\n" + 
		"</table>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
}

function gridCluster(data) {
	let selectOpt = document.getElementById("modelOpt");
	let modelName = selectOpt.options[selectOpt.selectedIndex].text;
	console.log(modelName);
	
	let setpId = "eval";
	displaySelector(setpId);
	let features = "";
	let resultStr = 
		"<div class=\"graph_box\">\r\n" + 
		"    <h4 class=\"card-title\">"+modelName+" 그래프</h4>\r\n" + 
		"    <div id=\"graph\" style=\"height:450px; width:800px;\"> <!-- style 삭제 요망 -->\r\n" + 
		"    	<canvas id=\"clusterChart\"></canvas>\r\n" + 
		"    </div>\r\n" + 
		"    <div class=\"fr mt_20\">\r\n"; 
		"        <p>배출량 (KG) : <input type=\"text\" class=\"text_box2\" placeholder=\"배출량\"><button class=\"btn waves-effect waves-light btn-sm btn-secondary\">검증</button></p>\r\n" + 
		"        <p class=\"mt_10\">검증결과 : <span class=\"color_normal\">정상수치</span> or <span class=\"error_normal\">이상수치</span></p>\r\n" + 
		"    </div>\r\n" + 
		"</div>";
	for(let i=0; i<data.length; i++){
		resultStr += 
			"        <p>"+data[i]+" : <input type=\"text\" class=\"text_box2\" placeholder=\"데이터 입력\" id=\""+data[i]+"\">";
		if(i==0){
			features += data[i];
		}else{
			features += ","+data[i];
		}
	}
	resultStr += 
		"		 <button class=\"btn waves-effect waves-light btn-sm btn-secondary\" onclick=\"requestCluster('"+features+"');\">검증</button></p>\r\n" + 
		"        <p id=\"outliarResult\"></p>\r\n" + 
		"    </div>\r\n";
	
	document.getElementById(setpId).innerHTML = resultStr;
}

function gridRegression() {
	let setpId = "regression";
//	displaySelector(setpId);
	let selectOpt = document.getElementById("modelOpt");
	let modelName = selectOpt.options[selectOpt.selectedIndex].text;
	console.log(modelName);
	
	let resultStr = 
		"<div class=\"graph_box mr\">\r\n" + 
		"    <h4 class=\"card-title\">"+modelName+" 학습 데이터</h4>\r\n" + 
		"    <div class=\"bottom_10 fr\">\r\n" + 
//		"        <button class=\"btn_date\" onclick=\"requestData('365');\">분기별</button>\r\n" + 
//		"        <button class=\"btn_date\" onclick=\"requestData('1461');\">년별</button>\r\n" + 
//		"        <input type=\"date\" class=\"input_date\"> ~ <input type=\"date\" class=\"input_date\">\r\n" + 
		"    </div>\r\n" + 
		"    <div class=\"clear\"></div>\r\n" + 
		"<div class=\"graph\" style=\"width: 80%; margin: auto;\" id=\"delPredict\">\r\n" + 
		"    <canvas id=\"dataChart\"></canvas>\r\n" + 
		"</div>" +
		"</div>\r\n" + 
		"<div class=\"graph_box\">\r\n" + 
		"    <h4 class=\"card-title\">"+modelName+" 예측 그래프</h4>\r\n" + 
		"    <div class=\"bottom_10 fr\">\r\n" + 
		"        <button class=\"btn_date\" onclick=\"requestRegression('365');\">분기별</button>\r\n" + 
		"        <button class=\"btn_date\" onclick=\"requestRegression('1461');\">년별</button>\r\n" + 
//		"        <input type=\"date\" class=\"input_date\"> ~ <input type=\"date\" class=\"input_date\">\r\n" + 
		"    </div>\r\n" + 
		"    <div class=\"clear\"></div>\r\n" + 
		"<div class=\"graph\" style=\"width: 80%; margin: auto;\" id=\"delPredict\">\r\n" + 
		"    <canvas id=\"regressionChart\"></canvas>\r\n" + 
		"</div>" +
		"</div>";

	document.getElementById(setpId).innerHTML = resultStr;
}

function requestCluster(features) {
	let modelId = document.getElementById("MODEL_ID").value;
	let algorithmType = document.getElementById("ALGORITHM_TYPE").value;
	let outlierVal = {};
	console.log(features);
	let featureList = features.split(",");
	console.log(featureList);
	
	for(let i=0; i<featureList.length; i++){
		console.log(document.getElementById(featureList[i]));
		outlierVal[featureList[i]] = document.getElementById(featureList[i]).value;
	}
	console.log(outlierVal);
	Load.showLoader();
//	let outlierVal = document.getElementById("outlierVal");
//	outlierVal = outlierVal ? outlierVal.value : null; // 없는 경우 null 할당
	
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
            gridPredictChart(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}

function requestRegression(period) {
	let modelId = document.getElementById("MODEL_ID").value;
	let algorithmType = document.getElementById("ALGORITHM_TYPE").value;
	Load.showLoader();
	
	$.ajax({
        url: 'requestPredict', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	id: modelId,
        	algorithmType: algorithmType,
            period: period
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridPredictChart(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}


let myChartCluster = null;
let myChartRegression = null;
function gridPredictChart(data) {
//	outliarResult
	let outliar_result = "검증 결과 : <span class=\"color_normal\">정상수치</span> or <span class=\"error_normal\">이상수치</span>";
	let algorithmType = document.getElementById("ALGORITHM_TYPE").value;
	
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
	console.log(labels);
	console.log(datasets);
	console.log(outliar_result);
	console.log(algorithmType);
    
	// 기존 차트를 삭제
    if (myChartCluster != null) {
    	myChartCluster.destroy(); // 기존 차트를 삭제
    }
    if (myChartRegression != null) {
    	myChartRegression.destroy(); // 기존 차트를 삭제
    }
	if(algorithmType=="cluster"){
		var ctxCluster = document.getElementById('clusterChart').getContext('2d');
//		document.getEelementById("graph1").style.display="";
//		document.getEelementById("graph2").style.display="none";
		myChartCluster = new Chart(ctxCluster, {
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
		
	} else if(algorithmType=="regression"){
//		document.getEelementById("graph1").style.display="none";
//		document.getEelementById("graph2").style.display="";
		var ctxRegression = document.getElementById('regressionChart').getContext('2d');
		console.log("@@@");
		myChartCluster = new Chart(ctxRegression, {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: true,
						position: 'top'
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: '날짜'
						}
					},
					y: {
						title: {
							display: true,
							text: '값'
						}
					}
				}
			}
		});
	}
}

function requestData(period) {
	let modelId = document.getElementById("MODEL_ID").value;
	
	$.ajax({
        url: 'requestData', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	id: modelId,
            period: "period"
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridDataChart(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
//        	Load.hideLoader();
        }
    });
}

function gridDataChart(data) {
	
	const totalData = data.length;
    const step = Math.floor(totalData / 10);  // 10개로 나누기 위한 간격

    // 3. 구간별로 데이터를 추출
    const reducedData = [];
    for (let i = 0; i < 10; i++) {
        reducedData.push(data[i * step]); // 10개의 데이터 추출
    }

    // 4. Chart.js에서 사용할 데이터 변환
    const labels = reducedData.map(item => item.Date); // X축 날짜
    const targetData = reducedData.map(item => item.target); // target 값

    // 5. 유동적으로 features의 key를 추출하여 datasets 생성
    const featureKeys = new Set();
    reducedData.forEach(item => {
        item.features.forEach(feature => {
            Object.keys(feature).forEach(key => featureKeys.add(key)); // feature의 key를 모두 추가
        });
    });

    // 6. featureKey에 따라 데이터셋 생성
    const datasets = Array.from(featureKeys).map(featureKey => {
        const featureData = reducedData.map(item => {
            return item.features.reduce((sum, feature) => sum + (feature[featureKey] || 0), 0);
        });
        return {
            label: featureKey, // feature 이름을 레이블로 설정
            data: featureData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // 임의의 색상
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        };
    });

    // Target 데이터셋 추가 (강조 스타일 적용)
    datasets.unshift({
        label: 'Target',
        data: targetData, // target 값
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // 강조된 색상
        borderColor: 'rgba(255, 99, 132, 1)', // 굵은 테두리
        borderWidth: 3, // 더 두꺼운 테두리
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)', // 마우스 오버시 강조 색상
        hoverBorderColor: 'rgba(255, 99, 132, 1)', // 마우스 오버시 테두리 색상
        hoverBorderWidth: 4 // 마우스 오버시 테두리 두께
    });

    const chartData = {
        labels: labels, // 날짜
        datasets: datasets // 유동적으로 생성된 datasets
    };
    if (dtChart !== null) {
    	dtChart.destroy(); // 기존 차트를 삭제
    }
    // 7. 차트 생성
    const ctx = document.getElementById('dataChart').getContext('2d');
    dtChart = new Chart(ctx, {
        type: 'bar', // 막대 그래프
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} 

document.addEventListener("DOMContentLoaded", function() {
	selectModelList();
	
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl\">모델</li>"+
	"<li class=\"fl\">></li>\r\n" + 
	"<li class=\"fl current\"><a href=\"model-execute\">모델검증</a></li>";
	topNav.innerHTML = navText;
});


function fe(data){
	let eksx = "gowlfanfuqqkfkaeh shvdl";
}



function selectViewAndDetailList(id) {

	$.ajaxSetup({cache:false});
	$.ajax({
		type : "POST",
		url : "selectViewAndDetailList",
        contentType: 'application/json',
        data: JSON.stringify({
            id: id
        }),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			document.getElementById("MODEL_ORG_NAME").value = data.modelOrgName;
			document.getElementById("TARGET_VAL").value = data.targetVal;
			document.getElementById("TRAIN_DATA_FILE").value = data.trainDataFile;
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}


/** 로딩 이미지 사용
 * 사용 : Load.showLoader();
 * 미사용 : Load.hideLoader();
 */
const Load = (function () {
    const loader = document.getElementById("load");
    console.log(loader);
    return {
        showLoader: function () {
            loader.style.cssText = "display:show";
        },
        hideLoader: function () {
            loader.style.cssText = "display:none";
        }
    };
})();

