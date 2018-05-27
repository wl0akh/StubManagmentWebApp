

 function convertXpath(xpath){
 if(xpath.indexOf("::") > -1  || xpath.indexOf("|") > -1  ||  xpath.indexOf(".") > -1  ){ return xpath;
 }else{ 
 var arr = xpath.split("/").map(function (val) {  
if(val.length==0 || val.startsWith("@")){ 
return val; 
 }
else if(xpath.indexOf("[") > -1 ){
var betweenBrackits =val.substring(val.lastIndexOf("[")+1,val.lastIndexOf("]"));
var nameToBeUsed =val.substring(0,val.lastIndexOf("["));
return "*[name()='"+nameToBeUsed+"' and "+betweenBrackits+" ]";
 }
else if(!(xpath.indexOf("[") > -1 ) && xpath.indexOf(":") > -1 ){
return "*[name()='"+val+"']";
 }
else{
return val;
} 
});
var outPutXpath="";
var arr = arr.forEach(function (val,index) {  if(index==0){ return; } else {outPutXpath+="/"+val+"";} });
return outPutXpath;
  }
}
function compareString(A,B,comparator){
try{
if(comparator=="=="){  
    return (A.toLowerCase()==B.toLowerCase())?true:false;
}else if(comparator=="!="){  
return (A.toLowerCase()!=B.toLowerCase())?true:false;
}else if(comparator=="contains"){  
return (A.toLowerCase().indexOf(B.toLowerCase()) > -1)?true:false;
}else if(comparator=="!contains"){  
return (A.toLowerCase().indexOf(B.toLowerCase()) == -1)?true:false;
}else if(comparator=="RegEx"){  
return (A.match(new RegExp(B,"g"))!=null)?true:false;
}else if(comparator=="!RegEx"){  
return (A.match(new RegExp(B,"g"))===null)?true:false;
}
else if(comparator=="exist"){  
return ( typeof A !== 'undefined' && A )?true:false;
}else if(comparator=="!exist"){ 
return (  A === null  )?true:false;
}
else if(comparator=="!empty"){  
return ( A !== "" )?true:false;
}else if(comparator=="empty"){ 
return (  A === ""  )?true:false;
}
else{  return false;}
}catch(error){
    console.log("\r\nCompareError: "+error.toString()+"\r\n");
return false;
}

}
function compareElementValueForXpath(xpath,xml,val,comparator){
var parameterValue=null;
try{
var dom = require('xmldom').DOMParser;
var xpathPackage  = require('xpath');
var doc = new dom().parseFromString(xml);
var nodes = xpathPackage.select(convertXpath(xpath), doc);
if(typeof nodes[0].childNodes !== 'undefined' && nodes[0].childNodes && typeof nodes[0].childNodes[0] !== 'undefined' && nodes[0].childNodes[0])
parameterValue=nodes[0].childNodes[0].nodeValue;
else if(typeof nodes[0].childNodes !== 'undefined' && nodes[0].childNodes )
parameterValue="";
else
parameterValue=null;
console.log(xpath+"---> "+parameterValue);
return compareString(parameterValue,val,comparator);
}catch(error){
    console.log("Error:-"+xpath+"---> "+parameterValue);
return compareString(parameterValue,val,comparator);
}
}

function compareElementValueForJsonPath(jsonPath,possibleJSON,val,comparator){
    var parameterValue=null;
try{
  var json = (typeof possibleJSON === 'object') ? possibleJSON : JSON.parse(possibleJSON);
 var JSONPath = require('jsonpath-plus');
 var result = JSONPath({json:json,path:jsonPath});
 if( result instanceof Array && result.length>0)
 parameterValue=result.toString();

return compareString(parameterValue ,val,comparator);
}catch(error){

return compareString(parameterValue ,val,comparator);
}
}

function compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,val,comparator){
 
return (keyOfParameter=='method' || keyOfParameter=='path')?compareString(possibleQueryFormHeaderMethodPath,val,comparator):compareString(possibleQueryFormHeaderMethodPath[keyOfParameter],val,comparator);
}

