let searchEnter = function(event){
	if (event.keyCode == 13 ) {
		searchModel();
	} 
}

document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.icon_search');
    searchIcon.addEventListener('click', function() {
        searchModel();
    });
});

function searchModel(){
	const searchValue = document.querySelector(".search").value.trim();
	console.log(searchValue);
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelWithName",
		data : JSON.stringify({
	        "modelViewName": searchValue
	    }),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridModelGrid(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}


function toggleTb(id){
	
	console.log(id);
	
	if(id=="historyTb"){
		document.getElementById("historyTb").style.display = "";
		document.getElementById("detailTb").style.display = "none";
		document.getElementById("dockerTb").style.display = "none";
		
	}else if(id=="detailTb"){
		document.getElementById("detailTb").style.display = "";
		document.getElementById("historyTb").style.display = "none";
		document.getElementById("dockerTb").style.display = "none";
		
	}else if(id=="dockerTb"){
		document.getElementById("dockerTb").style.display = "";
		document.getElementById("detailTb").style.display = "none";
		document.getElementById("historyTb").style.display = "none";
		
	}

}


function selectModelCnt() {
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelInfo",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridModelGrid(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function selectModelCntAfter(id) {
	console.log(id);
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelInfo",
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridModelGrid(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		},
        complete: function() {
        	document.querySelector(".search").value = '';
        	selectHistory(event, id);
        }
	});
}

function gridModelGrid(data) {
	
	let resultStr = 
	"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\n" + 
	"<thead>\n" + 
	"  <tr>\n" + 
	"    <th scope=\"col\" width=\"19%\">모델명</th>\n" + 
	"    <th scope=\"col\" width=\"16%\">상태</th>\n" + 
	"    <th scope=\"col\" width=\"35%\">데이터셋명</th>\n" + 
	"    <th scope=\"col\" width=\"15%\">배포정보 "+"<span class=\"tooltip-left\" data-tooltip=\"호출정보를 확인할 수 있습니다.\">\r\n" + 
	"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
	"</span>"+"</th>\n" + 
	"    <th scope=\"col\" width=\"15%\">이력관리 "+"<span class=\"tooltip-left\" data-tooltip=\"특정 모델의 학습 이력을 확인 할 수 있습니다.\">\r\n" + 
	"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
	"</span>"+"</th>\n" + 
	"  </tr>\n" + 
	"</thead>\n";
	resultStr += "<tbody>";

	if(data.length>0) {
		for(let i=0; i<data.length; i++){
			
			let mdId = data[i].modelId;
			let mdDate = data[i].firstTrainDate;
			let mdState = data[i].modelState;
			let mdStateKr = "";
			let mdName = data[i].modelViewName;
			let mdCnt = data[i].trainCnt;
			let mdFile = data[i].trainDataFile;
			let mdFilePath = data[i].trainDataPath;
			
			if (mdState=="R"){
				mdStateKr = "<td><h5 class=\"color_blue\">실행중</h5></td>\n";
			} else{
				mdStateKr = "<td><h5 class=\"color_yellow\">대기중</h5></td>\n";
			}
			
			if(i==0){
				resultStr += "<tr id=\"clkId\" onclick=selectDetail('"+mdId+"','"+mdState+"');>\n";
			}else{
				resultStr += "<tr onclick=selectDetail('"+mdId+"','"+mdState+"');>\n";
			}
			
			resultStr += 
				"  <td>"+mdName+"</td>\n" + 
				mdStateKr + 
				"  <td>"+mdFile+"</td>\n" + 
				"  <td><a href=\"javascript:void(0)\"><img src=\"images/requestInfo.png\"  width=\"25\" height=\"25\" onclick=\"selectRequestInfo(event, '"+mdId+"','"+mdState+"');\"></a><a href=\"javascript:void(0)\">" +
//			"  <img src=\"images/stop.png\" class=\"left_10\"></a>" +
				"</td>\n" + 
				"  <td><a href=\"javascript:void(0)\"><img src=\"images/history.png\" onclick=\"selectHistory(event, '"+mdId+"');\"></a></td>\n" + 
				"</tr>";
		}
	} else {
		resultStr += 
			"<tr id=\"\" onclick=\"\">\n" +
			"<td colspan=5>모델 정보가 없습니다." +
			"</td>" +
			"</tr>";
		isNotModel();
	}
	
	resultStr += "";
	
	resultStr += "</tbody>";
	resultStr += "</table>";
	
	document.getElementById("modelInfoTb").innerHTML = resultStr;
	
	selectedColor();
	
	document.getElementById("clkId").click();
}

