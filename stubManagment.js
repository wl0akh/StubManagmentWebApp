

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
// console.log("<p><h1>"+(A+comparator+ B) +", "+(A.toLowerCase()==B.toLowerCase())+", "+"</h1>"); 
    return (A.toLowerCase()==B.toLowerCase())?true:false;
}else if(comparator=="!="){  
// console.log("<p><h1>"+(A+comparator+ B) +", "+(A.toLowerCase()!=B.toLowerCase())+", "+"</h1>"); 
return (A.toLowerCase()!=B.toLowerCase())?true:false;
}else if(comparator=="contains"){  
// console.log("<p><h1>"+(A+comparator+ B) +", "+(A.toLowerCase().indexOf(B.toLowerCase()) > -1)+", "+"</h1>"); 
return (A.toLowerCase().indexOf(B.toLowerCase()) > -1)?true:false;
}else if(comparator=="RegEx"){  
// console.log("<p><h1>"+(A+comparator+ B) +", "+(A.match(new RegExp(B,"g"))!=null)+", "+", "+"</h1>"); 
return (A.match(new RegExp(B,"g"))!=null)?true:false;
}else if(comparator=="exist"){  
// console.log("<p><h1>"+(A+comparator+ B) +", "+", "+(( typeof A !== 'undefined' && A )?true:false)+", "+"</h1>"); 
return ( typeof A !== 'undefined' && A )?true:false;
}else{  return false;}
}catch(error){
    console.log("<h1>"+error.toString()+"</h1>");
return false;
}

}
function compareElementValueForXpath(xpath,xml,val,comparator){
try{
var dom = require('xmldom').DOMParser;
var xpathPackage  = require('xpath');
var doc = new dom().parseFromString(xml);
var nodes = xpathPackage.select(convertXpath(xpath), doc);
// console.log("<h1>"+xpathPackage.select(convertXpath("//cli:client"), doc)[0].firstChild.toString()+" ==>"+xpathPackage.select(convertXpath("//iden:id"), doc)[0].firstChild.toString()+"</h1>");
return compareString(nodes[0].firstChild.data.toString(),val,comparator);
}catch(error){
    // console.log("<h1>"+xpath+","+xml+","+val+","+comparator+error.toString()+"</h1>");
return false;
}
}

function compareElementValueForJsonPath(jsonPath,possibleJSON,val,comparator){
try{
  var json = (typeof possibleJSON === 'object') ? possibleJSON : JSON.parse(possibleJSON);
var JSONPath = require('jsonpath-plus');
 var result = JSONPath.eval(json, jsonPath);
    // console.log("<h1>"+result.toString()+"</h1>");
return compareString( result.toString(),val,comparator);
}catch(error){
    // console.log("<h1>"+error.toString()+"</h1>");
return false;
}
}

function compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,val,comparator){
    // console.log("<h1>"+keyOfParameter.toString()+possibleQueryFormHeaderMethodPath[keyOfParameter]+val+comparator+"</h1>===>"+compareString(val,possibleQueryFormHeaderMethodPath[keyOfParameter],comparator));
return (keyOfParameter=='method' || keyOfParameter=='path')?compareString(possibleQueryFormHeaderMethodPath,val,comparator):compareString(possibleQueryFormHeaderMethodPath[keyOfParameter],val,comparator);
}

function compareElementValueInPath(keyOfParameter,possiblePath,val,comparator){
var keyOfParameters=keyOfParameter+"s/";
if(possiblePath.lastIndexOf(keyOfParameters) > -1){
var firstIndex= possiblePath.lastIndexOf(keyOfParameters)+keyOfParameters.length;
var restString=possiblePath.substring(firstIndex,possiblePath.length);
var parameterValue= (restString.indexOf("/") >-1)?(restString.substring(0,restString.indexOf("/"))):restString;
// console.log(keyOfParameter+"<h1>"+possiblePath+"<h1>"+firstIndex+" &&& "+parameterValue+"</h1>===>"+compareString(parameterValue,val,comparator));
return compareString(parameterValue,val,comparator);
}else{
    return false;
}


}