function compareElementValueInPath(keyOfParameter,possiblePath,val,comparator){
var parameterValue=null
keyOfParameter=keyOfParameter.replace(new RegExp("{", 'g'), "").replace(new RegExp("Id}", 'g'), "").replace(new RegExp("Id", 'g'), "");
var keyOfParameters=keyOfParameter+"s/";
possiblePath=possiblePath.toLowerCase();
if(possiblePath.lastIndexOf(keyOfParameters) > -1){
var firstIndex= possiblePath.lastIndexOf(keyOfParameters)+keyOfParameters.length;
var restString=possiblePath.substring(firstIndex,possiblePath.length);
parameterValue= (restString.indexOf("/") >-1)?(restString.substring(0,restString.indexOf("/"))):restString;
return compareString(parameterValue,val,comparator);
}else{
return compareString(parameterValue,val,comparator);
}


}

function requestValidator(request){
        return (
                       ( typeof request !== 'undefined' && request ) 
                );
}

function parameterValidator(parameter){
    return ( 
        ( typeof parameter !== 'undefined' && parameter ) 
        && ( typeof parameter.key !== 'undefined' && parameter.key ) 
        && ( typeof parameter.in !== 'undefined' && parameter.in )  
        && ( typeof parameter.val !== 'undefined' && parameter.val )  
        && ( typeof parameter.comparator !== 'undefined' && parameter.comparator )
        );

}
function processParameter(request,parameter){

if( !parameterValidator(parameter) && !requestValidator(request)){
    return false;
}
else if(parameter.in=="body" ){
    if(request.headers['Content-Type'].indexOf("application/xml")>-1){ 
        return compareElementValueForXpath(parameter.key,request.body,parameter.val,parameter.comparator);}
    else if(request.headers['Content-Type'].indexOf("application/json")>-1){   
        return compareElementValueForJsonPath(parameter.key,request.body,parameter.val,parameter.comparator);}
    else{ return false;}
}
else if(parameter.in=="query" || parameter.in=="form" || parameter.in=="headers" || parameter.in=="method" || parameter.in=="completePath"){
    if( parameter.in=="query" && ( typeof request.query !== 'undefined' && request.query ) ){  
        return compareElementValueForQueryFormHeaderMethodPath(parameter.key,request.query,parameter.val,parameter.comparator); 
    }
    else if( parameter.in=="form" && ( typeof request.form !== 'undefined' && request.form )  ){ 
     return compareElementValueForQueryFormHeaderMethodPath(parameter.key,request.form,parameter.val,parameter.comparator);
      }
    else if( parameter.in=="headers" && ( typeof request.headers !== 'undefined' && request.headers )  ){ 
     return compareElementValueForQueryFormHeaderMethodPath(parameter.key,request.headers,parameter.val,parameter.comparator);
      }
    else if( parameter.in=="method" && ( typeof request.method !== 'undefined' && request.method )  ){
       return compareElementValueForQueryFormHeaderMethodPath("method",request.method,parameter.val,parameter.comparator);
        }
    else if( parameter.in=="completePath" && ( typeof request.path !== 'undefined' && request.path )  ){ 
     return compareElementValueForQueryFormHeaderMethodPath("path",request.path,parameter.val,parameter.comparator);
      }
    else{ return false}
    
    
}
else if(parameter.in=="path"  && ( typeof request.path !== 'undefined' && request.path ) ){
    return compareElementValueInPath(parameter.key,request.path,parameter.val,parameter.comparator);
}
else{ 
    return false;
}


}

function parametersValidator(parameters){
return  (typeof parameters !== 'undefined' && parameters && parameters.constructor === Array && parameters.length>0);
}
function processParameters(request,parameters){
if( requestValidator(request) && parametersValidator(parameters)){
var parametersPassed=0;
parameters.forEach(function(val){
if(processParameter(request,val)){
    parametersPassed++;
}});
return(parametersPassed==parameters.length);
    }else{
        return false;
    }


}

