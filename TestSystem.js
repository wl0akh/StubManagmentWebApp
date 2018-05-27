var http = require('http');
var sM=require("./stubManagment.js");
var fs = require('fs');
var rootId="b2156469-3312-b11d-2ce3-d1590cd7a1f2";
var JSONDefaultBody={"error":"Not Found"};
var stubResponse={"statusCode": "404", "headers": { "Content-Type": "application/json"},  "body": JSONDefaultBody};
var	expectedStub=require("./InjectionExpectedStub.json");
var expectedOperationId="848b0bf9-9867-c275-36dc-c4f15c1ecf36";
var expectedScenarioId="e832239a-337a-f381-558e-b0e10027cc42";
var operationJSON=expectedStub.operations["4b8b43a6-9375-f8a6-6eb6-514a5c3e9781"];
var operationXML=expectedStub.operations["e9d32e35-fb42-7654-23b0-6fd65c1492c2"];
var scenarioJSON=operationJSON.scenarios["929becb8-3e74-6c2b-cee4-2a37e6873a4e"];
var scenarioXML=operationJSON.scenarios["7843d201-bf4c-5fd6-c6a9-8d1b88f1e1b9"];
function displayResult(condition){
    return (condition)?"<h3 style='color:green'>passed</h3>":"<h3 style='color:red'>failed</h3>";
    }
function createUpdateRootTest(){
    var result=false;
var root = {"rootId":rootId,"name":"rootName","description":"rootDescription"};
    if(sM.createUpdateRoot(root.rootId,root.name,root.description)){
        // console.log(sM.getRoot(rootId).rootId+"==>"+root.rootId);
      result=(sM.getRoot(rootId).rootId==root.rootId);
    }

return displayResult(result);

}
function createUpdateStubTest(){
	// console.log(sM.processOperations(requestJSON,operations,stubResponse).body.toString()+"===>"+scenarioJSON.response.body.toString());
var result=false;
if(sM.createUpdateStub(rootId,expectedStub.id,expectedStub.name,expectedStub.protocol,expectedStub.port,expectedStub.defaultResponse)){
expectedStub.port="9999";
sM.createUpdateStub(rootId,expectedStub.id,expectedStub.name,expectedStub.protocol,expectedStub.port,expectedStub.defaultResponse)
if(sM.getStub(rootId,expectedStub.id).port=="9999"){
result=true;
}else{
	console.log("error createing stub 11");
	result=false;
}
}else{
	console.log("error createing stub 22");
	result=false;
}
return displayResult(result);
}
function createUpdateOperationTest(){
	var result=false;

if(sM.createUpdateOperation(rootId,expectedStub.id,expectedOperationId,operationXML.name,operationXML.response,operationXML.parameters)){
	// console.log(sM.getStub(rootId,expectedStub.id).operations[expectedOperationId].response.body+"==>"+operationXML.response.body);
result=(sM.getStub(rootId,expectedStub.id).operations[expectedOperationId].response.body==operationXML.response.body)?true:false;
}else{
	console.log("error createing operation 11");
	result=false;
}

return displayResult(result);
}

function createUpdateScenarioTest(){
	// console.log(sM.processOperations(requestJSON,operations,stubResponse).body.toString()+"===>"+scenarioJSON.response.body.toString());
var result=false;

if(sM.createUpdateScenario(rootId,expectedStub.id,expectedOperationId,null,scenarioJSON.name,scenarioJSON.request,scenarioJSON.response,scenarioJSON.parameters,scenarioJSON.tag)){
var getScenarios=sM.getStub(rootId,expectedStub.id).operations[expectedOperationId].scenarios

for(var Id in getScenarios) {
    if (getScenarios.hasOwnProperty(Id)) {
    	expectedScenarioId=Id;
    	}
    }

if(sM.createUpdateScenario(rootId,expectedStub.id,expectedOperationId,expectedScenarioId,scenarioXML.name,scenarioXML.request,scenarioXML.response,scenarioXML.parameters,scenarioXML.tag)){
	// console.log(sM.getStub(expectedStub.id).operations);
result=(sM.getStub(rootId,expectedStub.id).operations[expectedOperationId].scenarios[expectedScenarioId].response.body==scenarioXML.response.body)?true:false;
}else{
	console.log("error createing scenario 11");
	result=false;
}
}else{
	console.log("error creating scenario 22");
	result=false;
}
return displayResult(result);
}


function deleteScenarioTest(){

    var stubBefore=sM.getStub(rootId,expectedStub.id);
    
    sM.deleteScenario(rootId,expectedStub.id,expectedOperationId,expectedScenarioId);
     var stubAfter=sM.getStub(rootId,expectedStub.id);
    if(stubAfter.operations[expectedOperationId]){
    return displayResult(!(stubAfter.operations[expectedOperationId].scenarios[expectedScenarioId]));
    }else{
        return displayResult(false);
    }

}

function deleteOperationTest(){

    var stubBefore=sM.getStub(rootId,expectedStub.id);
    
    sM.deleteOperation(rootId,expectedStub.id,expectedOperationId);
     var stubAfter=sM.getStub(rootId,expectedStub.id);
    if(stubAfter.operations){
    return displayResult(!(stubAfter.operations[expectedOperationId]));
    }else{
        return displayResult(false);
    }

}


