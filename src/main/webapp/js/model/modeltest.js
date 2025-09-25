let myChartCluster = null;

document.addEventListener("DOMContentLoaded", function() {
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl\">모델</li>"+
	"<li class=\"fl\">></li>\r\n" + 
	"<li class=\"fl current\"><a href=\"model-execute\">시범서비스화면</a></li>";
	topNav.innerHTML = navText;
	
	requestFirmList();
});

function goPage(page){
	document.getElementById("PAGE").value=page;
	let type = document.getElementById("T_DEMO").value;
	if(type=="firmSearch"){
		searchFirmList();
	}else{
		searchEmisFirm();
	}

}

function optionSelect(){
	const dropdown = document.getElementById("demoOption");
    const demoType = dropdown.value.split(",")[0];
    console.log("선택된 값:", demoType);
//    displaySelector(demoType);
    if(demoType=="firmSearch"){
    	requestFirmList();
    }else{
    	requestEmisFirm();
    }
}

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

let searchEnter = function(event){
	let type = document.getElementById("T_DEMO").value;
	document.getElementById("PAGE").value = "1";
	if (event.keyCode == 13 ) {
		console.log(type);
		if(type=="firmSearch"){
			searchFirmList();
			console.log("@@@@");
		}else{
			searchEmisFirm();
			console.log("@##@@@");
		}
	} 
}

function searchClick(){
	let type = document.getElementById("T_DEMO").value;
	document.getElementById("PAGE").value = "1";
	if(type=="firmSearch"){
		searchFirmList();
		console.log("@@@@");
	}else{
		searchEmisFirm();
		console.log("@##@@@");
	}
	
}