function isNotModel() {
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델명</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델종류</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">데이터셋 타입</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델 정확도</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";
	
	resultStr += 
		"<tr>\r\n" + 
		"  <td colspan=4>모델 정보가 없습니다.</td>\r\n" + 
		"</tr>";
	
	resultStr += "</tbody>";
	resultStr += "</table>";

	document.getElementById("detailTb").innerHTML = resultStr;

//	document.getElementById("clkId").style.backgroundColor = "#FFF";
}


function selectedColor(){

	let listTb = document.getElementById("modelInfoTb");
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
}

function selectDetail(id, modelState) {
	document.getElementById("trainId").value = id;
	
	toggleTb('detailTb');
	
	console.log(id);
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelDetail",
		data : JSON.stringify({
	        "modelId": id,
	        "modelState": modelState
	    }),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridDetail(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridDetail(data) {
	
	let mdId = data.modelId;
	let mdName = data.modelViewName;
	let mdDataType= data.dataType;
	let mdAlgorithm = data.algorithmType;
	let mdType = data.modelTypes;
	let mdDataName = data.outdataName;
	let mdMape = data.mape;
	let mdAcc = 1-mdMape;
	mdAcc = parseFloat(mdAcc).toFixed(2)
	if(mdMape==null || mdMape==""){
		mdAcc="없음";
	}
	let mdTargetVal = data.targetVal;
	let mdValidRatio = data.validRatio+"%";
	if(data.validRatio==null || data.validRatio==""){
		mdValidRatio="없음";
	}
	if(mdTargetVal==null || mdTargetVal==""){
		mdTargetVal="없음";
	}
	
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델명</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델종류</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">데이터셋 타입</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">모델 정확도</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";
	
	resultStr += 
		"<tr>\r\n" + 
		"  <td>"+mdName+"</td>\r\n" + 
		"  <td>"+mdType+"</td>\r\n" + 
		"  <td>"+mdDataType+"</td>\r\n" + 
		"  <td>"+mdAcc+"</td>\r\n" + 
		"</tr>";
	
	resultStr += 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">알고리즘</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">검증데이터 비율</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">데이터셋 명</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">목표변수</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";
	
	resultStr += 
		"<tr>\r\n" + 
		"  <td>"+mdAlgorithm+"</td>\r\n" + 
		"  <td>"+mdValidRatio+"</td>\r\n" + 
		"  <td>"+mdDataName+"</td>\r\n" + 
		"  <td>"+mdTargetVal+"</td>\r\n" + 
		"</tr>";
	
	resultStr += "</tbody>";
	resultStr += "</table>";
	resultStr += "<button type=\"button\" onclick=\"reTrain();\" id=\"detail_btn\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">재학습</button>";

	document.getElementById("detailTb").innerHTML = resultStr;
}

function reTrain() {
	let modelId = document.getElementById("trainId").value;
	
	let reTrainFrom = document.getElementById("reTrainFrom");
	 
	let input = document.createElement("input");
     input.type = "hidden";
     input.name = "modelId";
     input.value = modelId;
     reTrainFrom.appendChild(input);
     
     input = document.createElement("input");
     input.type = "hidden";
     input.name = "callTrainChk";
     input.value = "1";
     reTrainFrom.appendChild(input);
     
     input = document.createElement("input");
     input.type = "hidden";
     input.name = "reTrainChk";
     input.value = "1";
     reTrainFrom.appendChild(input);
     
//     document.body.appendChild(reTrainFrom);
     reTrainFrom.submit();
//     document.body.removeChild(reTrainFrom);
}

function selectRequestInfo(event, id, modelState) {
	
	event.stopPropagation();
	// 모든 행의 배경색을 원래대로 초기화
    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.backgroundColor = ""; // 기본값으로 리셋
    });

    // 현재 클릭된 history 아이콘이 속한 tr 찾기
    let row = event.target.closest("tr");
    if (row) {
        row.style.backgroundColor = "#ADD8E6"; // 원하는 색상으로 변경
    }
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectRequestInfo",
		data : JSON.stringify({
	        "modelId": id,
	        "modelState": modelState
	    }),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridDockerInfo(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridDockerInfo(data) {
	let mdId = data.modelId;
	let mdOutDataPath = data.outdataPath;

	let mdModelOrgName = data.modelOrgName;
	let mdTargetVal = data.targetVal;
	let mdFeatures= data.features;
	let mdOutDataName = data.outdataName;
	let mdDockerHost = data.dockerHost;
	let mdDockerPort = data.dockerPort;
	let mdDockerUrl = data.dockerUrl;
	
	if(mdFeatures == "" || mdFeatures == null){
		mdFeatures = "없음";
	}
	if(mdTargetVal == "" || mdTargetVal == null){
		mdTargetVal = "없음";
	}
	
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th rowspan=\"2\" scope=\"col\" width=\"40%\">모델명</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">목표 변수</th>\r\n" + 
		"    <th scope=\"col\" width=\"45%\">관계 변수</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";
	
	resultStr += 
		"<tr>\r\n" + 
		"  <td>"+mdModelOrgName+"</td>\r\n" + 
//		"  <td>"+mdType+"</td>\r\n" + 
		"  <td>"+mdTargetVal+"</td>\r\n" + 
		"  <td>"+mdFeatures+"</td>\r\n" + 
		"</tr>";
	
	resultStr += 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">데이터셋</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">도커 HOST</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">도커 PORT</th>\r\n" + 
		"    <th scope=\"col\" width=\"25%\">도커 URL</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";
	
	resultStr += 
		"<tr>\r\n" + 
		"  <td>"+mdOutDataName+"</td>\r\n" + 
		"  <td>"+mdDockerHost+"</td>\r\n" + 
		"  <td>"+mdDockerPort+"</td>\r\n" + 
		"  <td>"+mdDockerUrl+"</td>\r\n" + 
		"</tr>";
	
	resultStr += "</tbody>";
	resultStr += "</table>";

	document.getElementById("dockerTb").innerHTML = resultStr;

	
	toggleTb('dockerTb');
}

/**
 * @param event
 * @param id
 * @returns
 */
function selectHistory(event, id) {
	
	
	event.stopPropagation();
	// 모든 행의 배경색을 원래대로 초기화
    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.backgroundColor = ""; // 기본값으로 리셋
    });

    // 현재 클릭된 history 아이콘이 속한 tr 찾기
    try{
    	let row = event.target.closest("tr");
    	if (row) {
    		row.style.backgroundColor = "#ADD8E6"; // 원하는 색상으로 변경
    	}
    } catch(error){
    	console.log(error);
    	selectedColor();
    }
	
	toggleTb('historyTb');
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "selectModelHistory",
		data : JSON.stringify({
	        "model_id": id
	    }),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			gridHistory(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
}

function gridHistory(data) {
	let historyCnt = data.length;
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"<thead>\r\n" + 
		"  <tr>\r\n" + 
		"    <th scope=\"col\" width=\"27%\">모델명</th>\r\n" + 
		"    <th scope=\"col\" width=\"23%\">학습 일시</th>\r\n" + 
		"    <th scope=\"col\" width=\"13%\">R2_SCORE</th>\r\n" + 
		"    <th scope=\"col\" width=\"13%\">정확도</th>\r\n" + 
		"    <th scope=\"col\" width=\"15%\">적용상태 "+"<span class=\"tooltip-left\" data-tooltip=\"배포중인 모델을 확인하여 변경하거나 중단할 수 있습니다.\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</th>\r\n" + 
		"    <th scope=\"col\" width=\"9%\">삭제</th>\r\n" + 
		"  </tr>\r\n" + 
		"</thead>\r\n" + 
		"<tbody>";

	
	for(let i=0; i<data.length; i++) {
		
		let dtId = data[i].DETAIL_ID;
		let mdId = data[i].MODEL_ID;
		let mdViewName = data[i].MODEL_VIEW_NAME;
		let mdOrgName = data[i].MODEL_ORG_NAME;
		let mdState = data[i].MODEL_STATE;
		let mdDataTime = data[i].DATETIME;
		let mdMape = data[i].MAPE;
		let mdR2 = data[i].R2;
		mdR2 = parseFloat(mdR2);
		mdR2 = (mdR2*100).toFixed(2)+"%";
		let mdAcc = 1-mdMape;
		let mdCdd = mdAcc*100;
		mdCdd = parseFloat(mdCdd).toFixed(2)+"%";
		if(mdMape=="" || mdMape==null){
			mdCdd="없음";
		}


		let stateNm = "";
		let stateImg = "";
		if(mdState=='A'){
			stateNm = "적용중";
			stateImg = "stop.png";
		}else{
			stateNm = "대기중";
			stateImg = "play.png";
		}
		
		resultStr += 
			"<tr>\r\n" + 
			"<td>"+mdOrgName+"</td>\r\n" + 
			"<td>"+mdDataTime+"</td>\r\n" + 
			"<td>"+mdR2+"</td>\r\n" + 
			"<td>"+mdCdd+"</td>\r\n" + 
			"<td><a href=\"javascript:void(0)\">";
			if(mdState=='A'){
				resultStr += 
					"<img src=\"images/"+stateImg+"\" onclick=\"stopModel('"+data[i].MODEL_ID+"');\">";
			}else{
				resultStr += 
					"<img src=\"images/"+stateImg+"\" onclick=\"startModel('"+data[i].DETAIL_ID+"','"+data[i].MODEL_ID+"');\">";
			}
			resultStr += 
				"</a><br>("+stateNm+")</td>\r\n" +
				"<td><a href=\"javascript:void(0)\"><img src=\"images/delete.png\" onclick=\"deleteModel('"+data[i].DETAIL_ID+"','"+data[i].MODEL_ID+"','"+historyCnt+"','"+mdState+"');\"></a></td>\r\n" + 
				"</tr>";
	}
	
	resultStr += "</tbody>";
	resultStr += "</table>";
	
	document.getElementById("historyTb").innerHTML = resultStr;
}

function stopModel(id) {
	const userConfirmed = confirm("모델을 중지 하시겠습니까?");
		
		if(userConfirmed){
			
			$.ajaxSetup({cache:false});
			$.ajax({
				contentType : "application/json; charset=UTF-8",
				type : "POST",
				url : "stopRunningModel",
				data : JSON.stringify({
					"modelId": id
				}),
				cache: false,
				timeout : 30000,
				success : function(data) {
					console.log(data);
					if(data=="success"){
						alert("모델이 중지 되었습니다.")
						selectModelCntAfter(id);
					}else{
						alert("모델이 중지에 문제가 발생했습니다. 관리자에게 문의 하십시오.")
					}
				},
				error: function(jqxhr, status, error){
					console.log(jqxhr.statusText + ",  " + status + ",   " + error);
					console.log(jqxhr.status);
					console.log(jqxhr.responseText);
				}
			});
		}
	}


function startModel(did, mid) {
const userConfirmed = confirm("해당 모델을 실행 하시겠습니까?");
	
	if(userConfirmed){
		
		$.ajaxSetup({cache:false});
		$.ajax({
			contentType : "application/json; charset=UTF-8",
			type : "POST",
			url : "updateActiveModel",
			data : JSON.stringify({
				"modelId": mid,
				"detailId": did
			}),
			cache: false,
			timeout : 30000,
			success : function(data) {
				console.log(data);
				if(data=="success"){
					alert("모델이 실행 되었습니다.")
					selectModelCntAfter(mid);
				}else{
					alert("모델이 변경에 문제가 발생했습니다. 관리자에게 문의 하십시오.")
				}
			},
			error: function(jqxhr, status, error){
				console.log(jqxhr.statusText + ",  " + status + ",   " + error);
				console.log(jqxhr.status);
				console.log(jqxhr.responseText);
			}
		});
	}
}

function deleteModel(did,mid,cnt,state) {
	const userConfirmed = confirm("모델을 삭제 하시겠습니까?");
	
	if(userConfirmed){
		
		$.ajaxSetup({cache:false});
		$.ajax({
			contentType : "application/json; charset=UTF-8",
			type : "POST",
			url : "deleteModelHistory",
			data : JSON.stringify({
				"detailId": did,
				"modelId": mid,
				"detailCnt": cnt,
				"detailState": state
			}),
			cache: false,
			timeout : 30000,
			success : function(data) {
				console.log(data);
				alert("모델이 삭제 되었습니다.")
				selectModelCntAfter(mid);
			},
			error: function(jqxhr, status, error){
				console.log(jqxhr.statusText + ",  " + status + ",   " + error);
				console.log(jqxhr.status);
				console.log(jqxhr.responseText);
			}
		});
	}
}

function makeLearning(id) {
	let resultStr = "";
	
	$.ajaxSetup({cache:false});
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		type : "POST",
		url : "deleteModelHistory",
		data : JSON.stringify({
			"model_id": id
		}),
		cache: false,
		timeout : 30000,
		success : function(data) {
			console.log(data);
			alert("모델 " + data.MODEL_ORG_NAME+"이 삭제 되었습니다.")
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr.statusText + ",  " + status + ",   " + error);
			console.log(jqxhr.status);
			console.log(jqxhr.responseText);
		}
	});
	
}