function requestValidator(request){
        return (
                       ( typeof request !== 'undefined' && request ) 
                    // && ( typeof request.headers !== 'undefined' && request.headers ) 
                    // && ( typeof request.headers['Content-Type'] !== 'undefined' && request.headers['Content-Type'] )
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

        // console.log(parameter.in+", "+parameter.key+", "+request.headers['Content-Type']+", "+parameter.val+", "+parameter.comparator);
if( !parameterValidator(parameter) && !requestValidator(request)){
    return false;
}
else if(parameter.in=="body" ){
    if(request.headers['Content-Type'].indexOf("application/xml")>-1){ return compareElementValueForXpath(parameter.key,request.body,parameter.val,parameter.comparator);}
    else if(request.headers['Content-Type'].indexOf("application/json")>-1){        return compareElementValueForJsonPath(parameter.key,request.body,parameter.val,parameter.comparator);}
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
parameters.forEach(function(val){if(processParameter(request,val)){parametersPassed++;}});
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
if(!requestValidator(request) && !scenarioValidator(scenario)){
    response=operationResponse;
}else{
    // console.log( processParameters(request,scenario.parameters)?scenario.response:operationResponse);
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
        // console.log( scenarioId+"(("+request+"))"+","+scenarios[scenarioId]+","+operationResponse);
       response=processScenario(request,scenarios[scenarioId],operationResponse);        
    }else{
response=operationResponse;
    }
}
}
    // console.log(response);
    return populateParametersInResponse(request,response);

}catch(error){
        // console.log( "Error: "+error.toString());
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
        return populateParametersInResponse(request,response);
}

}

