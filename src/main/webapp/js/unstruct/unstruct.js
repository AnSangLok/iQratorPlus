function displaySelector(id) {
	
	const trainDiv = document.getElementById("trainDiv");
	const childDivs = trainDiv.children;

	Array.from(childDivs).forEach(child => {
	  if (child.tagName === "DIV") {
	    child.style.display = "none";
	  }
	});
	
	document.getElementById(id).style.display = "";
}

function gridunstructResult() {
	let setpId = "nerColumn";
	displaySelector(setpId);
	
	let resultStr = 
		"<h4 class=\"card-title\">기간</h4>\r\n" + 
		"<div class=\"mtb_1020\"> \r\n" + 
		"    <input type=\"text\" class=\"text_box3\">\r\n" + 
		"</div>\r\n" + 
		"<h4 class=\"card-title\">날짜</h4>\r\n" + 
		"<div class=\"mtb_1020\"> \r\n" + 
		"    <input type=\"text\" class=\"text_box3\">\r\n" + 
		"</div>\r\n" + 
		"<h4 class=\"card-title\">기관</h4>\r\n" + 
		"<div class=\"mtb_1020\"> \r\n" + 
		"    <input type=\"text\" class=\"text_box3\">\r\n" + 
		"</div>\r\n" + 
		"<h4 class=\"card-title\">단체</h4>\r\n" + 
		"<div class=\"mtb_1020\"> \r\n" + 
		"    <input type=\"text\" class=\"text_box3\">\r\n" + 
		"</div>\r\n" + 
		"<button type=\"button\" class=\"btn waves-effect waves-light btn-sm btn-secondary fr\">분류</button>";
	
	document.getElementById(setpId).innerHTML = resultStr;
}