function aiFeedLeading(data) {
	let resultStr = "";
	resultStr += "";
	for(let i=0; i<data.length; i++){
		let mdId = data[i].MODEL_ID;
		let mdViewName = data[i].MODEL_VIEW_NAME;
		let mdOrgName = data[i].MODEL_ORG_NAME;
		let mdDataTime = data[i].DATETIME;
		let mdMape = data[i].MAPE;
		let mdAcc = 1-mdMape;
		if(mdMape=="없음"){
			mdAcc=mdMape;
		}
		
		resultStr += 
			"<tr>\r\n" + 
			"<td>"+mdOrgName+"<br>("+mdViewName+")</td>\r\n" + 
			"<td>"+mdDataTime+"</td>\r\n" + 
			"<td>"+mdAcc+"</td>\r\n" + 
			"<td><a href=\"javascript:void(0)\"><form action='/urlsModel' method=POST><img src=\"images/delete.png\"></a></td>\r\n" + 
			"</tr>";
		
		resultStr +=
			"<form action='/jstl' method=POST>" +
				"<input type='text' id='jsId' value=>" +
			"</form>";
	}
} 


function goUrl(index) {
	console.log(dataList);
	console.log(dataList[index].URL);
	
	var form = document.createElement("form");
    form.method = "POST";
    form.action = dataList[index].URL;
    form.target = "_blank";
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

$(document).ready(function () { // 처음 호출되었을 때 세팅
	selectModelCnt();
	
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl\">모델</li>"+
	"<li class=\"fl\">></li>\r\n" + 
	"<li class=\"fl current\"><a href=\"modelMgmt\">모델관리</a></li>";
	topNav.innerHTML = navText;
	
});