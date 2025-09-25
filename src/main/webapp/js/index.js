var cmpl_process = function(){
	
	var cmpl_text = $("#cmpl_text").val();
	
	if(cmpl_text.length>0){
		cmpl_text = replaceAll(cmpl_text, '\n',' ');
		
		console.log(cmpl_text);
		
		
		$.ajax({
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			type: "POST",
			url : "aiTest",
			data:{
				cmpl_text : cmpl_text
			},
			success :  function(data) {	
				console.log(data);
				grid_result(data);
			},
			error: function(jqxhr, status, error){
				console.log(jqxhr.statusText + ",  " + status + ",   " + error);
				console.log(jqxhr.status);
				console.log(jqxhr.responseText);
			}
		});
	}else{
		alert("민원 내용을 입력해 주세요.");
	}
}

var grid_result = function(data){
	
//	$("#result_text").val(data[0]);
	for(i=0; i<data.length; i++){
		$("#result_rank"+(i+1)).html(data[i].rank);
		$("#result_code"+(i+1)).html(data[i].code);
		$("#result_name"+(i+1)).html(data[i].name);
		$("#result_score"+(i+1)).html(data[i].score+"%");
	}
}