function searchFirmList(){
	Load.showLoader();
	let firmName = document.getElementById("firmName").value;
	let page = document.getElementById("PAGE").value;
	page = Number(page);
	$.ajax({
        url: 'selectFirmList', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
		data: JSON.stringify({
			firmName: firmName,
			pageNum:page,
			pageSize:10
		}),
        success: function(data) {
            console.log('서버 응답:', data);
            gridFirmList(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}


function requestFirmList() {
	Load.showLoader();
	$.ajax({
        url: 'selectFirmList', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
		data: JSON.stringify({
			firmName: "",
			pageNum:1,
			pageSize:10
		}),
        success: function(data) {
            console.log('서버 응답:', data);
            gridFirmList(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}


function gridFirmList(data) {
	let setpId = "firmSearch";
	displaySelector(setpId);
	document.getElementById("T_DEMO").value=setpId;
	
	let dataList = data.resultList;
	let pageList = data.pageList;
	
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\" id=\"firmTb\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n" + 
		"        <th scope=\"col\" width=\"50%\">업체명</th>\r\n" + 
		"        <th scope=\"col\" width=\"25%\">폐기물 종류</th>\r\n" + 
		"        <th scope=\"col\" width=\"25%\">이상치 검증</th>\r\n" + 
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n";
	for(let i=0; i<dataList.length; i++){
		let firmName = dataList[i].firmName;
		let entn = dataList[i].entn;
		let wsteName = dataList[i].wsteName;
		resultStr += 
			"      <tr>\r\n" + 
			"        <td>"+firmName+"</td>\r\n" + 
			"        <td>"+wsteName+"</td>\r\n" + 
			"        <td>\r\n" + 
			"            <button type=\"button\" class=\"btn_select\" onclick=\"alertOutLiar('"+entn+"')\">검증</button>\r\n" + 
			"        </td>\r\n" + 
			"      </tr>\r\n"; 
	}
	resultStr += 
		"    </tbody>\r\n" + 
		"</table>"+
		"<div class=\"pagination\">\r\n" + 
		pageList + 
		"</div>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
	let listTb = document.getElementById("firmTb");
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
	
}

function alertOutLiar(entn){
	
	let waste = "";
	let wKind = "cons";

	Load.showLoader();
	
	$.ajax({
		url: 'wasteApi', // 데이터를 전송할 Java 서버의 엔드포인트 URL
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			cid: entn,
			waste: waste,
			wKind: wKind
		}),
		success: function(data) {
			console.log('서버 응답:', data);
			alertList(data);
		},
		error: function(xhr, status, error) {
			console.error('전송 오류:', error);
		},
		complete: function() {
        	Load.hideLoader();
		}
	});
}

function alertList(data) {
	let dateList = [];
	let quntList = [];
	let dateListAlert = "이상수치는 ";
	if(data.outlier[0].none){
		dateListAlert = "보관량 데이터가 존재하지 않거나 이상수치가 없습니다.";
	}else{
		data.outlier.forEach(function(item) {
			dateListAlert += item.date + "의 " + item.value + "톤 ";
			dateList.push(item.date);
			quntList.push(item.value);
		});
		dateListAlert += "입니다.";
	}
	alert(dateListAlert);
}


function searchEmisFirm() {
	let firmName = document.getElementById("firmName").value;
	let page = document.getElementById("PAGE").value;
	page = Number(page);
	Load.showLoader();
	$.ajax({
      url: 'selectEmisFirm', // 데이터를 전송할 Java 서버의 엔드포인트 URL
      type: 'POST',
      contentType: 'application/json',
		data: JSON.stringify({
			firmName: firmName,
			pageNum:page,
			pageSize:10
		}),
      success: function(data) {
          console.log('서버 응답:', data);
          gridEmisFirmList(data);
      },
      error: function(xhr, status, error) {
          console.error('전송 오류:', error);
      },
      complete: function() {
      	Load.hideLoader();
      }
  });
}

function requestEmisFirm() {
	Load.showLoader();
	$.ajax({
      url: 'selectEmisFirm', // 데이터를 전송할 Java 서버의 엔드포인트 URL
      type: 'POST',
      contentType: 'application/json',
		data: JSON.stringify({
			firmName: "",
			pageNum:1,
			pageSize:10
		}),
      success: function(data) {
          console.log('서버 응답:', data);
          gridEmisFirmList(data);
      },
      error: function(xhr, status, error) {
          console.error('전송 오류:', error);
      },
      complete: function() {
      	Load.hideLoader();
      }
  });
}


function gridEmisFirmList(data) {
	let setpId = "firmDemo";
	displaySelector(setpId);
	document.getElementById("T_DEMO").value=setpId;
	
	let dataList = data.resultList;
	let pageList = data.pageList;
	
	let resultStr = 
		"<div class=\"table_area3\">" +
		"<table width=\"40%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\" id=\"emisTb\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n" + 
		"        <th scope=\"col\" width=\"40%\">업체명</th>\r\n" + 
		"        <th scope=\"col\" width=\"45%\">폐기물 종류</th>\r\n" + 
		"        <th scope=\"col\" width=\"15%\">이상치 검증</th>\r\n" + 
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n";
	for(let i=0; i<dataList.length; i++){
		let firmName = dataList[i].firmName;
		let entn = dataList[i].entn;
		let wsteName = dataList[i].wsteName;
		resultStr += 
			"      <tr>\r\n" + 
			"        <td>"+firmName+"</td>\r\n" + 
			"        <td>"+wsteName+"</td>\r\n" + 
			"        <td>\r\n" + 
			"            <button type=\"button\" class=\"btn_select\" onclick=\"showRight('"+entn+"')\">선택</button>\r\n" + 
			"        </td>\r\n" + 
			"      </tr>\r\n"; 
	}
	resultStr += 
		"    </tbody>\r\n" + 
		"</table>" +
		"<div class=\"pagination2\">\r\n" + 
		pageList + 
		"</div>" +
		"</div>" + 
		"<div class=\"right-panel\" style=\"display:none;\" id=\"rightContents\">\r\n" + 
		"    <!-- Chart.js 그래프 영역 -->\r\n" + 
		"    <div class=\"chart-container\">\r\n" + 
		"        <canvas id=\"clusterChart\"></canvas>\r\n" + 
		"    </div>\r\n" + 
		"    <!-- 입력 필드 및 버튼 -->\r\n" + 
		"    <div class=\"input_area\">\r\n" + 
		"        <input type=\"text\" id=\"firmQunt\" placeholder=\"값을 입력하세요.(ton)\">\r\n" + 
		"        <button type=\"button\" id=\"submitBtn\" onclick=\"requestPred()\">검증</button>\r\n" + 
		"<div id=\"outliar_result\"></div>" +
		"    </div>\r\n" + 
		"</div>" + 
		"</div>"
	
	document.getElementById(setpId).innerHTML = resultStr;
	
	let listTb = document.getElementById("emisTb");
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
}

function showRight(entn){
	document.getElementById("rightContents").style.display="";
	document.getElementById("ENTN").value = entn;
	document.getElementById("outliar_result").innerHTML = "";
	if (myChartCluster != null) {
    	myChartCluster.destroy(); // 기존 차트를 삭제
    }
	
}

function requestPred() {

	Load.showLoader();
	
	let entn = document.getElementById("ENTN").value;
	let waste = document.getElementById("firmQunt").value;
	let wKind = "emis";
	if(waste){
		$.ajax({
			url: 'wasteApi', // 데이터를 전송할 Java 서버의 엔드포인트 URL
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				cid: entn,
				waste: waste,
				wKind: wKind
			}),
			success: function(data) {
				console.log('서버 응답:', data);
				if(data.outliar.error){
					alert(data.outliar.error);
				}else{
					let parsedData = JSON.parse(data.outliar);
					gridPredictChart(parsedData);
				}
			},
			error: function(xhr, status, error) {
				console.error('전송 오류:', error);
			},
			complete: function() {
        		Load.hideLoader();
			}
		});
	} else{
		alert("값을 입력하세요.");
	}
}

function gridPredictChart(parsedData) {
//	outliarResult
	let outliar = parsedData.input_outlier;
	let outliar_result = "";
	if(outliar=="정상수치"){
		outliar_result = "검증 결과 : <span class=\"color_normal\">정상수치</span>";
	}else{
		outliar_result = "검증 결과 : <span class=\"error_normal\">이상수치</span>";
	}
	document.getElementById("outliar_result").innerHTML = outliar_result;
	
	let chartData = parsedData.datasets[0].data.map(item => ({
        x: item.x, 
        y: item.y,
        backgroundColor: item.outlier ? "#FF3333" : "#3399FF", // 이상치 빨강, 정상치 파랑
        borderColor: item.outlier ? "#8B0000" : "#00008B",
        borderWidth: item.is_new ? 3 : 1,  // 신규 데이터는 테두리 두껍게
        pointRadius: item.is_new ? 10 : 4  // 신규 데이터는 크기를 더 크게
    }));

	
	// 기존 차트를 삭제
    if (myChartCluster != null) {
    	myChartCluster.destroy(); // 기존 차트를 삭제
    }

	var ctxCluster = document.getElementById('clusterChart').getContext('2d');
	myChartCluster = new Chart(ctxCluster, {
        type: "scatter",  // 산점도 그래프 사용
        data: {
            datasets: [{
                label: "Isolation Forest Outliers",
                data: chartData,  // 변환된 데이터 삽입
                backgroundColor: chartData.map(item => item.backgroundColor),
                borderColor: chartData.map(item => item.borderColor),
                borderWidth: chartData.map(item => item.borderWidth),
                pointRadius: chartData.map(item => item.pointRadius)
            }]
        },
        options: {
            scales: {
                x: { type: "linear", position: "bottom" },
                y: { beginAtZero: true }
            }
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