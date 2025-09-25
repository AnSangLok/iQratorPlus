let parameters = {};
const oracleReservedWords =["DATE", "GROUP", "ORDER", "LEVEL", "USER", "ROW", "TABLE", "VIEW", "SESSION", "NUMBER", "WHERE", "FROM", "SELECT"];
var currentPid = "";
var pidList = ["trainMode", "dataTypeSelect", "cleaningData", "algorithmSelect", "algorithmDetail", "trainResult", "fixModel"];
//var pidList = ["trainMode", "dataTypeSelect", "cleaningData", "filteringData", "algorithmSelect", "algorithmDetail", "trainResult", "fixModel"];

function displaySelector(id) {
	
	const trainDiv = document.getElementById("trainDiv");
	const childDivs = trainDiv.children;

	Array.from(childDivs).forEach(child => {
	  if (child.tagName === "DIV") {
	    child.style.display = "none";
	  }
	});

	document.getElementById(id).style.display = "";
	
	if(id == "reTrainMode"){
		currentPid = "trainMode";
		id = "trainMode";
	}
	
	if(id == "filteringData"){
		currentPid = "cleaningData";
		id = "cleaningData";
	}
	
	let currentIdx = pidList.indexOf(currentPid);
	let idx = pidList.indexOf(id);
	let iconList = document.getElementsByClassName("icon_check");
	console.log(iconList);
	pidList.forEach((pid, i) => {
		let pidEle = iconList[i];
		// 현재 단계에 따라 아이콘 변경
		if(i <= currentIdx){
			pidEle.src = "images/check_on.png";
			pidEle.parentElement.parentElement.setAttribute("href", "javascript:void(0)");
			pidEle.parentElement.parentElement.setAttribute("onclick", "javascript:displaySelector('" + pidList[i] + "');");
			pidEle.parentElement.parentElement.parentElement.classList.remove("tab_menu_off");
			pidEle.parentElement.parentElement.parentElement.classList.add("tab_menu_on");
		}else{
			pidEle.src = "images/check_off.png";
			pidEle.parentElement.parentElement.removeAttribute("href");
			pidEle.parentElement.parentElement.removeAttribute("onclick");
			pidEle.parentElement.parentElement.parentElement.classList.remove("tab_menu_on");
			pidEle.parentElement.parentElement.parentElement.classList.add("tab_menu_off");
		}
		// 현재 클릭한 단계
		if(i == idx){
			pidEle.nextElementSibling.className = "diagram_active font-weight-medium";
		}else{
			pidEle.nextElementSibling.className = "font-weight-normal";
		}
	});
}

function requestTableList() {
	$.ajax({
		contentType : false,
		processData: false,
		type: "POST",
        url: "requestTableList",
		timeout : 30000,
        success: function(data) {
            console.log(data);
            gridTableList(data);
        },
        error: function(xhr, status, error) {
            console.error("파일 업로드 실패:", error);
            console.log(error);
        },
        complete: function() {
//        	Load.hideLoader();
        }
    });
}

function gridTableList(data) {
	gridSqlBox();
	let setpId = "tableList";
	
	let resultStr = 
		"<table id=\"listTb\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"    <thead>\r\n" +
		"      <tr>\r\n" + 
		"        <th scope=\"col\">Table Name</th>\r\n" + 
		"      </tr>\r\n" +
		"    </thead>\r\n" + 
		"    <tbody>\r\n"; 
	for (let i=0; i<data.length; i++) {
		resultStr +=
			"       <tr>\r\n" + 
			"         <td onclick=\"requestTableInfo('"+data[i].tableName+"');\">"+data[i].tableName+"</td>\r\n" + 
			"       </tr>\r\n";
	}
	resultStr +=
		"    </tbody>\r\n" + 
		"</table>\r\n";
	
	let htmlForm = document.getElementById(setpId);
	htmlForm.innerHTML = resultStr;
    
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
	
	displaySelector("dataBaseView");
}