function scenarioValidator(scenario){
return  (
    ( typeof scenario !== 'undefined' && scenario)
&& ( typeof scenario.request !== 'undefined' && scenario.request )
&& ( typeof scenario.request.headers !== 'undefined' && scenario.request.headers )
&& ( typeof scenario.request.headers['Content-Type'] !== 'undefined' && scenario.request.headers['Content-Type'] )
&& ( typeof scenario.parameters !== 'undefined' && scenario.parameters )
&& ( typeof scenario.response !== 'undefined' && scenario.response )
&& ( typeof scenario.response.statusCode !== 'undefined' && scenario.response.statusCode ));
}

function processScenario(request,scenario,operationResponse){
    var response=operationResponse;
console.log("\r\n"+scenario.name+"==>"+processParameters(request,scenario.parameters)  );
if(!requestValidator(request) && !scenarioValidator(scenario)){
response= operationResponse;
}else{
response= processParameters(request,scenario.parameters)?scenario.response:operationResponse;
}

return populateParametersInResponse(request,response);

}

function processScenarios(request,scenarios,operationResponse){
    var response=operationResponse;
try{
if(!requestValidator(request) && !( typeof scenario !== 'undefined' && scenario)){
response=operationResponse;
}else{

    for(var scenarioId in scenarios) {
    if (scenarios.hasOwnProperty(scenarioId)) {
var processedResponse=processScenario(request,scenarios[scenarioId],operationResponse);
    response=(processedResponse!=operationResponse)?processedResponse:response;        
    }else{
response=operationResponse;
    }
}
}
return populateParametersInResponse(request,response);

}catch(error){
return populateParametersInResponse(request,response);
}

}
function operationValidator(operation){
return( 
   ( typeof operation !== 'undefined' && operation)
&& ( typeof operation.parameters !== 'undefined' && operation.parameters )
&& ( typeof operation.scenarios !== 'undefined' && operation.scenarios )
&& ( typeof operation.response !== 'undefined' && operation.response )
&& ( typeof operation.response.statusCode !== 'undefined' && operation.response.statusCode )
);

}
function processOperation(request,operation,stubResponse){
    var response=stubResponse;
try{
if(!requestValidator(request) && !operationValidator(operation)){
response=stubResponse;
}else{
 response=processParameters(request,operation.parameters)?processScenarios(request,operation.scenarios,operation.response):stubResponse;
}

return populateParametersInResponse(request,response);

}catch(error){
    console.log("/n/n\n\n error:"+error  );
return populateParametersInResponse(request,response);
}

}