function processOperations(request,operations,stubResponse){
    // console.log("\r\n+++++++"+JSON.stringify(request));
    var response=stubResponse;
try{
if(!requestValidator(request) &&  !( typeof operations !== 'undefined' && operations)){
response=stubResponse;
}else{

  
    for(var operationId in operations) {
    
    if (operations.hasOwnProperty(operationId)) {
  
 response=processOperation(request,operations[operationId],stubResponse);

    }else{
response=stubResponse;
    }
}

 
}

return populateParametersInResponse(request,response);
}catch(error){

    console.log("error processing Operation"+JSON.stringify(populateParametersInResponse(request,response)));
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
        var key=responseBody.substring(responseBody.lastIndexOf("<%")+1,responseBody.lastIndexOf("%>"));
     
        if(key.length>0){
            responseBody=responseBody.replace("<"+key+"%>",getDynamicValueFromRequest(request,key.replace(new RegExp(" ", 'g'),"").replace(new RegExp("%", 'g'),"")));

            return populateParameters(request,responseBody);
        }else{
        return responseBody;
        }
        }
    
    function getDynamicValueFromRequest(request,keyOfParameter){
    var parameterValue="";
    keyOfParameter=keyOfParameter.replace(new RegExp("{", 'g'), "").replace(new RegExp("Id}", 'g'), "").replace(new RegExp("Id", 'g'), "");
    var keyOfParameters=keyOfParameter+"s/";
    var possiblePath=request.path.toLowerCase();
    if(possiblePath.lastIndexOf(keyOfParameters) > -1){
    var firstIndex= possiblePath.lastIndexOf(keyOfParameters)+keyOfParameters.length;
    var restString=possiblePath.substring(firstIndex,possiblePath.length);
    var value= (restString.indexOf("/") >-1)?(restString.substring(0,restString.indexOf("/"))):restString;
     if(typeof value !== 'undefined' && value && value.length>0) parameterValue=value;    
    }
    if(typeof request.query !== 'undefined' && request.query && typeof request.query[keyOfParameter] !== 'undefined' && request.query[keyOfParameter] && request.query[keyOfParameter].length>0) 
    parameterValue= request.query[keyOfParameter];
    

    if(typeof request.form !== 'undefined' && request.form && typeof request.form[keyOfParameter] !== 'undefined' && request.form[keyOfParameter] && request.form[keyOfParameter].length>0) 
    parameterValue= request.form[keyOfParameter];
    


    if(typeof request.headers !== 'undefined' && request.headers && typeof request.headers[keyOfParameter] !== 'undefined' && request.headers[keyOfParameter] && request.headers[keyOfParameter].length>0) 
    parameterValue= request.headers[keyOfParameter];
    

if(request.body.length>0) {

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
    // console.log("DynamicParameters  "+keyOfParameter+"====>"+parameterValue);
    return parameterValue;
    }




var fs = require('fs');
var stubDir="./stubs";

module.exports = {

getListOfOperationsOrScenarios:getListOfOperationsOrScenarios,
deleteRoot:deleteRoot,
getRoot:getRoot,
getRoots:getRoots,
createUpdateRoot:createUpdateRoot,
deleteScenario:deleteScenario,
deleteOperation:deleteOperation,
deleteStub:deleteStub,
stubDir:stubDir,
getStubs:getStubs,
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
populateParametersInResponse:populateParametersInResponse,


validateResponse:validateResponse,
validateStub:validateStub,
saveFile:saveFile,
processResponse:processResponse,
getStub:getStub,
guid:guid,
createUpdateStub:createUpdateStub,
createUpdateOperation:createUpdateOperation,
createUpdateScenario:createUpdateScenario,
generateInjection:generateInjection,
};



function getStubs(rootId){
   
    var list={};
    try{
    if(( typeof rootId !== 'undefined' && rootId) ){
 var files = fs.readdirSync(stubDir+"/"+rootId+"/");
for (var i in files) {
    if( files[i].indexOf(".json") > -1){
      var definition = JSON.parse(fs.readFileSync(stubDir+"/"+rootId+"/"+ files[i]));
      if( ( typeof definition !== 'undefined' && definition) &&  ( typeof definition.name !== 'undefined' && definition.name) &&  ( typeof definition.id !== 'undefined' && definition.id))
        list[definition.id]=definition.name;
      // console.log('Model Loaded: ' +definition.id);
  }
}
}
return list;

}catch(error){
    console.log('Error Getting Stub: ' +error.toString());
    return list;
}
}





function getRoots(){
   
    var list={};
try{

 var files = fs.readdirSync(stubDir+"/");
for (var i in files) {
if(fs.statSync(stubDir+"/"+files[i]).isDirectory()){
    var root=getRoot(files[i]);
if( typeof  root  !== 'undefined' &&  root ){    
if(( typeof  root.rootId  !== 'undefined' &&  root.rootId ) && ( typeof  root.name !== 'undefined' &&  root.name) ){
        list[root.rootId]=root.name;
    }}
}
}

return list;

}catch(error){
    console.log('Error Getting Stub: ' +error.toString());
    return list;
}
}







function validateResponse(response){
    return( 
   ( typeof response !== 'undefined' && response)
&& ( typeof response.statusCode !== 'undefined' && response.statusCode )
&& ( typeof response.headers !== 'undefined' && response.headers )
&& ( typeof response.headers["Content-Type"] !== 'undefined' && response.headers["Content-Type"] )
&& response.headers["Access-Control-Allow-Origin"]=='*'
&& response.headers["Access-Control-Allow-Headers"]=='Origin, X-Requested-With, Content-Type, Accept'
&& response.headers["Access-Control-Allow-Methods"]=='GET, POST, PUT, PATCH, DELETE'
);
}
function validateStub(stub){

return( 
   ( typeof stubDir !== 'undefined' && stubDir)
&& ( typeof stub !== 'undefined' && stub)
&& ( typeof stub.id !== 'undefined' && stub.id )
&& ( typeof stub.name !== 'undefined' && stub.name )
&& ( typeof stub.port !== 'undefined' && stub.port )
&& ( typeof stub.protocol !== 'undefined' && stub.protocol )
&&  validateResponse(stub.defaultResponse)
);
}
function saveFile(rootId,stub){
    if(validateStub(stub)){
try{
var stubs=[{"responses":[{"inject":generateInjection(stub.operations,stub.defaultResponse)}]}];
stub.stubs=stubs;
var files = fs.readdirSync(stubDir+"/"+rootId+"/"); 
var file;
files.forEach(elemet=>{ 
 if((elemet.split("_")[1]==stub.id+".json")){
     file=elemet;
 }
});
if(file!=undefined)
{
fs.writeFileSync(stubDir+"/"+rootId+"/"+file, JSON.stringify(stub));
}
else
{
fs.writeFileSync(stubDir+"/"+rootId+"/"+stub.name+"_"+stub.id+".json", JSON.stringify(stub));  
}
return true;
}catch(error){
    console.log("Error:"+error.toString());
return false
}
}else{
console.log("invalid stub:"+stub.toString());
return false;
}

}


function processResponse(response){
    if( ( typeof response !== 'undefined' && response)
&& ( typeof response.statusCode !== 'undefined' && response.statusCode )
&& ( typeof response.headers !== 'undefined' && response.headers )
&& ( typeof response.headers["Content-Type"] !== 'undefined' && response.headers["Content-Type"] )
){
response.headers["Access-Control-Allow-Origin"]='*';
response.headers["Access-Control-Allow-Headers"]='Origin, X-Requested-With, Content-Type, Accept';
response.headers["Access-Control-Allow-Methods"]='GET, POST, PUT, PATCH, DELETE';
}
return response;

}

function getStub(rootId,id){
try{
    var files = fs.readdirSync(stubDir+"/"+rootId+"/"); 
var file;
 files.forEach(elemet=>{ 
     if((elemet.split("_")[1]==id+".json")){
         file=elemet;
     }
    });
// console.log(file);
var file=JSON.parse(fs.readFileSync(stubDir+"/"+rootId+"/"+file));
return file;
}catch(error){
console.log("Get Stub Error: "+error.toString());
return false;
}

}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function getRoot(rootId){
try{
var file=fs.readFileSync(stubDir+"/"+rootId+"/about.txt"); 
return JSON.parse(file);
}catch(error){
console.log("Get root Error: "+error.toString());
return false;
}


}

function createUpdateRoot(rootId,name,description){
     try{
    if (!fs.existsSync(stubDir+"/"+rootId)) fs.mkdirSync(stubDir+"/"+rootId); 

var about={"rootId":rootId,"name":name,"description":description};
fs.writeFileSync(stubDir+"/"+rootId+"/about.txt", JSON.stringify(about));
return true;
    }catch(error){
        console.log("Error:"+error.toString());
    return false
    }

}

function createUpdateStub(rootId, id,name,protocol,port,defaultResponse){

if( ( typeof name !== 'undefined' && name) 
    && ( typeof protocol !== 'undefined' && protocol)
    && ( typeof port !== 'undefined' && port && !isNaN(port))
 && ( typeof defaultResponse !== 'undefined' && defaultResponse)){
    defaultResponse=processResponse(defaultResponse);
    id=( typeof id !== 'undefined' && id)?id:guid();
    var stub=(getStub(rootId ,id))?getStub(rootId,id):{};
    stub.id=id;
    stub.name=name;
    stub.protocol=protocol;
    stub.port=port;
    stub.defaultResponse=defaultResponse;
    stub.operations=( typeof stub.operations !== 'undefined' && stub.operations)?stub.operations:{};
// console.log(saveFile(stub));
return (saveFile(rootId, stub))?true:false;

}else{
    return false;
}


}

function createUpdateOperation(rootId, stubId,operationId,name,response,parameters){
var stub=getStub(rootId, stubId);

if( ( typeof rootId !== 'undefined' && rootId) && ( typeof stubId !== 'undefined' && stubId) 
    && ( typeof name !== 'undefined' && name )
    && ( typeof response !== 'undefined' && response )
    && ( typeof stub !== 'undefined' && stub )
 && parametersValidator(parameters)){

    response=processResponse(response);
    operationId=( typeof operationId !== 'undefined' && operationId)?operationId:guid();

   var existingScenarios={};
   if(typeof stub.operations[operationId] !== 'undefined' && stub.operations[operationId] ) 
    existingScenarios=( typeof stub.operations[operationId]["scenarios"] !== 'undefined' && stub.operations[operationId]["scenarios"])?stub.operations[operationId]["scenarios"]:{};
        stub.operations[operationId]={"name":name,"response":response,"parameters":parameters,"scenarios":existingScenarios};
    //  console.log(saveFile(rootId, stub));

return (saveFile(rootId, stub))?true:false;

}else{
    console.log("error createing operations ");
    return false;
}


}



function createUpdateScenario(rootId, stubId,operationId,scenarioId,name,request,response,parameters,tag){
    // console.log(stubId+","+operationId+","+scenarioId+","+name+","+request+","+response+","+parameters+","+tag);
var stub=getStub(rootId, stubId);
if( 
    ( typeof rootId !== 'undefined' && rootId) 
    && ( typeof stubId !== 'undefined' && stubId) 
    &&( typeof operationId !== 'undefined' && operationId) 
    && ( typeof name !== 'undefined' && name )
    && ( typeof tag !== 'undefined' && tag )
    && ( typeof response !== 'undefined' && response )
    && ( typeof response.statusCode !== 'undefined' && response.statusCode )
    && ( typeof stub !== 'undefined' && stub )
 && parametersValidator(parameters)){
    response=processResponse(response);
    scenarioId=( typeof scenarioId !== 'undefined' && scenarioId)?scenarioId:guid();

        stub.operations[operationId].scenarios[scenarioId]={"name":name,"tag":tag,"request":request,"response":response,"parameters":parameters};
// console.log(saveFile(stub))
return (saveFile(rootId, stub))?true:false;

}else{
    console.log("error createing scenario ");
    return false;
}


}

function deleteScenario(rootId, stubId,operationId,scenarioId){
return  deleteStuff(function(rootId, stubId,operationId,scenarioId){var stub = getStub(rootId,stubId);return (delete stub.operations[operationId].scenarios[scenarioId])?saveFile(rootId,stub):false;},rootId,stubId,operationId,scenarioId);
}
function deleteOperation(rootId, stubId,operationId){
return  deleteStuff(function(rootId, stubId,operationId,scenarioId){var stub = getStub(rootId,stubId);return (delete stub.operations[operationId])?saveFile(rootId,stub):false;},rootId,stubId,operationId);
}


function deleteRoot(rootId){
return  deleteStuff(function(rootId){return (fs.unlinkSync(stubDir+"/"+rootId+"/about.txt"));},rootId);
}
function deleteStub(rootId, stubId){
var stub=getStub(rootId, stubId);
var stubName=stub["name"];
return  deleteStuff(function(rootId, stubId){return (fs.unlinkSync(stubDir+"/"+rootId+"/"+stubName+"_"+stubId+".json"));},rootId,stubId);
}
function deleteStuff(callback,rootId, stubId,operationId,scenarioId){
try{
 (callback(rootId, stubId,operationId,scenarioId));
}catch(error){
console.log("Error deleting elemet from Stub Object: "+error.toString());
return false;
}
return true;
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function generateInjection(operations,stubResponse){
var injectFile=fs.readFileSync("./injection.js");
return 'function (request, state, logger){ '+injectFile+'return processOperations(request,JSON.parse('+JSON.stringify(JSON.stringify(operations))+'),JSON.parse('+JSON.stringify(JSON.stringify(stubResponse))+'));}';

}

function getListOfOperationsOrScenarios(Array){
  var list ={};
  try{
    for(var elemet in Array) { 

     if (Array.hasOwnProperty(elemet))
        {  
            var elemetValue={};
            elemetValue["name"]=Array[elemet]["name"];
         if( typeof Array[elemet]["tag"] !== 'undefined' && Array[elemet]["tag"] )
         elemetValue["tag"]=Array[elemet]["tag"];

         list[elemet]=elemetValue;
        }
}

return list
  }catch(error){
    return list;
  }

}