function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function isValidJSONString(jsonString){
    try {
        JSON.parse(jsonString);
    } catch (e) {
        return false;
    }
    return true;
}
function isValidXMLString(xmlString){
var oParser = new DOMParser();
var oDOM = oParser.parseFromString(xmlString, "text/xml");
// console.log(oDOM.getElementsByTagName('parsererror').length ? 
//      (new XMLSerializer()).serializeToString(oDOM) : "all good"    
// );
return ((oDOM.getElementsByTagName('parsererror').length ) ? false : true);
}


function isNotEmpty(A){
	try{


		return ((A != ' ' ) && (A != '' ) && (typeof A !== 'undefined' ) && !isEmptyObject(A)  && (A!="? undefined:undefined ?"));
	}catch(error){
		return false;
	}
}


function isValidBody(responseBody,responseContentType){
	if(responseContentType=="application/json" ){
		return isValidJSONString(responseBody);
	}else if(responseContentType=="application/xml" ){
			return isValidXMLString(responseBody);
	}else{
		return false
	}


}

function isValidResponseBody(responseBodyElement,responseBody,responseContentType){
	if(isValidBody(responseBody,responseContentType)){
		responseBodyElement.style.border = "";
		return true;
	}else{
		responseBodyElement.style.border = "solid 3px red";
		return false
	}


}


function inputElementsNotEmpty(inputElements){
if(inputElements.length>0){

	passed=0;
	for (var i = 0; i <= inputElements.length - 1; i++) {
			if(isNotEmpty(inputElements[i].value)){
				passed++;
				// console.log("++"+inputElements[i].value+"--");
				inputElements[i].style.border = "";
			}else{
				inputElements[i].style.border = "solid 3px red";
			}
}
return (passed==inputElements.length);
}else{
	return false;
}

}

function  isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function parameterKeyValidation(parameterKey,requestContentType){
try{
	// console.log(requestContentType + (parameterKey.indexOf("::") == -1) + (parameterKey.indexOf("|") == -1)  +  (parameterKey.indexOf(".") == -1) );
	if(requestContentType=="application/xml" && (parameterKey.indexOf("::") == -1 && parameterKey.indexOf("|") == -1  &&  parameterKey.indexOf(".") == -1 )){
		// console.log("xml" );
		return true;
	}else if(requestContentType=="application/json" && (parameterKey.indexOf("::") == -1 && parameterKey.indexOf("|") == -1  )){
			// console.log("json" );
return true;
	}else{
		return false;
	}

}catch(error){
	return false;
}
}

function validateAllParametersKeys(elements,requestContentType){
	if(elements.length>0){
	var passed=0;
 for (var i = 0; i <= elements.length - 1; i++) {
	if(parameterKeyValidation(elements[i].value,requestContentType)){
		// console.log("parameterKeyValidation  "+parameterKeyValidation(elements[i].value,requestContentType));
		elements[i].style.border = "";
		passed++;
	}else{
elements[i].style.border = "solid 3px red";
	}
}
return(passed==elements.length);
}else{
	return false;
}

}