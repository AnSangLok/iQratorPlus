
var winArr;	
 
//var winArr = new Array();  // Child창을 모두 담기위한 배열
function com_openBrWindowCenter(theURL, winName, width, height, features) {
    var leftX = screen.width / 2 - width / 2;
    var topY = -75 + screen.height / 2 - height / 2;

    var featuresValue = 'width=' + width + ',height=' + height;
    featuresValue += ',left=' + leftX + ',top=' + topY;
    if (features.length > 0)
        featuresValue += ',' + features;

    winArr = window.open(theURL,winName,featuresValue);
    winArr.focus();

}

//팝업
function doPop(url, name, width, height, option){
	  com_openBrWindowCenter(url,name,width,height,option);

}
function goUrl(field_url,targetName,width,height){
	openMask();
	//팝업 호출
	doPop(field_url, targetName, width, height, "scrollbars=auto, resizable=yes, location=no");
}
	
function goUrlNoMask(field_url,targetName,width,height){
	//팝업 호출
	doPop(field_url, targetName, width, height, "scrollbars=auto, resizable=yes, location=no");
}

//JJH 2021 11 05 팝업 풀화면 script 추가
function goUrlFull(field_url,targetName){
	openMask();
	//팝업 호출
	winArr =window.open(field_url,targetName,'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
    winArr.focus();
	
}

//JJH 2021 11 05 팝업 풀화면 script 추가
function goUrlNoFull(field_url,targetName){
	openMask();
	//팝업 호출
	winArr =window.open(field_url,targetName,'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
    winArr.focus();
}

function goUrlFullNoMask(field_url,targetName){
	//openMask();
	//팝업 호출
	winArr =window.open(field_url,targetName,'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
    winArr.focus();
	
}
	
//팝업시 부모창에 검은막 표시
function openMask(){
	 // e.preventDefault();
      wrapWindowByMask();
}

//팝업시 부모창에 검은막 표시
function openMask2(){
	 // e.preventDefault();
	wrapWindowByMask2();
}

//팝업시 부모창에 검은막 제거
function winCloseMask(){
	$('#mask, .window').hide();
}




	


//부모창에 불투명 표시
function wrapWindowByMask(){
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height();  
    var maskWidth = $(window).width();  

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#mask').css({'width':maskWidth,'height':maskHeight});  

    //애니메이션 효과 - 일단 1초동안 까맣게 됐다가 80% 불투명도로 간다.
    $('#mask').fadeIn(50);      
    $('#mask').fadeTo("slow",0.3);    

    //윈도우 같은 거 띄운다.
    $('.window').show();
}

//부모창에 불투명 표시
function wrapWindowByMask2(){
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height();  
    var maskWidth = $(window).width();  

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#mask').css({'width':maskWidth,'height':maskHeight});  

    //애니메이션 효과 - 일단 1초동안 까맣게 됐다가 80% 불투명도로 간다.
    $('#mask').fadeIn(50);      
    $('#mask').fadeTo("slow",0.1);    

    //윈도우 같은 거 띄운다.
    $('.window').show();
}

//팝업 실행 중 부모창 클릭시 해당 팝업으로 포커스 마춤
function mask_focus(){
	winArr.focus();
}




	
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}	
function replaceAll(str, searchStr, replaceStr) {
	  return str.split(searchStr).join(replaceStr);
}

// < , > , & , "  변환
function replaceSpecial_type1(str){
	return str.replace(/\</gi,"&lt;").replace(/\>/gi,"&gt;").replace(/\&/gi,"&amp;").replace(/\"/gi,"&quot;");
}

//값이 null일경우 ""공백으로 변경
function replaceNullToString(str) {
	
	if(str==null){
		str="";
	}
	
	return str;
}


// 2021 10 05 JJH 추가  
// input box maxlength 제한
// ex ) <input oninput="handleOnInput(this, 199, '질문은 200자 이하로 작성하여주세요')" />
function handleOnInput(el, maxlength, overText) {
	  if(el.value.length > maxlength)  {
		  alert(overText)
		  return;
	    el.value = el.value.substr(0, maxlength);
	  }
	}


// 2021 10 08 sran 추가
// 특수문자, 숫자 등 alert창
/*
 * 정규식.test(string) 
 * 		false		사용 규칙 위배
 * 		true		정규식 내 사용
 */
var regConceptHangulAlphaNumeric = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/;			// 특수문자를 제외한 모든 문자 가능 ~,_ 가능하게 추가
var regFuncHangulAlphaNumeric = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ+^_]*$/;			// 특수문자를 제외한 모든 문자 가능 ^가능하게 추가
var regConceptBeConnected =/(~)\1/;			// ~특수문자 2번 이상사용하였는지 체크
var regFuncBeConnected =/(\^)\1/;			// ~특수문자 2번 이상사용하였는지 체크
var regConceptNumber =/^[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]*$/;		// 숫자 체크
var regFuncNumber =/^[0-9^]*$/;		// 숫자^ 체크
var regConceptHangulAlphaNumeric2 = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ+\s]*$/;	//특수문자 제외 모든 문자 + 띄어쓰기 가능
var regConceptHangulAlphaNumericExceptCV = /^[A-Za-z0-9가-힣+\s]*$/;	//특수문자 한글 자음 모음 제외 모든 문자 + 띄어쓰기 가능
//사용 예시
/*
 * 	return 	true		정규식 위배된 경우
 * 				false		정규식과 일치
 * function checkregConceptHangulAlphaNumeric(str) {
 * 		return !regConceptHangulAlphaNumeric.test(str); 
 * }
 */

// 특수문자 제거
var removeSpecial = function(str){
	   str = ReplaceStr(str,"-","");
	   str = ReplaceStr(str,"_","");
	   str = ReplaceStr(str,"!","");
	   str = ReplaceStr(str,"@","");
	   str = ReplaceStr(str,"#","");
	   str = ReplaceStr(str,"$","");
	   str = ReplaceStr(str,"%","");
	   str = ReplaceStr(str,"^","");
	   str = ReplaceStr(str,"&","");
	   str = ReplaceStr(str,"*","");
	   str = ReplaceStr(str,"(","");
	   str = ReplaceStr(str,")","");
	   str = ReplaceStr(str,"~","");
	   str = ReplaceStr(str,"+","");
	   str = ReplaceStr(str,"|","");
	   str = ReplaceStr(str,"[","");
	   str = ReplaceStr(str,"]","");
	   str = ReplaceStr(str,"{","");
	   str = ReplaceStr(str,"}","");
	   str = ReplaceStr(str,":","");
	   str = ReplaceStr(str,";","");
	   str = ReplaceStr(str,"'","");
	   str = ReplaceStr(str,"\"","");
	   str = ReplaceStr(str,"\\","");
	   str = ReplaceStr(str,"+","");
	   str = ReplaceStr(str,"?","");
	   str = ReplaceStr(str,"<","");
	   str = ReplaceStr(str,">","");
	   str = ReplaceStr(str,"=","");
	   str = ReplaceStr(str,"`","");
	   str = ReplaceStr(str,".","");
	   str = ReplaceStr(str,"  "," ");
	   return str;
	}

var ReplaceStr = function(strOriginal, strFind, strChange)	{
	return strOriginal.split(strFind).join(strChange);
}
//특정문자(",", "@@") trim 필요에 따라 추가 가능
var trim_special = function(str){
	return (str.replace(/^\s+|\s+$/g,"")).replace(/^,+|,+$/g,"").replace(/^@@+|@@+$/g,"");
}
//2021 10 08 sran 추가




//2021 10 13 JJH 추가
// 출처: https://cofs.tistory.com/267 [CofS]
/**
 * 바이트 문자 입력가능 문자수 체크
 * 
 * @param id : tag id 
 * @param title : tag title
 * @param maxLength : 최대 입력가능 수 (byte)
 * @returns {Boolean}
 * 
 *  <input type="text" id="input1">
 * 
 *	if( ! maxLengthCheck("manualName","매뉴얼명", "64") ){
		return false;
	} 
 */
function maxLengthCheck(id, title, maxLength){
     var obj = $("#"+id);
     if(maxLength == null) {
         maxLength = obj.attr("maxLength") != null ? obj.attr("maxLength") : 1000;
     }
     
     if(Number(byteCheck(obj)) > Number(maxLength)) {
         alert(title + "이(가) 입력가능문자수를 초과하였습니다.\n(영문, 숫자, 일반 특수문자 : " + maxLength + " / 한글, 한자, 기타 특수문자 : " + parseInt(maxLength/2, 10) + ").");
         return false;
     } else {
         return true;
    }
}
 
/**
 * 바이트수 반환  
 * 
 * @param el : tag jquery object
 * @returns {Number}
 */
function byteCheck(el){
    var codeByte = 0;
    for (var idx = 0; idx < el.val().length; idx++) {
        var oneChar = escape(el.val().charAt(idx));
        if ( oneChar.length == 1 ) {
            codeByte ++;
        } else if (oneChar.indexOf("%u") != -1) {
            codeByte += 3;
        } else if (oneChar.indexOf("%") != -1) {
            codeByte ++;
        }
    }
    return codeByte;
}


/**
 * 팝업창 사이즈 자동조절
 * id에 해당하는 값만큼 사이즈 조절된다.
 * */
var popResize = function(id) {

	var strWidth;

	var strHeight;



	//innerWidth / innerHeight / outerWidth / outerHeight 지원 브라우저

	if ( window.innerWidth && window.innerHeight && window.outerWidth && window.outerHeight ) {

		strWidth = $('#'+id).outerWidth() + (window.outerWidth - window.innerWidth);

		strHeight = $('#'+id).outerHeight() + (window.outerHeight - window.innerHeight);

	}

	else {

		var strDocumentWidth = $(document).outerWidth();

		var strDocumentHeight = $(document).outerHeight();



		window.resizeTo ( strDocumentWidth, strDocumentHeight );



		var strMenuWidth = strDocumentWidth - $(window).width();

		var strMenuHeight = strDocumentHeight - $(window).height();



		strWidth = $('#'+id).outerWidth() + strMenuWidth;

		strHeight = $('#'+id).outerHeight() + strMenuHeight;

	}

	//resize

	window.resizeTo( strWidth+10, strHeight+10 );
}
//2021 10 20 sran 추가
//html tag 제거 함수
var html_remove = function(tmp){
	   tmp = tmp.replace(/<(\/?)p>/gi,"");//p태그 제거 

	   tmp = tmp.replace(/(<br>)|(<br \/>)/gi,"");//br태그 제거 

//	   tmp = tmp.replace(/\s/gi,"");//공백제거 

	   tmp = tmp.replace(/&nbsp;/gi,"");//공백제거 
	   tmp = tmp.replace(/<head>(.*?)<(\/?)head>/gi,"");//head에 포한됨 모든 내용 제거 

	   tmp = tmp.replace(/<style>(.*?)<(\/?)style>/gi,"");//style 태그에 포함된 모든 내용 제거

	   tmp = tmp.replace(/<(\/?)body>/gi,"");//body 태그 제거

	   tmp = tmp.replace(/(<([^>]+)>)/ig,"");
	   
	   return tmp
}
//2021 10 20 sran 추가


var help_popup = function(page_help_cd){
	var field_url = "SC-CPS-A100?page_help_cd="+page_help_cd;
	var targetName = "SC-CPS-A100";
	var width = 820;
	var height = 820;
	doPop(field_url, targetName, width, height, "scrollbars=auto, resizable=yes, location=no");
}

var cho_hangul = function(str) {
	  cho = ["ㄱ","ㄱ","ㄴ","ㄷ","ㄷ","ㄹ","ㅁ","ㅂ","ㅂ","ㅅ","ㅅ","ㅇ","ㅈ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
	  result = "";
	  for(i=0;i<str.length;i++) {
	    code = str.charCodeAt(i)-44032;
	    if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
	  }
	  return result;
	}
//2021 11 10 sran 추가