function processOperations(request,operations,stubResponse){
    console.log("\r\n+++++++"+JSON.stringify(request));
    var response=stubResponse;
try{
if(!requestValidator(request) &&  !( typeof operations !== 'undefined' && operations)){

response=stubResponse;
}else{

  
    for(var operationId in operations) {
    
    if (operations.hasOwnProperty(operationId)) {
var processedResponse=processOperation(request,operations[operationId],stubResponse);
response=(processedResponse!=stubResponse)?processedResponse:response;

    }else{
response=stubResponse;
    }
}

 
}

return populateParametersInResponse(request,response);
}catch(error){
return populateParametersInResponse(request,response);
}

}
function populateParametersInResponse(request,response){
    var body="";
    if(typeof response.body !== 'undefined' && response.body){
    var responseBody=(typeof response.body=="string")?response.body:JSON.stringify(response.body);
     body= populateParameters(request,responseBody.toString());
    response.body=body;
}
    return response;
    }
    function populateParameters(request,responseBody){
        var key=responseBody.substring(responseBody.lastIndexOf("$%")+1,responseBody.lastIndexOf("%$"));
     
        if(key.length>0){
            responseBody=responseBody.replace("$"+key+"%$",getDynamicValueFromRequest(request,key.replace(new RegExp(" ", 'g'),"").replace(new RegExp("%", 'g'),"")));

            return populateParameters(request,responseBody);
        }else{
        return responseBody;
        }
        }
    
    function getDynamicValueFromRequest(request,keyOfParameter){
    var parameterValue="";
    keyOfParameterInPath=keyOfParameter.replace(new RegExp("{", 'g'), "").replace(new RegExp("Id}", 'g'), "").replace(new RegExp("Id", 'g'), "");
    var keyOfParameterInPath=keyOfParameterInPath+"s/";
    var possiblePath=request.path.toLowerCase();
    if(possiblePath.lastIndexOf(keyOfParameterInPath) > -1){
    var firstIndex= possiblePath.lastIndexOf(keyOfParameterInPath)+keyOfParameterInPath.length;
    var restString=possiblePath.substring(firstIndex,possiblePath.length);
    var value= (restString.indexOf("/") >-1)?(restString.substring(0,restString.indexOf("/"))):restString;
     if(typeof value !== 'undefined' && value && value.length>0) parameterValue=value;    
    }
    if( parameterValue=="" && typeof request.query !== 'undefined' && request.query && typeof request.query[keyOfParameter] !== 'undefined' && request.query[keyOfParameter] && request.query[keyOfParameter].length>0) 
    parameterValue= request.query[keyOfParameter];
    

    if( parameterValue=="" && typeof request.form !== 'undefined' && request.form && typeof request.form[keyOfParameter] !== 'undefined' && request.form[keyOfParameter] && request.form[keyOfParameter].length>0) 
    parameterValue= request.form[keyOfParameter];
    


    if(parameterValue=="" && typeof request.headers !== 'undefined' && request.headers && typeof request.headers[keyOfParameter] !== 'undefined' && request.headers[keyOfParameter] && request.headers[keyOfParameter].length>0) 
    parameterValue= request.headers[keyOfParameter];
    

if(request.body.length>0) {

   if(parameterValue==""){
        try{
  
        var dom = require('xmldom').DOMParser;
        var xpathPackage  = require('xpath');
        var doc = new dom().parseFromString(request.body);  
        var nodes = xpathPackage.select(convertXpath(keyOfParameter), doc);
        if(typeof nodes[0].childNodes !== 'undefined' && nodes[0].childNodes && typeof nodes[0].childNodes[0] !== 'undefined' && nodes[0].childNodes[0])
        parameterValue=nodes[0].childNodes[0].nodeValue;
        else if(typeof nodes[0].childNodes !== 'undefined' && nodes[0].childNodes )
        parameterValue="";
        else
        parameterValue=null;

        }catch(error){
            parameterValue="";
        }
    
        if(parameterValue==""){
        try{
            var json = (typeof request.body === 'object') ? request.body : JSON.parse(request.body);
            var JSONPath = require('jsonpath-plus');
            var result = JSONPath({json:json,path:keyOfParameter});
            if( result instanceof Array && result.length>0)
            parameterValue=result.toString();
          }catch(error){
              parameterValue="";
          }
        }
    }
    }
    // console.log("DynamicParameters  "+keyOfParameter+"====>"+parameterValue);
    return parameterValue;
    }
    
    
    module.exports = {
        processParameters:processParameters,
        convertXpath:convertXpath,
        compareString:compareString,
        compareElementValueForXpath:compareElementValueForXpath,
        compareElementValueForJsonPath:compareElementValueForJsonPath,
        compareElementValueForQueryFormHeaderMethodPath:compareElementValueForQueryFormHeaderMethodPath,
        compareElementValueInPath:compareElementValueInPath,
        requestValidator:requestValidator,
        parameterValidator:parameterValidator,
        processParameter:processParameter,
        parametersValidator:parametersValidator,
        scenarioValidator:scenarioValidator,
        processScenario:processScenario,
        processScenarios:processScenarios,
        operationValidator:operationValidator,
        processOperation:processOperation,
        processOperations:processOperations,
        getDynamicValueFromRequest:getDynamicValueFromRequest,
        populateParametersInResponse:populateParametersInResponse
    };
    