function requestTableInfo(tableName) {
	document.getElementById("selectedTb").value=tableName;
	$.ajax({
        url: 'requestTableInfo',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	tableName: tableName
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridTableInfo(data);
            queryOption();
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}

function gridTableInfo(data) {
	let setpId = "tableInfo";
	let columnList = "";
	let resultStr =
		"<table id=\"infoTb\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n" + 
		"        <th scope=\"col\" width=\"60%\">Column Name</th>\r\n" + 
		"        <th scope=\"col\" width=\"25%\">Data Type</th>\r\n" + 
		"        <th scope=\"col\" width=\"15%\">Null Able</th>\r\n" + 
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n";
	for (let i=0; i<data.length; i++) {
		if(i==0){
			columnList += data[i].columnName;
		}else{
			columnList += ", "+data[i].columnName;
		}
		resultStr +=
			"      <tr>\r\n" + 
			"        <td>"+data[i].columnName+"</td>\r\n" + 
			"        <td>"+data[i].dataType+"</td>\r\n" + 
			"        <td>"+data[i].nullAble+"</td>\r\n" + 
			"      </tr>\r\n";
	}
	resultStr +=
		"    </tbody>\r\n" + 
		"</table>\r\n";
	
	let htmlForm = document.getElementById(setpId);
	htmlForm.innerHTML = resultStr;

	let tbName = document.getElementById("selectedTb").value;
	document.getElementById("tbColList").value = columnList;
//	const templateElement = document.getElementById("queryTemplate");
//	templateElement.innerHTML = '';
//	
//	let baseOption = document.createElement("option");
//    baseOption.textContent = tbName+" 쿼리 템플릿 목록";
//    templateElement.appendChild(baseOption);
//    
//    for(let i=0; i<3; i++){
//    	const option = document.createElement("option");
//    	option.textContent = "쿼리 예시"+(i+1);
//    	option.value = i;
//    	templateElement.appendChild(option);
//    }
	
}

function queryOption(){
	let tbName = document.getElementById("selectedTb").value;
	let columnList = document.getElementById("tbColList").value;
	let tmpList = columnList.split(", ");
	let finalList = "";
	// Set을 사용하여 oracleReservedWords 배열을 대소문자 구분 없이 빠르게 검색
	const oracleReservedWordsSet = new Set(oracleReservedWords.map(word => word.toUpperCase().trim()));
	for (let i = 0; i < tmpList.length; i++) {
	    let currentItem = tmpList[i].trim();  // 양쪽 공백 제거
	    console.log("Checking:", currentItem);  // 각 항목 확인
	    if (oracleReservedWordsSet.has(currentItem.toUpperCase())) {
	        finalList += "\"" + tmpList[i] + "\", ";  // 예약어인 경우 쌍따옴표 추가
	    } else {
	        finalList += tmpList[i] + ", ";  // 예약어가 아닌 경우 그대로 추가
	    }
	}
	finalList = finalList.replace(/\s*,\s*$/, '');
	
	let query = "";
	query = "SELECT \n"+finalList+" \nFROM "+tbName;
//	if(value==0){
//	query = "SELECT \n"+finalList+" \nFROM "+tbName;
//	} else if(value==1){
//		query = "SELECT \n"+finalList+" \nFROM "+tbName;
//	} else if(value==2){
//		query = "SELECT \n"+finalList+" \nFROM "+tbName;
//	}
	document.getElementById("sqlArea").value = query;
}

function gridSqlBox() {
	let setpId = "makeSQL";
	let resultStr = 
//		"<select class=\"form-control\" id=\"queryTemplate\" onchange='queryOption(this.value)';>\r\n" + 
//		"    <option>쿼리 템플릿 목록</option>\r\n" + 
//		"</select>\r\n" + 
		"<select class=\"form-control\" id=\"rowsOpt\">\r\n" + 
		"    <option value='50'>50rows</option>\r\n" + 
		"    <option value='100'>100rows</option>\r\n" + 
		"    <option value='200' selected>200rows</option>\r\n" + 
		"    <option value='500'>500rows</option>\r\n" + 
		"    <option value='1000'>1000rows</option>\r\n" + 
		"</select>\r\n" + 
		"<textarea id=\"sqlArea\"></textarea>\r\n";
		
	let htmlForm = document.getElementById(setpId);
	htmlForm.innerHTML = resultStr;
}

function excuteQuery(){
	let query = document.getElementById("sqlArea").value;
	let rows = document.getElementById("rowsOpt").value;
	
	console.log(query);
	
	Load.showLoader();
	
	$.ajax({
        url: 'excuteQuery',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	query: query
        	,rows: rows
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridQueryResult(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}

function sqlModal() {
	document.getElementById("sqlModal").style.display = "block";
	let sqlText = document.getElementById("sqlArea").value;
	document.getElementById("sqltext").value = sqlText;
	
}

function sqlClose(){
	document.getElementById("sqlModal").style.display = "none";
}

function trainQuery() {
	let sqlText = document.getElementById("sqltext").value;
	
	if(sqlText.length<15){
		alert("쿼리문을 입력해 주세요.");
	}else{
		let offset = document.getElementById("offset").value || "0";
		let tmpOffset = Number(offset); // 숫자로 변환
		let fetch = document.getElementById("fetch").value || "1000";
		let tmpFetch = Number(fetch); // 숫자로 변환
		fetch = (tmpFetch - tmpOffset).toString();
		if(tmpFetch>10000){
		    let userConfirmed = window.confirm("데이터 건수가 1만건을 넘을 경우 일부 알고리즘에서 학습 및 예측에 긴 시간이 소요 될수 있습니다. 진행하시겠습니까?");
		    if (!userConfirmed) {
                return; 
            }
		}
		sqlText = sqlText + " OFFSET " + offset + " ROWS FETCH FIRST " + fetch + " ROWS ONLY";
		
		Load.showLoader();
		$.ajax({
			url: 'uploadFileWithQuery',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				query: sqlText
			}),
			success: function(data) {
				console.log('서버 응답:', data);
				if(data[0].errMsg!=""&&data[0].errMsg!=null){
					let errMsg = "쿼리실행 에러 : " + data[0].errMsg;
					alert(errMsg);
					return;
				}
				gridCleaningData(data);
			},
			error: function(xhr, status, error) {
				console.error('전송 오류:', error);
			},
			complete: function() {
				sqlClose();
				Load.hideLoader();
			}
		});
	}
}

function gridQueryResult(data){
	
	let columnList = data.columnList;
	let contentsList = data.contentsList;
	
	let resultStr = 
		"<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"    <thead>\r\n" + 
		"      <tr>\r\n";
		for (let i=0; i<columnList.length; i++) {
			resultStr +=
				"<th scope=\"col\" style=\"padding: 12px;\">"+columnList[i]+"</th>\r\n";
		}
	resultStr +=
		"      </tr>\r\n" + 
		"    </thead>\r\n" + 
		"    <tbody>\r\n";
	for (let i = 0; i < contentsList.length; i++) {
	    resultStr += "<tr>\r\n";
	    for (let j = 0; j < columnList.length; j++) {
	        let columnName = columnList[j]; // columnList의 현재 컬럼 이름
	        let cellValue = contentsList[i][columnName]; // 현재 row에서 컬럼 이름으로 값 추출
	        resultStr += `<td>${cellValue != null ? cellValue : ''}</td>\r\n`;
	    }
	    resultStr += "</tr>\r\n";
	}
	resultStr += 
		"    </tbody>\r\n" + 
		"</table>";
	
	let htmlForm = document.getElementById("sqlQueryList");
	
	htmlForm.innerHTML = resultStr;
	
}


function gridTrainMode() {
	let setpId = "trainMode";
	currentPid = "trainMode";
	displaySelector(setpId);
	
	let resultStr = 
		"<div class=\"model_box\">\r\n" + 
		"    <a href=\"javascript:void(0);\" onclick=\"gridDataTypeSelect();\" class=\"mr_100\"><span>신규 학습</span></a>\r\n" + 
		"    <a href=\"javascript:void(0);\" onclick=\"requestReTrainList();\"><span>모델 재학습</span></a>\r\n" + 
		"</div>";
	
	document.getElementById(setpId).innerHTML = resultStr;
}

function requestReTrainList() {
	
	$.ajax({
		contentType : false,
		processData: false,
		type: "POST",
        url: "reTrainList",
		timeout : 30000,
        success: function(data) {
            console.log(data);
        	gridReTrain(data);
        },
        error: function(xhr, status, error) {
            console.error("파일 업로드 실패:", error);
            console.log(error);
        },
        complete: function() {
        }
    });
}

function gridReTrain(data) {
	let setpId = "reTrainMode";
	currentPid = "reTrainMode";
	displaySelector(setpId);
	
	let resultStr = 
		"        <select class=\"select\" id=\"reTrainOpt\">\r\n" + 
		"            <option value=\"\" selected>재학습할 모델을 선택해 주세요.</option>\r\n";
	for(let i=0; i<data.length; i++){
		resultStr += 
			"            <option value=\""+data[i].modelId+"\">"+data[i].modelViewName+"</option>\r\n";
	}
	resultStr += 
		"        </select>\r\n" + 
		"            <button class=\"btn\" type=\"button\" onclick=\"chkReTrainValue();\">재학습</button>"; 
	
	document.getElementById(setpId).innerHTML = resultStr;

	let reTrainId = document.getElementById("reTrainId").value;
	let reTrainOpt = document.getElementById("reTrainOpt");
	reTrainOpt.value = reTrainId;
}

function chkReTrainValue() {
	let reTrainOpt = document.getElementById("reTrainOpt");
	if(reTrainOpt.value.length>1){
		document.getElementById("reTrainModal").style.display = "block";
		
		// "기존" 버튼에 클릭 이벤트를 추가하여 원하는 함수 실행
		document.getElementById("submitBtnn1").onclick = function() {
            // 기존 버튼 클릭 시 실행할 코드
            document.getElementById("reTrainChk").value = "1";
            document.getElementById("reTrainId").value = reTrainOpt.value;
            document.getElementById("reTrainDataChk").value = "1";
            requestExistData();
            
            // 모달 닫기
            document.getElementById("reTrainModal").style.display = "none";
        };
        
     // "신규" 버튼에 클릭 이벤트를 추가하여 원하는 함수 실행
        document.getElementById("submitBtnn2").onclick = function() {
            // 신규 버튼 클릭 시 실행할 코드
            document.getElementById("reTrainChk").value = "1";
            document.getElementById("reTrainId").value = reTrainOpt.value;
            document.getElementById("reTrainDataChk").value = "0";
            gridDataTypeSelect();
            
            // 모달 닫기
            document.getElementById("reTrainModal").style.display = "none";
        };
		
	}else{
		alert("재학습할 데이터를 선택해 주세요.")
	}
}

function gridDataTypeSelect() {
	let setpId = "dataTypeSelect";
	currentPid = "dataTypeSelect";
	displaySelector(setpId);
	
	let resultStr = 
		"<div class=\"upload_box\">\r\n" + 
		"    <div class=\"img_area\"><img src=\"images/icon_file.png\"></div>\r\n" + 
		"    <div class=\"btn_area\" onclick=\"selectFile();\"><button type=\"button\" class=\"btn_upload\">파일 업로드</button></div>\r\n" + 
		"</div>\r\n" + 
		"<div class=\"upload_box\">\r\n" + 
		"    <div class=\"img_area\"><img src=\"images/icon_data.png\"></div>\r\n" + 
		"    <div class=\"btn_area\" onclick=\"requestTableList();\"><button type=\"button\" class=\"btn_upload\">DATA BASE 업로드</button></div>\r\n" + 
		"</div>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
}
function selectFile() {
    const fileInput = document.getElementById("fileInput");
    fileInput.value = "";
    Load.showLoader();    // 로딩바 표시
    document.getElementById("fileInput").click();
//    fileInput.addEventListener("change", uploadFile, { once: true });

    // 다이얼로그가 닫힌 후 포커스가 돌아올 때 파일 선택 여부 확인
    window.addEventListener("focus", function onFocus() {
        setTimeout(function() {
            if (fileInput.files.length === 0) {
                // 사용자가 파일 선택을 취소한 경우 로딩바 숨김
                Load.hideLoader();
            }
        }, 100); // 약간의 지연을 줘서 파일 선택 상태가 반영되도록 함
        window.removeEventListener("focus", onFocus);
    });
}

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    
    if (fileInput.files.length === 0) {
        alert("파일을 선택해주세요.");
        Load.hideLoader(); // 파일이 없으면 로딩바 숨김
        return;
    }
//    Load.showLoader();
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    $.ajax({
		contentType : false,
		processData: false,
		type: "POST",
        url: "uploadFile",
        data: formData,
		timeout : 30000,
        success: function(data) {
//            console.log(data);
            gridCleaningData(data);
        },
        error: function(xhr, status, error) {
            console.error("파일 업로드 실패:", error);
            console.log(error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}

function requestExistData() {

	Load.showLoader();
	
	modelId = document.getElementById("reTrainId").value;
	
	
	$.ajax({
        url: 'requestExistData', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	modelId : modelId
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            gridExistCleaningData(data);
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}

function gridCleaningData(data) {
	let setpId = "cleaningData";
	currentPid = "cleaningData";
	displaySelector(setpId);
	
	let resultStr = 
		"<div class=\"table_area3\">" + 
		"                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"                    <thead>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <th scope=\"col\">변수명</th>\r\n" + 
		"                        <th scope=\"col\">변수 유형</th>\r\n" + 
		"                        <th scope=\"col\">최솟값</th>\r\n" + 
		"                        <th scope=\"col\">최댓값</th>\r\n" + 
		"                        <th scope=\"col\">유일값</th>\r\n" + 
		"                        <th scope=\"col\">중복값</th>\r\n" + 
		"                        <th scope=\"col\">결측값</th>\r\n" + 
		"                        <th scope=\"col\">평균</th>\r\n" + 
		"                        <th scope=\"col\">평균편차</th>\r\n" + 
		"                        <th scope=\"col\">사용</th>\r\n" + 
		"                        <th scope=\"col\">목표변수 "+"<span class=\"tooltip-left\" data-tooltip=\"날짜에 따라 예측할 값을 의미합니다.\">\r\n" + 
		"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
		"</span>"+"</th>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </thead>\r\n" + 
		"                    <tbody>\r\n";
	for(let i=0; i<data.length; i++){
		let typeSelect = "";
		if(data[i].valueType=="NUM"){
			typeSelect = 
				"<a value=\"숫자\">숫자</a>" ;
//			"                                <option>날짜</option>\r\n" + 
//			"                                <option>문자</option>\r\n" + 
//			"                                <option selected>숫자</option>\r\n" ;
		} else if(data[i].valueType=="DATE"){
			typeSelect = 
				"<a value=\"날짜\">날짜</a>";
//			"                                <option selected>날짜</option>\r\n" + 
//			"                                <option>문자</option>\r\n" + 
//			"                                <option>숫자</option>\r\n";
		} else{
			typeSelect = 
				"<a value=\"문자\">문자</a>";
//			"                                <option>날짜</option>\r\n" + 
//			"                                <option selected>문자</option>\r\n" + 
//			"                                <option>숫자</option>\r\n";
		}
		let min = data[i].min
		let max = data[i].max
		let mean = data[i].mean;
		let meanDeviation = data[i].meanDeviation;
		if (mean === null) {
		  mean = "없음";
		} else {
		  mean = parseFloat(mean).toFixed(2);
		}
		if (meanDeviation === null) {
			meanDeviation = "없음";
		} else {
			meanDeviation = parseFloat(meanDeviation).toFixed(2);
		}
		if (min === null) {
			min = "없음";
		} else {
			min = min.split("T")[0];
			min = min.split(" ")[0];
		}
		if (max === null) {
			max = "없음";
		} else {
			max = max.split("T")[0];
			max = max.split(" ")[0];
		}
		
		resultStr += 
			"                      <tr>\r\n" + 
			"                        <td>"+data[i].columnName+"</td>\r\n" + 
			"                        <td>\r\n" + 
											typeSelect + 
//			"                            <select class=\"table_select\">\r\n" + typeSelect + "</select>\r\n" + 
			"                        </td>\r\n" + 
			"                        <td>"+min+"</td>\r\n" + 
			"                        <td>"+max+"</td>\r\n" + 
			"                        <td>"+data[i].uniqueCnt+"</td>\r\n" + 
			"                        <td>"+data[i].duplicateCnt+"</td>\r\n" + 
			"                        <td>"+data[i].missingCnt+"</td>\r\n" + 
			"                        <td>"+mean+"</td>\r\n" + 
			"                        <td>"+meanDeviation+"</td>\r\n"; 
		if(data[i].valueType=="NUM") {
			resultStr += 
				"                        <td><input type=\"checkbox\" class=\"checkbox variable-checkbox\" data-variable-name=\""+data[i].columnName+"\"  onchange=\"syncTarget(this);\" checked></td>\r\n" + 
				"                        <td><input type=\"checkbox\" class=\"checkbox target-checkbox\" data-target-name=\""+data[i].columnName+"\" onchange=\"toggleCheckboxes(this); syncVar(this);\"></td>\r\n";
		}else if(data[i].valueType=="DATE") {
			resultStr += 
				"                        <td><input type=\"checkbox\" class=\"checkbox variable-checkbox\" data-variable-name=\""+data[i].columnName+"\"  onchange=\"syncTarget(this);\" checked></td>\r\n" + 
				"                        <td><input type=\"checkbox\" class=\"checkbox target-date-checkbox\" disabled></td>\r\n";
		}else{
			resultStr += 
				"                        <td><input type=\"checkbox\" class=\"checkbox variable-checkbox\" data-variable-name=\""+data[i].columnName+"\"  onchange=\"syncTarget(this);\" disabled></td>\r\n" + 
				"                        <td><input type=\"checkbox\" class=\"checkbox target-date-checkbox\" disabled></td>\r\n";
		}
		resultStr += 	
			"                      </tr>\r\n";
	}
	resultStr += 
		"                    </tbody>\r\n" + 
		"                </table>\r\n" + 
		"</div>";
	
	resultStr += "<button type=\"button\" onclick=\"sendSelectedVariables();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">다음</button>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
}


function gridExistCleaningData(data) {
	let setpId = "cleaningData";
	currentPid = "cleaningData";
	displaySelector(setpId);
	
	let dataList = data.dataList;
	let existInfo = data.existInfo;
	
	let resultStr = 
		"<div class=\"col-lg-12\">\r\n" + 
		"    <div class=\"card\">\r\n" + 
		"        <div class=\"card-body\">\r\n" + 
		"            \r\n" + 
		"            <!-- table-->\r\n" + 
		"            <div class=\"table_area3\">\r\n" + 
		"                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"                    <thead>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <th scope=\"col\">변수명</th>\r\n" + 
		"                        <th scope=\"col\">변수 유형</th>\r\n" + 
		"                        <th scope=\"col\">최솟값</th>\r\n" + 
		"                        <th scope=\"col\">최댓값</th>\r\n" + 
		"                        <th scope=\"col\">유일값</th>\r\n" + 
		"                        <th scope=\"col\">중복값</th>\r\n" + 
		"                        <th scope=\"col\">결측값</th>\r\n" + 
		"                        <th scope=\"col\">평균</th>\r\n" + 
		"                        <th scope=\"col\">평균편차</th>\r\n" + 
		"                        <th scope=\"col\">사용</th>\r\n" + 
		"                        <th scope=\"col\">목표변수</th>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </thead>\r\n" + 
		"                    <tbody>\r\n";
	for(let i=0; i<dataList.length; i++){
		let typeSelect = "";
		if(dataList[i].valueType=="NUM"){
			typeSelect = 
				"<a value=\"숫자\">숫자</a>" ;
//			"                                <option>날짜</option>\r\n" + 
//			"                                <option>문자</option>\r\n" + 
//			"                                <option selected>숫자</option>\r\n" ;
		} else if(dataList[i].valueType=="DATE"){
			typeSelect = 
				"<a value=\"날짜\">날짜</a>";
//			"                                <option selected>날짜</option>\r\n" + 
//			"                                <option>문자</option>\r\n" + 
//			"                                <option>숫자</option>\r\n";
		} else{
			typeSelect = 
				"<a value=\"문자\">문자</a>";
//			"                                <option>날짜</option>\r\n" + 
//			"                                <option selected>문자</option>\r\n" + 
//			"                                <option>숫자</option>\r\n";
		}
		
		resultStr += 
			"                      <tr>\r\n" + 
			"                        <td>"+dataList[i].columnName+"</td>\r\n" + 
			"                        <td>\r\n" + 
											typeSelect + 
//			"                            <select class=\"table_select\">\r\n" + typeSelect + "</select>\r\n" + 
			"                        </td>\r\n" + 
			"                        <td>"+dataList[i].min.split("T")[0]+"</td>\r\n" + 
			"                        <td>"+dataList[i].max.split("T")[0]+"</td>\r\n" + 
			"                        <td>"+dataList[i].uniqueCnt+"</td>\r\n" + 
			"                        <td>"+dataList[i].duplicateCnt+"</td>\r\n" + 
			"                        <td>"+dataList[i].missingCnt+"</td>\r\n" + 
			"                        <td>"+dataList[i].mean+"</td>\r\n" + 
			"                        <td>"+dataList[i].meanDeviation+"</td>\r\n" + 
			"                        <td><input type=\"checkbox\" class=\"checkbox variable-checkbox\" data-variable-name=\""+dataList[i].columnName+"\" onchange=\"syncTarget(this);\" checked></td>\r\n";
		if(dataList[i].valueType=="NUM") {
			resultStr += 
				"                        <td><input type=\"checkbox\" class=\"checkbox target-checkbox\" data-target-name=\""+dataList[i].columnName+"\" onchange=\"toggleCheckboxes(this); syncVar(this);\"></td>\r\n";
		}else{
			resultStr += 
				"                        <td><input type=\"checkbox\" class=\"checkbox target-date-checkbox\" disabled></td>\r\n";
		}
		resultStr += 	
			"                      </tr>\r\n";
	}
	resultStr += 
		"                    </tbody>\r\n" + 
		"                </table>\r\n" + 
		"            </div>\r\n" + 
		"        </div>\r\n" + 
		"    </div>\r\n" + 
		"</div>";
	
	resultStr += "<button type=\"button\" onclick=\"sendSelectedVariables();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">다음</button>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
}

function syncTarget(currentCheckbox) {
  // 첫 번째 열 체크박스 변경 시
  if (!currentCheckbox.checked) {
    // 체크 해제 시, 같은 행의 두 번째 열 체크박스도 해제
    $(currentCheckbox).closest('tr').find('.target-checkbox').prop('checked', false);
    toggleCheckboxes(currentCheckbox);
  }
}

function syncVar(currentCheckbox) {
  // 두 번째 열 체크박스 변경 시
  $(currentCheckbox).closest('tr').find('.variable-checkbox').prop('checked', true);
}

function toggleCheckboxes(currentCheckbox) {
    // 모든 체크박스를 가져오기
    const checkboxes = document.querySelectorAll('.target-checkbox');

    if (currentCheckbox.checked) {
        // 현재 체크박스를 제외하고 다른 모든 체크박스를 비활성화
        checkboxes.forEach((checkbox) => {
            if (checkbox !== currentCheckbox) {
                checkbox.disabled = true;
            }
        });
    } else {
        // 모든 체크박스를 활성화
        checkboxes.forEach((checkbox) => {
            checkbox.disabled = false;
        });
    }
}

//전역변수
let target = '';

function sendSelectedVariables() {
	let sqlElement = document.getElementById("sqlArea");
	let sqlText = sqlElement ? sqlElement.value : null;
	
	let offsetElement = document.getElementById("offset");
	let offset = offsetElement ? offsetElement.value : null;
	offset  = offset || "0"
	let tmpOffset = Number(offset);
	
	let fetchElement = document.getElementById("fetch");
	let fetch = fetchElement ? fetchElement.value : null;
	fetch  = fetch || "1000"
	let tmpFetch = Number(fetch);
	fetch = (tmpFetch - tmpOffset).toString();

	if(sqlText!=""&&sqlText!=null){
		sqlText = sqlText + " OFFSET " + offset + " ROWS FETCH FIRST " + fetch + " ROWS ONLY";
	}
	
    // 체크된 항목들의 변수명을 배열로 수집
    const selectedVariables = [];
    $('.variable-checkbox:checked').each(function() {
        selectedVariables.push($(this).data('variable-name'));
        console.log(selectedVariables)
    });
    
    let checkedDateColCnt = 0;
    let nonDateNonTargetCount = 0;
    let checkedDateCol = [];
    // 모든 체크된 체크박스들에 대해 반복
    $('.variable-checkbox:checked').each(function() {
      const row = $(this).closest('tr');  // 체크된 항목의 부모 tr을 찾아
      const variableType = row.find('td:nth-child(2) a').attr('value'); // 두 번째 열의 a 태그에서 value 값 가져오기
      const isUsedChecked = row.find('.variable-checkbox:checked').length > 0;  // "사용" 체크박스가 체크되었는지 확인
      
      // 변수 유형이 "날짜"인 경우에만 배열에 추가
      if (variableType === '날짜') {
    	  checkedDateColCnt++;
    	  checkedDateCol.push($(this).data('variable-name'));  // 변수명을 배열에 추가
      } else {
          // "날짜"가 아닌 항목에 대해 목표변수 체크박스를 확인
          const isTargetChecked = row.find('.target-checkbox:checked').length > 0;  // 목표변수 체크박스가 체크된 경우
          if (!isTargetChecked && isUsedChecked) {
              nonDateNonTargetCount++;  // 목표변수가 체크되지 않은 경우 카운트 증가
          }
      }
    });
    
    if(checkedDateColCnt>1){
    	let alertMsg = "학습에는 하나의 날짜 데이터만 사용 가능합니다. 사용중인 날짜 데이터 : " + checkedDateCol;
    	alert(alertMsg);
    	return;
    }
    
    //target값 확인
    target = "";
    $('.target-checkbox:checked').each(function() {
    	target=$(this).data('target-name');
    	console.log(target.length)
    });
    
    if(target.length!=0 && checkedDateColCnt==0){
    	let alertMsg = "목표변수를 선택했을 경우 날짜 데이터를 사용해야 합니다.";
    	alert(alertMsg);
    	return;
    }
    
    
    if(target.length>0 && nonDateNonTargetCount>0){
    	document.getElementById("chkObject").value="1";
    	Load.showLoader();
    	$.ajax({
    		url: '/sendVariables', // 데이터를 전송할 Java 서버의 엔드포인트 URL
    		type: 'POST',
    		contentType: 'application/json',
    		data: JSON.stringify({
    			selectedVariables: selectedVariables,
    			query: sqlText,
    			target: target
    		}),
    		success: function(data) {
    			console.log('서버 응답:', data);
    			if(data.length>0){
    				gridFilteringData(data);
    			}else{
    				console.log(data.length)
    			}
    		},
    		error: function(xhr, status, error) {
    			console.error('전송 오류:', error);
    		},
	        complete: function() {
	        	Load.hideLoader();
	        }
    	});
    } else {
    	if(target.length>0){
    		document.getElementById("chkObject").value="1";
    	}else{
    		document.getElementById("chkObject").value="0";
    	}
    	gridAlgorithmSelect();
    }
}

function syncCheckboxes() {
	  const checkboxes = document.querySelectorAll('.checkbox');

	  checkboxes.forEach(checkbox => {
	    checkbox.addEventListener('change', () => {
	      const variableName = checkbox.dataset.variableName;
	      const targetName = checkbox.dataset.targetName;

	      // 만약 variable-checkbox가 변경되었다면
	      if (variableName) {
	        // 해당하는 target-checkbox를 찾아서 상태를 동기화
	        const targetCheckbox = document.querySelector(`[data-target-name="${targetName}"]`);
	        targetCheckbox.checked = checkbox.checked;
	      }
	    });
	  });
	}


function gridFilteringData(data) {
	let rank = 0;
	let setpId = "filteringData";
	currentPid = "filteringData";
	displaySelector(setpId);
	let resultStr = 
		"            <div class=\"bottom_10\">중요도 <input type=\"text\" class=\"text_box\" id=\"priorityId\"> 이하 데이터 <button type=\"button\" onclick=\"uncheckLowPriority();\" class=\"btn waves-effect waves-light btn-rounded btn-primary\">제거</button>"+"<span class=\"tooltip-bottom\" data-tooltip=\"사용자가 설정한 중요도 이하의 데이터는 사용하지 않습니다.\">\r\n" + 
		"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
		"</span>"+"</div>\r\n" +
		"            <div class=\"table_area3\">\r\n" + 
		"                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"                    <thead>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <th scope=\"col\">사용</th>\r\n" + 
		"                        <th scope=\"col\">순위</th>\r\n" + 
		"                        <th scope=\"col\">변수명</th>\r\n" + 
		"                        <th scope=\"col\">중요도 "+"<span class=\"tooltip-left\" data-tooltip=\"목표변수와 관계변수 사이의 연관성을 계산한 수치 입니다.(합계 100%)\">\r\n" + 
		"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
		"</span>"+"</th>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </thead>\r\n" + 
		"                    <tbody id=\"priority-tbody\">\r\n";
	
	data.forEach(item => {
	    for (let key in item) {
	        if (item.hasOwnProperty(key)) {
	        	rank+=1;
	            resultStr += 
	            	"                      <tr data-priority=\""+(item[key]*100).toFixed(2)+"\">\r\n" + 
	        		"                        <td><span class=\"checkbox\"><input type=\"checkbox\" class=\"filtering-checkbox\" data-filtering-name=\""+key+"\" checked></span></td>\r\n" + 
	        		"                        <td>"+rank+"</td>\r\n" + 
	        		"                        <td>"+key+"</td>\r\n" + 
	        		"                        <td>"+(item[key]*100).toFixed(2)+"%</td>\r\n" + 
	        		"                      </tr>\r\n";
	        }
	    }
	});
	resultStr += 
		"                    </tbody>\r\n" + 
		"                </table>\r\n" + 
		"            </div>\r\n";
	
	resultStr += "<button type=\"button\" onclick=\"gridAlgorithmSelect();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">다음</button>";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
}
//

function uncheckLowPriority() {
    // 모든 행을 가져오기
	const tbody = document.getElementById('priority-tbody');

    const rows = tbody.querySelectorAll('tr');
    
    const standardVal = parseFloat(document.getElementById("priorityId").value);
    
    if(!isNaN(standardVal)){
    	rows.forEach(row => {
    		// 각 행의 중요도 가져오기
    		const priority = parseFloat(row.dataset.priority);
    		
    		if (priority <= standardVal) {
    			// 해당 행의 체크박스 선택 해제
    			const checkbox = row.querySelector('.filtering-checkbox');
    			if (checkbox) {
    				checkbox.checked = false;
    			}
    		}
    	});
    	
    }else{
    	alert("숫자를 입력해 주세요.")
    }
}

function sendSelectedFiltering() {
	let sqlElement = document.getElementById("sqlArea");
	let sqlText = sqlElement ? sqlElement.value : null;
	
	let offsetElement = document.getElementById("offset");
	let offset = offsetElement ? offsetElement.value : null;
	offset  = offset || "0"
	let tmpOffset = Number(offset);
	
	let fetchElement = document.getElementById("fetch");
	let fetch = fetchElement ? fetchElement.value : null;
	fetch  = fetch || "1000"
	let tmpFetch = Number(fetch);
	fetch = (tmpFetch - tmpOffset).toString();
	
	sqlText = sqlText + " OFFSET " + offset + " ROWS FETCH FIRST " + fetch + " ROWS ONLY";
    const tooltip = document.getElementById('slider-tooltip');

	// 텍스트 값 가져오기
	let evalRatio = tooltip.innerText;  // 또는 tooltip.textContent
	evalRatio = evalRatio.replace('%', '');
	
	let reTrain = document.getElementById('reTrainChk').value;
	let reTrainId = document.getElementById('reTrainId').value;
	let algorithmVal = (document.getElementById('algorithmVal').value).toLowerCase();
	let algorithmType = (document.getElementById('algorithmType').value).toLowerCase();
   
	// 체크된 항목들의 변수명을 배열로 수집
    let selectedFiltering = [];
    if(algorithmType=="cluster"){
    	$('.variable-checkbox:checked').each(function() {
        	selectedFiltering.push($(this).data('variable-name'));
        	console.log(selectedFiltering);
        });
    	
    } else if(algorithmType=="regression"){
    	$('.filtering-checkbox:checked').each(function() {
    		selectedFiltering.push($(this).data('filtering-name'));
    		console.log(selectedFiltering);
    	});
    }
    
    let algorithmContainer = '#ALGORITHM-TB' + ' .text_box';
	
	parameters = {};
	$(algorithmContainer).each(function() {
		let key = $(this).closest('tr').find('td:first').text().trim(); // Key는 첫 번째 <td>의 텍스트
		let value = $(this).val(); // Value는 input 필드 값
		parameters[key] = value;
	});
	console.log(parameters);
    
    Load.showLoader();
    console.log(selectedFiltering);
    console.log(target);
    console.log(evalRatio);
    console.log(reTrain);
    console.log(reTrainId);
    console.log(parameters);
    console.log(algorithmType);
    console.log(algorithmVal);

    let reTrainDataChk = document.getElementById("reTrainDataChk").value;
    
	// Java로 전송
    $.ajax({
        url: 'sendFiltering', // 데이터를 전송할 Java 서버의 엔드포인트 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
        	selectedFiltering: selectedFiltering,
            target: target,
            evalRatio: evalRatio,
            reTrain: reTrain,
            reTrainDataChk: reTrainDataChk,
            modelId: reTrainId,
            params: parameters,
            algorithmType: algorithmType,
            query: sqlText,
            algorithmVal: algorithmVal
        }),
        success: function(data) {
            console.log('서버 응답:', data);
            if(algorithmType=="cluster"){
            	gridTrainResult2(data, algorithmVal);
            }else if(algorithmType=="regression"){
            	gridTrainResult(data, algorithmVal);
            }
        },
        error: function(xhr, status, error) {
            console.error('전송 오류:', error);
        },
        complete: function() {
        	Load.hideLoader();
        }
    });
}


function gridAlgorithmSelect() {
	let chkAlgorithm = document.getElementById("chkObject").value;
	console.log(chkAlgorithm);
	
	let setpId = "algorithmSelect";
	currentPid = "algorithmSelect";
	
	let resultStr = "";

	if(chkAlgorithm=="1"){
		resultStr += 
			"<div class=\"upload_box\">\r\n" +
			"    <div class=\"img_area\"><img src=\"images/algorithm_01.png\" class=\"disabled\"></div>\r\n" + 
			"    <div class=\"btn_area\"><button type=\"button\" class=\"btn_upload disabled\" onclick=\"gridAlgorithmDetail('cluster');\" disabled>군집 알고리즘</button></div>\r\n" +
			"<span class=\"tooltip-bottom\" data-tooltip=\"데이터를 학습하여 정상수치와 이상수치를 도출합니다.\" style=\"font-size:16px;\">\r\n" + 
			"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
			"</span>" + 
			"</div>\r\n" + 
			"<div class=\"upload_box\">\r\n" + 
			"    <div class=\"img_area\"><img src=\"images/algorithm_02.png\"></div>\r\n" + 
			"    <div class=\"btn_area\"><button type=\"button\" class=\"btn_upload\" onclick=\"gridAlgorithmDetail('regression');\">시계열 알고리즘</button></div>\r\n" +
			"<span class=\"tooltip-bottom\" data-tooltip=\"날짜에 따른 목표변수를 예측하는 알고리즘 입니다. 목표변수 설정이 반드시 필요합니다.\" style=\"font-size:16px;\">\r\n" + 
			"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
			"</span>"+
			"</div>";
	}else{
		resultStr += 
			"<div class=\"upload_box\">\r\n" +
			"    <div class=\"img_area\"><img src=\"images/algorithm_01.png\"></div>\r\n" + 
			"    <div class=\"btn_area\"><button type=\"button\" class=\"btn_upload\" onclick=\"gridAlgorithmDetail('cluster');\" >군집 알고리즘</button></div>\r\n" +
			"<span class=\"tooltip-bottom\" data-tooltip=\"데이터를 학습하여 정상수치와 이상수치를 도출합니다.\" style=\"font-size:16px;\">\r\n" + 
			"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
			"</span>" + 
			"</div>\r\n" + 
			"<div class=\"upload_box\">\r\n" + 
			"    <div class=\"img_area\"><img src=\"images/algorithm_02.png\" class=\"disabled\"></div>\r\n" + 
			"    <div class=\"btn_area\"><button type=\"button\" class=\"btn_upload disabled\" onclick=\"gridAlgorithmDetail('regression');\" disabled>시계열 알고리즘</button></div>\r\n" +
			"<span class=\"tooltip-bottom\" data-tooltip=\"날짜에 따른 목표변수를 예측하는 알고리즘 입니다. 목표변수 설정이 반드시 필요합니다.\" style=\"font-size:16px;\">\r\n" + 
			"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
			"</span>"+
			"</div>";
	}
	
	console.log(resultStr);
	document.getElementById(setpId).innerHTML = resultStr;

	displaySelector(setpId);
}

function gridRegParameters(algorithm) {
	let algorithmList = ['LSTM', 'ARIMA', 'PMDARIMA', 'PROPHET', 'ELASTIC-NET'];
	let algorithmList2 = ['LOF', 'DBSCAN', 'ISOLATION-FOREST', 'K-MEANS', 'GAUSSIAN-MIXTURE'];
	let algorithmSet = "";
	algorithmSet +=
		"                     <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\" id=\"ALGORITHM-TB\">\r\n"; 
	if(algorithm.toUpperCase() == 'LSTM'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">hidden_size "+"<span class=\"tooltip-bottom\" data-tooltip=\"LSTM 모델에서 각 LSTM 셀의 은닉 상태의 차원입니다. 값이 클수록 모델의 표현력이 커지지만, 과적합 위험이 커질 수 있습니다. (기본값은 64, 보통 50~500 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=64></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">num_layers "+"<span class=\"tooltip-bottom\" data-tooltip=\"LSTM의 층 수로, 층 수가 많을수록 모델이 더 복잡한 패턴을 학습할 수 있습니다. 너무 깊으면 학습이 어려워질 수 있습니다. (기본값은 2, 보통 1~3 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=2></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">epochs "+"<span class=\"tooltip-bottom\" data-tooltip=\"모델이 훈련 데이터를 전체적으로 한 번 학습하는 횟수 입니다. 값이 작으면 학습이 부족하여 underfitting(과소적합) 발생 할 수 있으며 반대로 너무 큰 경우 overfitting(과적합)이 발생 할 수 있고 더 긴 학습 시간이 소요 됩니다. (기본값은 30, 보통 10~100 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=30></td>\r\n" + 
			"                         </tr>\r\n";
	} else if(algorithm.toUpperCase() == 'ARIMA'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">p "+"<span class=\"tooltip-bottom\" data-tooltip=\"ARIMA 모델에서 자가회귀(AR) 부분의 차수로, 이전의 값들이 현재 값에 미치는 영향을 나타냅니다. 값이 커질수록 모델은 더 많은 이전 값을 고려합니다. (보통 1~3 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=2></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">d "+"<span class=\"tooltip-bottom\" data-tooltip=\"차분의 차수로, 시계열 데이터를 안정적이고 정상성 있는 형태로 변환하기 위한 파라미터입니다. 값이 크면 더 많이 차분을 적용합니다. (보통 0~2 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=2></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">q "+"<span class=\"tooltip-bottom\" data-tooltip=\"이동평균(MA) 부분의 차수로, 오차 항이 현재 값에 미치는 영향을 나타냅니다. 값이 커질수록 더 많은 이전 오차를 반영합니다. (보통 1~3 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=2></td>\r\n" + 
			"                         </tr>\r\n";
		
	} else if(algorithm.toUpperCase() == 'PMDARIMA'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">해당 알고리즘은 패러미터가 자동으로 설정 됩니다.</td>\r\n" + 
			"                         </tr>\r\n";
		
	} else if(algorithm.toUpperCase() == 'PROPHET'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">changepoint_prior_scale "+"<span class=\"tooltip-bottom\" data-tooltip=\"변화점을 모델에 얼마나 민감하게 반영할지 결정하는 파라미터입니다. 값이 클수록 변화점을 더 많이 반영합니다. (기본값은 0.05, 보통 0.01~0.1 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.05></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">interval_width "+"<span class=\"tooltip-bottom\" data-tooltip=\"예측의 신뢰 구간을 설정하는 파라미터로, 값이 클수록 예측 범위가 넓어집니다. (기본값은 0.80, 0.90으로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.80></td>\r\n" + 
			"                         </tr>\r\n";
	} else if(algorithm.toUpperCase() == 'ELASTIC-NET'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">alpha "+"<span class=\"tooltip-bottom\" data-tooltip=\"엘라스틱넷 모델에서 규제 강도를 조절하는 하이퍼파라미터로, 값이 클수록 규제가 강해지고 값이 작을수록 자유도를 허용합니다. 일반적으로 모델의 과적합을 방지하는 데 사용됩니다. (기본값은 1.0이며, 0.1~10 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=1.0></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">l1_ratio "+"<span class=\"tooltip-bottom\" data-tooltip=\"L1과 L2 정규화 비율을 설정하는 하이퍼파라미터입니다. 1이면 Lasso, 0이면 Ridge 모델에 가까워집니다. (기본값은 0.5이며, 0~1 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.5></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">lag "+"<span class=\"tooltip-bottom\" data-tooltip=\"시계열 모델에서 이전 값의 개수를 설정하는 파라미터입니다. 너무 많은 값을 포함하면 과적합 위험이 있습니다. (보통 1~5 사이에서 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=3></td>\r\n" + 
			"                         </tr>\r\n";
	} else if(algorithm.toUpperCase() == 'LOF'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">n_neighbors "+"<span class=\"tooltip-bottom\" data-tooltip=\"LOF에서 이웃의 수를 설정하는 파라미터로, 이웃 수가 적을수록 더 민감하게 이상치를 감지합니다. (기본값은 20, 보통 10~50 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=20></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">contamination "+"<span class=\"tooltip-bottom\" data-tooltip=\"이상치 비율을 설정하는 파라미터로, 값이 클수록 더 많은 포인트가 이상치로 판단됩니다. (기본값은 0.05, 보통 0.01~0.1 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.05></td>\r\n" + 
			"                         </tr>\r\n";
		
	} else if(algorithm.toUpperCase() == 'DBSCAN'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">eps "+"<span class=\"tooltip-bottom\" data-tooltip=\"DBSCAN에서 두 점이 같은 군집에 속할 수 있는 최대 거리입니다. 값이 작을수록 군집의 밀도가 높아야 합니다. (기본값은 0.5, 보통 0.1~1.0 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.5></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">min_samples "+"<span class=\"tooltip-bottom\" data-tooltip=\"DBSCAN에서 군집을 형성하는 최소 점의 수입니다. 값이 클수록 더 많은 점들이 밀집된 지역에서만 군집을 형성합니다. (기본값은 5, 보통 3~10 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=5></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">leaf_size "+"<span class=\"tooltip-bottom\" data-tooltip=\"DBSCAN의 KDTree나 BallTree를 사용할 때 데이터 구조의 리프 노드 크기입니다. 값이 클수록 성능이 향상되지만 메모리 사용량도 늘어납니다. (기본값은 30, 보통 10~50 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=30></td>\r\n" + 
			"                         </tr>\r\n";
		
	} else if(algorithm.toUpperCase() == 'ISOLATION-FOREST'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">n_estimators "+"<span class=\"tooltip-bottom\" data-tooltip=\"생성할 트리의 수를 설정하는 파라미터입니다. 트리가 많을수록 성능이 좋아지지만 계산 비용이 증가합니다. (기본값은 100, 보통 50~200 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=100></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">contamination "+"<span class=\"tooltip-bottom\" data-tooltip=\"이상치 비율을 설정하는 파라미터로, 값이 클수록 더 많은 포인트가 이상치로 판단됩니다. (기본값은 0.05, 보통 0.01~0.1 사이로 조정합니다.)\">\r\n" +  
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.05></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">random_state "+"<span class=\"tooltip-bottom\" data-tooltip=\"난수 생성기의 시드를 설정하는 파라미터로, 동일한 결과를 재현할 수 있도록 합니다.(기본값은 42, 보통 20~100 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=42></td>\r\n" + 
			"                         </tr>\r\n";
	} else if(algorithm.toUpperCase() == 'K-MEANS'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">n_clusters "+"<span class=\"tooltip-bottom\" data-tooltip=\"생성할 군집의 수를 설정하는 파라미터입니다. 값이 클수록 군집의 수가 많아지고, 데이터의 세분화가 더 정확해질 수 있습니다. (기본값은 8, 보통 2~10 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=8></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">n_init "+"<span class=\"tooltip-bottom\" data-tooltip=\"군집화를 여러 번 시도하는 횟수입니다. 여러 번 실행하여 최적의 군집화 결과를 찾습니다. (기본값은 10, 보통 5~20 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=10></td>\r\n" + 
			"                         </tr>\r\n";
	} else if(algorithm.toUpperCase() == 'GAUSSIAN-MIXTURE'){
		algorithmSet +=
			"                         <tr>\r\n" + 
			"                             <td width=\"10%\" style=\"border: none;\">n_components "+"<span class=\"tooltip-bottom\" data-tooltip=\"혼합 성분(가우시안 분포)의 수를 설정하는 파라미터입니다. 값이 클수록 더 많은 분포를 고려하게 됩니다. (기본값은 2, 보통 2~10 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=2></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">contamination "+"<span class=\"tooltip-bottom\" data-tooltip=\"이상치 비율을 설정하는 파라미터로, 값이 클수록 더 많은 포인트가 이상치로 판단됩니다. (기본값은 0.05, 보통 0.01~0.1 사이로 조정합니다.)\">\r\n" +  
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=0.05></td>\r\n" + 
			"                         </tr>\r\n" + 
			"                         <tr>\r\n" + 
			"                             <td style=\"border: none;\">max_iter "+"<span class=\"tooltip-bottom\" data-tooltip=\"최대 반복 횟수를 설정하는 파라미터입니다. 값이 클수록 더 많은 반복을 통해 최적화를 수행합니다. (기본값은 100, 보통 100~300 사이로 조정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
			"                             <td style=\"border: none; text-align: left;\"><input type=\"text\" class=\"text_box\" style=\"width: 99%;\" value=100></td>\r\n" + 
			"                         </tr>\r\n";
	}
	algorithmSet +=
		"                     </table>\r\n";
	
	document.getElementById("algorithmParameters").innerHTML = algorithmSet;
	document.getElementById("algorithmVal").value = algorithm;
	
//	let algorithmContainer = '#ALGORITHM-TB' + ' .text_box';
//	
//	parameters = {};
//	$(algorithmContainer).each(function() {
//		let key = $(this).closest('tr').find('td:first').text().trim(); // Key는 첫 번째 <td>의 텍스트
//		let value = $(this).val(); // Value는 input 필드 값
//		parameters[key] = value;
//	});
//	console.log(parameters);
	
}

function gridAlgorithmDetail(type) {
	document.getElementById("algorithmType").value = type;
	let setpId = "algorithmDetail";
	currentPid = "algorithmDetail";
	if(type=="cluster"){
let algorithmList = ['LOF', 'DBSCAN', 'ISOLATION-FOREST', 'K-MEANS', 'GAUSSIAN-MIXTURE'];
		
		let resultStr = 
			"<div class=\"tab_area2\" id=\"algorithmGroup\">\r\n"
		for (let i = 0; i < algorithmList.length; i++) {
			if(i==0){
				resultStr += 
					"     <div id=\"alck"+(i+1)+"\" class=\"tab_menu_on border-right bg_0"+(i+1)+"\" style=\"padding: 25px;\" onclick=\"gridRegParameters('"+algorithmList[i]+"');\">\r\n" + 
					"         <a href=\"javascript:void(0)\">\r\n" + 
					"             <div class=\"text_center pad_25\">\r\n" + 
					"                 <h3 class=\"font-weight-medium font_white\">"+algorithmList[i]+"</h3>\r\n" + 
					"                 <h5 class=\"font_white\"></h5>\r\n" + 
					"			</div></a>\r\n" + 
					"     </div>\r\n";
				
			}else{
				resultStr += 
					"     <div id=\"alck"+(i+1)+"\" class=\"tab_menu_off border-right\" style=\"padding: 25px;\" onclick=\"gridRegParameters('"+algorithmList[i]+"');\">\r\n" + 
					"         <a href=\"javascript:void(0)\">\r\n" +  
					"             <div class=\"text_center pad_25\">\r\n" + 
					"                 <h3 class=\"font-weight-medium font_white\">"+algorithmList[i]+"</h3>\r\n" + 
					"                 <h5 class=\"font_white\"></h5>\r\n" + 
					"			</div></a>\r\n" + 
					"     </div>\r\n";
			}
		}
		resultStr += 
			" </div> <!-- card-group -->\r\n" + 
			" <div class=\"bg_gray\" id=\"algorithmParameters\">\r\n" + 
			"</div>\r\n" + 
			"             <div class=\"right_20\"><button type=\"button\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\" onclick=\"sendSelectedFiltering();\">학습 실행</button></div>\r\n" + 
			" <div class=\"row\" style=display:none;>\r\n" + 
			"	<!-- column -->\r\n" + 
			"	<div class=\"col-lg-12\">\r\n" + 
			"         <div class=\"card\">\r\n" + 
			"             <div class=\"card-body3\">\r\n" + 
			"                 <h4 class=\"card-title\">검증 데이터 비율 설정</h4>\r\n" + 
			"        <div class=\"slider-container\">\r\n" + 
			"            <div class=\"slider-track\" id=\"slider-track\">\r\n" + 
			"                <div class=\"slider-bar\" id=\"slider-bar\" style=\"width: 5%;\"></div>\r\n" + 
			"                <div class=\"slider-handle\" id=\"slider-handle\" style=\"left: 5%;\">\r\n" + 
			"                    <div class=\"tooltipp\" id=\"slider-tooltip\">5%</div>\r\n" + 
			"                </div>\r\n" + 
			"            </div>\r\n" + 
			"            <div class=\"slider-labels\">\r\n" + 
			"                <span>0%</span>\r\n" + 
			"                <span>100%</span>\r\n" + 
			"            </div>\r\n" + 
			"        </div>" +
			"             </div>\r\n" + 
			"         </div>\r\n" + 
			"     </div>\r\n" + 
			"	<!-- column -->\r\n" + 
			"</div> <!-- row -->\r\n" + 
			" </div>";
		
		document.getElementById(setpId).innerHTML = resultStr;

		gridRegParameters('LOF');
		
	} else if(type=="regression"){
		
		let algorithmList = ['LSTM', 'ARIMA', 'PMDARIMA', 'PROPHET', 'ELASTIC-NET'];
		
		let resultStr = 
			"<div class=\"tab_area2\" id=\"algorithmGroup\">\r\n"
		for (let i = 0; i < algorithmList.length; i++) {
			if(i==0){
				resultStr += 
					"     <div id=\"alck"+(i+1)+"\" class=\"tab_menu_on border-right bg_0"+(i+1)+"\" style=\"padding: 25px;\" onclick=\"gridRegParameters('"+algorithmList[i]+"');\">\r\n" + 
					"         <a href=\"javascript:void(0)\">\r\n" + 
					"             <div class=\"text_center pad_25\">\r\n" + 
					"                 <h3 class=\"font-weight-medium font_white\">"+algorithmList[i]+"</h3>\r\n" + 
					"                 <h5 class=\"font_white\"></h5>\r\n" + 
					"			</div></a>\r\n" + 
					"     </div>\r\n";
				
			}else{
				resultStr += 
					"     <div id=\"alck"+(i+1)+"\" class=\"tab_menu_off border-right\" style=\"padding: 25px;\" onclick=\"gridRegParameters('"+algorithmList[i]+"');\">\r\n" + 
					"         <a href=\"javascript:void(0)\">\r\n" +  
					"             <div class=\"text_center pad_25\">\r\n" + 
					"                 <h3 class=\"font-weight-medium font_white\">"+algorithmList[i]+"</h3>\r\n" + 
					"                 <h5 class=\"font_white\"></h5>\r\n" + 
					"			</div></a>\r\n" + 
					"     </div>\r\n";
			}
		}
		resultStr += 
			" </div>\r\n" + 
			" <div class=\"bg_gray\" id=\"algorithmParameters\">\r\n" + 
			"</div> <!-- row -->\r\n" + 
			" <div class=\"row\">\r\n" + 
			"	<!-- column -->\r\n" + 
			"	<div class=\"col-lg-12\">\r\n" + 
			"         <div class=\"card\">\r\n" + 
			"             <div class=\"card-body3\">\r\n" + 
			"                 <h4 class=\"card-title\">검증 데이터 비율 설정 "+"<span class=\"tooltip-bottom\" data-tooltip=\"전체 데이터를 훈련과 검증 데이터로 나누는 기준입니다. 과거 데이터를 훈련에, 미래 데이터를 검증에 사용합니다. (보통 10%~30%로 설정합니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</h4>\r\n" + 
			"        <div class=\"slider-container\">\r\n" + 
			"            <div class=\"slider-track\" id=\"slider-track\">\r\n" + 
			"                <div class=\"slider-bar\" id=\"slider-bar\" style=\"width: 5%;\"></div>\r\n" + 
			"                <div class=\"slider-handle\" id=\"slider-handle\" style=\"left: 5%;\">\r\n" + 
			"                    <div class=\"tooltipp\" id=\"slider-tooltip\">5%</div>\r\n" + 
			"                </div>\r\n" + 
			"            </div>\r\n" + 
			"            <div class=\"slider-labels\">\r\n" + 
			"                <span>0%</span>\r\n" + 
			"                <span>100%</span>\r\n" + 
			"            </div>\r\n" + 
			"        </div>" +
			"             </div>\r\n" + 
			"             <div class=\"right_20\"><button type=\"button\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\" onclick=\"sendSelectedFiltering();\">학습 실행</button></div>\r\n" + 
			"         </div>\r\n" + 
			"     </div>\r\n" + 
			"	<!-- column -->\r\n" + 
			"</div> <!-- row -->\r\n" + 
			" </div>";
		
		document.getElementById(setpId).innerHTML = resultStr;

		gridRegParameters('LSTM');
		
		const track = document.getElementById("slider-track");
		const bar = document.getElementById("slider-bar");
		const handle = document.getElementById("slider-handle");
		const tooltip = document.getElementById("slider-tooltip");
		
		setupSliderEvents(track, bar, handle, tooltip);
	}
	
	
	// 알고리즘 선택 동작
	document.querySelector('#algorithmGroup').addEventListener('click', function (event) {
	    const clickedTab = event.target.closest('.tab_menu_on, .tab_menu_off');
	    if (!clickedTab) return; // 클릭한 요소가 탭이 아닌 경우 무시

	    const tabs = document.querySelectorAll('#algorithmGroup .tab_menu_on, #algorithmGroup .tab_menu_off');
	    tabs.forEach((tab, index) => {
	        // 모든 탭을 비활성화 상태로 초기화
	        tab.className = 'tab_menu_off border-right';
	        tab.style.backgroundColor = '#EEEEEE';

	        const h3Tag = tab.querySelector('h3');
	        h3Tag.className = 'font-weight-medium font_white';

	        const h5Tag = tab.querySelector('h5');
	        h5Tag.className = 'font_white';

	        // 클릭된 탭을 활성화 상태로 설정
	        if (tab === clickedTab) {
	            tab.className = `tab_menu_on border-right bg_0${index + 1}`;
	            tab.style.backgroundColor = ''; // 클래스 스타일을 우선 적용

	            h3Tag.className = 'font-weight-medium font_white';
	            h5Tag.className = 'font_white';
	        }
	    });
	});

	displaySelector(setpId);
}

function setupSliderEvents(track, bar, handle, tooltip) {
    function setSliderPosition(percent) {
        bar.style.width = percent + '%';
        handle.style.left = percent + '%';

        // 툴팁 위치와 텍스트 업데이트
        tooltip.style.left = percent + '%';
        tooltip.innerText = Math.round(percent) + '%';
    }

    track.addEventListener('click', function(event) {
        const percent = (event.offsetX / track.offsetWidth) * 100;
        setSliderPosition(Math.max(5, Math.min(95, percent))); // 5% ~ 95% 범위 설정
    });

    handle.addEventListener('mousedown', function(event) {
        event.preventDefault();
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    function onDrag(event) {
        const rect = track.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        let percent = (offsetX / track.offsetWidth) * 100;
        percent = Math.max(5, Math.min(95, percent)); // 5% ~ 95% 범위 설정
        setSliderPosition(percent);
    }

    function stopDrag() {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
}


function gridTrainResult(parsedData, algorithmVal) {

	let scoreMap = parsedData.scoreMap;
	
	let oob_score = parseFloat(scoreMap.train_score).toFixed(2);
	let test_score = (1-parseFloat(scoreMap.test_score)).toFixed(2);
	let mse = parseFloat(scoreMap.mse).toFixed(2);
	let rmse = parseFloat(scoreMap.rmse).toFixed(2);
	let mape = parseFloat(scoreMap.mape).toFixed(2);
	let acc = (1-parseFloat(scoreMap.mape)).toFixed(2);
	let max = Math.max(parseFloat(scoreMap.train_score), parseFloat(scoreMap.test_score));
	let min = Math.min(parseFloat(scoreMap.train_score), parseFloat(scoreMap.test_score));
	let r2Score = max.toFixed(2);
	if(max>1.0){
		r2Score = min.toFixed(2);
	}
	let reTrainChk = document.getElementById("reTrainChk").value;
	
	let setpId = "trainResult";
	currentPid = "trainResult";
	displaySelector(setpId);
	
	let resultStr = 
		"        <div class=\"graph_box\">\r\n" + 
		"            <div class=\"graph2\">\r\n" + 
		"			 <canvas id=\"myChart\" width=\"400\" height=\"200\"></canvas>\r\n" + 
		"            </div>\r\n" + 
		"            <div class=\"table_area4\"> \r\n" + 
		"                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"                    <thead>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <th scope=\"col\" width=\"25%\">평가 항목</th>\r\n" + 
		"                        <th scope=\"col\" width=\"25%\">값</th>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </thead>\r\n" + 
		"                    <tbody>\r\n" + 
//		"                      <tr>\r\n" + 
//		"                        <td>OOB_SCORE</td>\r\n" + 
//		"                        <td>"+oob_score+"</td>\r\n" + 
//		"                      </tr>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td>R2_SCORE</td>\r\n" + 
		"                        <td>"+r2Score+"</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td>MSE "+"<span class=\"tooltip-bottom\" data-tooltip=\"예측 값과 실제 값 간의 차이를 제곱하여 평균을 구한 값으로, 예측 오차의 크기를 나타냅니다. 값이 작을수록 모델의 예측이 정확하다는 의미입니다. (값이 작을수록 좋습니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
		"                        <td>"+mse+"</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td>RMSE "+"<span class=\"tooltip-bottom\" data-tooltip=\"MSE의 제곱근으로, 예측 오차의 크기를 원래 단위로 변환하여 직관적으로 이해할 수 있게 합니다. 값이 작을수록 모델의 예측 정확도가 높습니다. (값이 작을수록 좋습니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
		"                        <td>"+rmse+"</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td>MAPE "+"<span class=\"tooltip-bottom\" data-tooltip=\"예측 오차를 실제 값에 대해 백분율로 나타낸 지표로, 예측의 상대적 정확도를 평가합니다. 값이 작을수록 예측 정확도가 높습니다.(값이 작을수록 좋습니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
		"                        <td>"+mape+"</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td>ACCURACY "+"<span class=\"tooltip-bottom\" data-tooltip=\"1-MAPE, 값이 클수록 모델의 성능이 좋다는 의미입니다. (값이 클수록 좋습니다.)\">\r\n" + 
"<i class=\"fas fa-question-circle .tooltip-icon\"></i>\r\n" + 
"</span>"+"</td>\r\n" + 
		"                        <td>"+acc+"</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </tbody>\r\n" + 
		"                </table>\r\n" + 
		"            </div>\r\n";
	if(reTrainChk=="0"){
		resultStr += 
			"            <button type=\"button\" onclick=\"modelNameModal();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">모델확정</button>\r\n"; 
	}else{
		document.getElementById("modalModelName").value="reModel";
		resultStr += 
			"            <button type=\"button\" onclick=\"insertModelInfo();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">모델확정</button>\r\n"; 
	}
		"    </div>\r\n";
	
	document.getElementById(setpId).innerHTML = resultStr;
	
	
    var ctx = document.getElementById('myChart').getContext('2d');
	let chartList = parsedData.chartList;
	let chartData = chartList.map(function(item) {
        return JSON.parse(item.jsonResponse);
    });
	
	let labels = chartData.map(function(item) {
        return item.labels;
    });
	
	let datasets = chartData.map(function(item) {
		return item.datasets;
	});

    labels = labels.flat();
    datasets = datasets.flat();
	console.log(labels);
	console.log(datasets);
    
	var myChart = new Chart(ctx, {
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


function gridTrainResult2(parsedData, algorithmVal) {

	let setpId = "trainResult";
	currentPid = "trainResult";
	let reTrainChk = document.getElementById("reTrainChk").value;
	displaySelector(setpId);
	
	let resultStr = 
		"        <div class=\"graph_box\">\r\n" + 
		"            <div class=\"graph2\">\r\n" + 
		"			 <canvas id=\"myChart\" width=\"400\" height=\"200\"></canvas>\r\n" + 
		"            </div>\r\n" + 
		"            <div class=\"top_20\"></div>\r\n" + 
		"            <div class=\"table_area4\"> \r\n" + 
		"                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"table\">\r\n" + 
		"                    <thead>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <th scope=\"col\" width=\"25%\">평가 항목</th>\r\n" + 
		"                        <th scope=\"col\" width=\"25%\">값</th>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </thead>\r\n" + 
		"                    <tbody>\r\n" + 
		"                      <tr>\r\n" + 
		"                        <td colspan='2'>비지도학습은 평가지표가 없습니다.</td>\r\n" + 
		"                      </tr>\r\n" + 
		"                    </tbody>\r\n" + 
		"                </table>\r\n" + 
		"            </div>\r\n";
	
	if(reTrainChk=="0"){
		resultStr += 
			"            <button type=\"button\" onclick=\"modelNameModal();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">모델확정</button>\r\n"; 
	}else{
		document.getElementById("modalModelName").value="reModel";
		resultStr += 
			"            <button type=\"button\" onclick=\"insertModelInfo();\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr mtb_1020\">모델확정</button>\r\n"; 
	}
		"        </div>";
	
	document.getElementById(setpId).innerHTML = resultStr;

//	let scatterDataset = JSON.parse(parsedData.jsonResponse);
	let chartList = parsedData.chartList;
	let chartData = chartList.map(function(item) {
        return JSON.parse(item.jsonResponse);
    });
	console.log(chartData);
	
	let labels = chartData.map(function(item) {
        return item.labels;
    });
	
	let datasets = chartData.map(function(item) {
		return item.datasets;
	});

    labels = labels.flat();
    datasets = datasets.flat();
	console.log(labels);
	console.log(datasets);
	
    // Chart.js Scatter 차트 생성
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
        	labels : labels,
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
                                `Outlier: ${pointData.outlier ? 'Yes' : 'No'}`
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

function modelNameModal() {
	let modal = document.getElementById("modelModal");
	modal.style.display = "block";
}

function modalClose() {
	let modal = document.getElementById("modelModal");
	modal.style.display = "none";
}

function insertModelInfo() {
	
	let modal = document.getElementById("modelModal");
	let season = document.getElementById("season").value;
	if(season==null||season==""){
		season = "";
	}
	let modelViewName = document.getElementById("modalModelName").value;
	if(modelViewName.length>1){
		modal.style.display = "none";
		Load.showLoader();
		$.ajax({
	        url: 'insertModelInfo', // 데이터를 전송할 Java 서버의 엔드포인트 URL
	        type: 'POST',
	        contentType: 'application/json',
	        data: JSON.stringify({
	        	modelViewName: modelViewName,
	        	season: season
	        }),
	        success: function(data) {
	            console.log('서버 응답:', data);
	            gridFixModel();
	        },
	        error: function(xhr, status, error) {
	            console.error('전송 오류:', error);
	        },
	        complete: function() {
	        	Load.hideLoader();
	        }
	    });
	}else{
		alert("2자 이상의 이름을 입력해주세요");
	}
	
}

function gridFixModel() {
	let setpId = "fixModel";
	currentPid = "fixModel";
	displaySelector(setpId);
	
	let resultStr = 
		"<ul>\r\n" + 
		"    <li><h3>시계열모델 학습이 완료 되었습니다.</h3></li>\r\n" + 
		"    <li><h3>모델관리에서 모델의 정보를 확인 할 수 있습니다.</h3></li>\r\n" + 
		"    <li><button type=\"button\" onclick=\"goMgnt();\" class=\"btn_upload mt_20\">모델 관리</button></li>\r\n" + 
		"</ul>";
	
	document.getElementById(setpId).innerHTML = resultStr;
}

function goMgnt() {
	window.location.href = "modelMgmt";
}

document.addEventListener("DOMContentLoaded", function() {
	let callTrainChk = document.getElementById("callTrainChk").value;
	if(callTrainChk=="1"){
		requestReTrainList();
    }else{
    	gridTrainMode();
		displaySelector("trainMode");
    }
	let topNav = document.getElementById("topNav");
	let navText = "<li class=\"fl home\"><a href=\"dashboard\" class=\"home\" title=\"홈으로 이동\">홈</a></li>\r\n" + 
						"<li class=\"fl\">></li>\r\n" + 
						"<li class=\"fl\">모델</li>"+
	"<li class=\"fl\">></li>\r\n" + 
	"<li class=\"fl current\"><a href=\"model-tr\">모델학습</a></li>";
	topNav.innerHTML = navText;
});


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