function deleteStubTest(){
sM.deleteStub(rootId,expectedStub.id);
   return  displayResult(!sM.getStub(rootId,expectedStub.id));

}


function deleteRootTest(){
sM.deleteRoot(rootId);
   return  displayResult(!sM.getRoot(rootId));

}



function generateInjectionTest(){
// console.log( sM.generateInjection(expectedStub.operations,expectedStub.defaultResponse));
 operations=expectedStub.operations;
 stubResponse=expectedStub.defaultResponse;
        var injectFile=fs.readFileSync("./injection.js");
    return displayResult(
        sM.generateInjection(expectedStub.operations,expectedStub.defaultResponse)=='function (request, state, logger){ '+injectFile+'return processOperations(request,JSON.parse('+JSON.stringify(JSON.stringify(operations))+'),JSON.parse('+JSON.stringify(JSON.stringify(stubResponse))+'));}'
        );

}


function getListOfOperationsOrScenariosTest(){
   
    var expectedListOfOperations={};
expectedListOfOperations[expectedOperationId]={"name":"operationXML"};
var expectedListOfScenarios={"7843d201-bf4c-5fd6-c6a9-8d1b88f1e1b9":{"name":expectedStub["operations"]["4b8b43a6-9375-f8a6-6eb6-514a5c3e9781"]['scenarios']["7843d201-bf4c-5fd6-c6a9-8d1b88f1e1b9"]['name'],"tag":expectedStub["operations"]["4b8b43a6-9375-f8a6-6eb6-514a5c3e9781"]['scenarios']["7843d201-bf4c-5fd6-c6a9-8d1b88f1e1b9"]['tag']}};

var operationslist=sM.getListOfOperationsOrScenarios(sM.getStub(rootId,expectedStub.id)['operations']);

// var scenarioslist=sM.getListOfOperationsOrScenarios(sM.getStub(rootId,expectedStub.id)['operations'][expectedOperationId]["scenarios"]);

  console.log(JSON.stringify(operationslist)+"***"+JSON.stringify(expectedListOfOperations));
    return displayResult(
        operationslist[expectedOperationId]["name"]==expectedListOfOperations[expectedOperationId]["name"]

        );
}
function getStubsTest(){
    var stubList={"5e143eb7-8847-c43e-3eed-816e39cfc038":"Adil'sStub"};
var list=sM.getStubs(rootId);
var count=0;
var passed=0;
    for(var id in list) { 
        count++;
     if (list.hasOwnProperty(id) && list[id]==stubList[id])
        {   passed++;
            // console.log("**"+list[id]+"==>"+stubList[id]);
        }
}


    return displayResult(count==passed);
}

function getRootsTest(){
    var rootList={"b2156469-3312-b11d-2ce3-d1590cd7a1f2":"rootName"};
var list=sM.getRoots(rootId);
var count=1;
var passed=0;
    for(var id in list) { 

     if (list.hasOwnProperty(id) && list[id]==rootList[id])
        {   passed++;
            console.log("**"+list[id]+"==>"+rootList[id]);
        }
}
    return displayResult(count==passed);
}

// create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    html="<p>";
    
    
    /** TEST for generateInjection  **/
    html+="<h3>test generateInjection</h3>";
    html+=generateInjectionTest();
    
    
    /** TEST for createUpdateRoot  **/
    html+="<h3>test createUpdateRoot</h3>";
    html+=createUpdateRootTest();
    
    
    /** TEST for createUpdateStub **/
    html+="<h3>test createUpdateStub</h3>";
    html+=createUpdateStubTest();
    
    
    /** TEST for createUpdateOperation  **/
    html+="<h3>test createUpdateOperation</h3>";
    html+=createUpdateOperationTest();
    
    
    /** TEST for createUpdateOperation  **/
    html+="<h3>test createUpdateScenario</h3>";
    html+=createUpdateScenarioTest();
    
    
    
    /** TEST for getListOfOperationsOrScenariosTest  **/
    html+="<h3>test getListOfOperationsOrScenariosTest</h3>";
    html+=getListOfOperationsOrScenariosTest();
    
    /** TEST for getStubs  **/
    html+="<h3>test getStubs</h3>";
    html+=getStubsTest();
    
    /** TEST for getRoots  **/
    html+="<h3>test getRoots</h3>";
    html+=getRootsTest();
    
    /** TEST for deleteScenario  **/
    html+="<h3>test deleteScenario</h3>";
    html+=deleteScenarioTest();
    
    
    // /** TEST for deleteOperation  **/
    html+="<h3>test deleteOperation</h3>";
    html+=deleteOperationTest();
    
    
    /** TEST for deleteStub **/
    html+="<h3>test deleteStub</h3>";
    html+=deleteStubTest();
    
    
    
    /** TEST for deleteRoot  **/
    html+="<h3>test deleteRoot</h3>";
    html+=deleteRootTest();
    
    
    
      res.write(html); //write a response to the client
      res.end(); //end the response
    }).listen(7978); //the server object listens on port 8080
