var http = require('http');
var fs = require('fs');
var sI=require("./injection.js");
var xpathTestArray=[
    {"input":"//book","output":"//book"},
    {"input":"//@all","output":"//@all"},
    {"input":".//","output":".//"},
    {"input":"..//","output":"..//"},
    {"input":"/book::child","output":"/book::child"},
    {"input":"//soap:book[@all]","output":"//*[name()='soap:book' and @all ]"},
    {"input":"/soapenv:Envelope/soapenv:Body/cli:getAccountListRequest/cli:client/iden:id","output":"/*[name()='soapenv:Envelope']/*[name()='soapenv:Body']/*[name()='cli:getAccountListRequest']/*[name()='cli:client']/*[name()='iden:id']"}
     ];
    var comparebodyXmlTestArray=[
    // {"input":"<booksdata><book1>111</book1><book2>222</book2></booksdata>","output":"<booksdata><book1>111</book1><book2>222</book2></booksdata>"},
    {"input":"<booksdata><book1>111</book1><book2>222</book2></booksdata>","output":"<booksdata><book2>222</book2><book1>111</book1></booksdata>"},
    // {"input":"<booksdata><book1></book1><book2>222</book2></booksdata>","output":"<booksdata><book2>222</book2><book1/></booksdata>"},
    // {"input":"<booksdata><book1/><book2>222</book2></booksdata>","output":"<booksdata><book2>222</book2></booksdata>"},
    // {"input":"<booksdata><book1/><book2>222</book2></booksdata>","output":"<booksdata><book3>222</book3></booksdata>"},
     ];
var possibleQueryFormHeaderMethodPath={"postCode": "sr4 7ha"};
var keyOfParameter='postCode';
var xpath=xpathTestArray[xpathTestArray.length-1].input;
var jsonPath="$.address.postalCode";

var 	expectedStub=require("./InjectionExpectedStub.json");
var xml = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cli='http://www.sonatacentral.com/service/v30/common/client' xmlns:ser='http://www.sonatacentral.com/service/v30/Service' xmlns:cal='http://www.sonatacentral.com/service/v30/CallerDetails' xmlns:iden='http://www.sonatacentral.com/service/v30/globaltypes/IdentifierType' xmlns:cli1='http://www.sonatacentral.com/service/v30/globaltypes/common/client/ClientGroupType' xmlns:dat='http://www.sonatacentral.com/service/v30/globaltypes/common/data/DataGroupType'>   <soapenv:Header/>   <soapenv:Body>      <cli:getAccountListRequest>         <ser:CallerDetails>            <cal:username>demo</cal:username>            <cal:country>uk</cal:country>            <cal:language>en</cal:language>            <cal:databaseIdentifier>SonataDatasource</cal:databaseIdentifier>         </ser:CallerDetails>         <cli:client>            <!--Optional:-->            <iden:id>SR4 7HA</iden:id>         </cli:client>         <!--Zero or more repetitions:-->         <!--Optional:-->         <cli:includeClientAccountRelationship all='?'>all</cli:includeClientAccountRelationship>         <!--Optional:-->         <cli:includeAdvisorGroup>true</cli:includeAdvisorGroup>         <!--Optional:-->         <cli:includeProduct>true</cli:includeProduct>         <!--Optional:-->         <cli:includeRegularContributionPlan>true</cli:includeRegularContributionPlan>         <!--Optional:-->         <cli:includeMarketingCampaign>true</cli:includeMarketingCampaign>         <!--Optional:-->         <cli:includeEmployer>true</cli:includeEmployer>         <!--Optional:-->         <cli:includeExternalReference>true</cli:includeExternalReference>         <!--Optional:-->         <cli:includeGenericVariable>true</cli:includeGenericVariable>         <!--Optional:-->         <cli:includeSuperDetailsWithoutExp>true</cli:includeSuperDetailsWithoutExp>         <!--Optional:-->         <cli:includeSuperDetails>true</cli:includeSuperDetails>         <!--Optional:-->         <cli:includeSchemeCategory>true</cli:includeSchemeCategory>         <!--Optional:-->         <cli:includeLatestActivity>true</cli:includeLatestActivity>         <!--Optional:-->         <cli:includeCashAndStockBalance>true</cli:includeCashAndStockBalance>         <!--Optional:-->        </cli:getAccountListRequest>   </soapenv:Body></soapenv:Envelope>";
var possibleJSON='{  "firstName": "John",  "lastName" : "doe",  "age"      : 26,  "address"  : {    "streetAddress": "naist street",    "city"         : "Nara",    "postalCode"   : "sr4 7ha"  },  "phoneNumbers": [    {      "type"  : "iPhone",      "number": "0123-4567-8888"    },    {      "type"  : "home",      "number": "0123-4567-8910"    }  ]}';

var requestJSON={
  "requestFrom": "::1:53926",
  "method": "GET",
  "path": "/customers/12345/advisors/678910",
  "query": {
      "QUERY1": "QUERY1"
  },       
  "form": {
      "QUERY1": "QUERY1"
  },
  "headers": {
    "Content-Type":"application/json",
      "Host": "localhost:7780",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36",
      "Postman-Token": "79ba9ef8-9f83-e313-2735-ed9ac8d09ddf",
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9"
  },
  "body": possibleJSON
};
var requestXML={
  "requestFrom": "::1:53926",
  "method": "GET",
  "path": "/customers/12345/advisors/678910",
  "query": {
      "QUERY1": "QUERY1"
  },       
  "form": {
      "QUERY1": "QUERY1"
  },
  "headers": {
    "Content-Type":"application/xml",
      "Host": "localhost:7780",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36",
      "Postman-Token": "79ba9ef8-9f83-e313-2735-ed9ac8d09ddf",
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9"
  },
  "body": xml
};
var operationJSON=expectedStub.operations["4b8b43a6-9375-f8a6-6eb6-514a5c3e9781"];
var operationXML=expectedStub.operations["e9d32e35-fb42-7654-23b0-6fd65c1492c2"];
var scenarioJSON=operationJSON.scenarios["929becb8-3e74-6c2b-cee4-2a37e6873a4e"];
var scenarioXML=operationJSON.scenarios["7843d201-bf4c-5fd6-c6a9-8d1b88f1e1b9"];
// fs.writeFileSync("./InjectionExpectedStub.json", JSON.stringify(expectedStub));

function testloopconverter(inputArray,functionName){
var passed=0;
inputArray.forEach(function(value){
if(functionName(value.input)==value.output){
passed++;
}else{
// console.log(val.input+","+val.output+"==>"+(functionName(val.input)==val.output));
}});
return displayResult(passed==inputArray.length);
}
function testloopBodyXml(inputArray,functionName){
var passed=0;
inputArray.forEach(function(value){
if(functionName(value.input,value.output)){
passed++;
}else{
// console.log(val.input+","+val.output+"==>"+(functionName(val.input)==val.output));
}});
return displayResult(passed==inputArray.length);
}
function displayResult(condition){
return (condition)?"<h3 style='color:green'>passed</h3>":"<h3 style='color:red'>failed</h3>";
}
function convertXpathTest(){
return testloopconverter(xpathTestArray,sI.convertXpath);
}
function compareElementValueForXpathTest(){

return displayResult(sI.compareElementValueForXpath(xpath,scenarioXML.response.body,"SR4 7HA","==") && sI.compareElementValueForXpath(xpath,scenarioXML.response.body,"sr4","!=") && sI.compareElementValueForXpath(xpath,scenarioXML.response.body,"SR4 7HA","contains") && sI.compareElementValueForXpath(xpath,scenarioXML.response.body,"([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})","RegEx") && sI.compareElementValueForXpath("//cli:client",scenarioXML.response.body,null,"exist") && !sI.compareElementValueForXpath("//cli:client","hggc",null,"exist"));
  }
function compareElementValueForJsonPathTest(){
return displayResult(sI.compareElementValueForJsonPath(jsonPath,scenarioJSON.response.body,"SR4 7HA","==") && sI.compareElementValueForJsonPath(jsonPath,scenarioJSON.response.body,"sr4","!=") && sI.compareElementValueForJsonPath(jsonPath,scenarioJSON.response.body,"SR4 7HA","contains") && sI.compareElementValueForJsonPath(jsonPath,scenarioJSON.response.body,"([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})","RegEx") && sI.compareElementValueForJsonPath("$.address",scenarioJSON.response.body,null,"exist"));
  }

function compareElementValueForQueryFormHeaderMethodPathTest(){


	return displayResult(sI.compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,"SR4 7HA","==") && sI.compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,"sr4","!=") && sI.compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,"SR4 7HA","contains") && sI.compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,"([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})","RegEx") && sI.compareElementValueForQueryFormHeaderMethodPath(keyOfParameter,possibleQueryFormHeaderMethodPath,null,"exist") &&
		sI.compareElementValueForQueryFormHeaderMethodPath('method','GET','GET',"==") 
		&& sI.compareElementValueForQueryFormHeaderMethodPath('path','/advisors/12345',"/advisors/12345","==")
		);
}

function compareElementValueInPathTest(){


	return displayResult(
		sI.compareElementValueInPath('advisor','/advisors/12345/customers/678910',"\\d{5}","RegEx") &&
		sI.compareElementValueInPath('customer','/advisors/12345/customers/678910',"678910","==")  
		);
}

function processParameterTest(){
var passed=0;
scenarioJSON.parameters.forEach(function(val){if(sI.processParameter(scenarioJSON.request,val)){passed++;}});
	return displayResult(passed==scenarioJSON.parameters.length);
}


function processParametersTest(){
return displayResult(sI.processParameters(scenarioXML.request,scenarioXML.parameters));
}

function processScenarioTest(){
return displayResult(
	sI.processScenario(scenarioJSON.request,scenarioJSON,operationJSON.response)===scenarioJSON.response 
	&& sI.processScenario(scenarioXML.request,scenarioXML,operationJSON.response)===scenarioXML.response
	);
}


function processScenariosTest(){

return displayResult(sI.processScenarios(scenarioJSON.request,operationJSON.scenarios,operationJSON.response)===scenarioJSON.response);
}

function processOperationTest(){
// console.log(sI.processOperation(scenarioJSON.request,operationXML,expectedStub.defaultResponse).body.toString()+"****>"+ scenarioJSON.response.body.toString());
// console.log(sI.processOperation(scenarioJSON.request,operationJSON,expectedStub.defaultResponse).body.toString()+"****>"+ scenarioJSON.response.body.toString());

return displayResult(
	sI.processOperation(scenarioJSON.request,operationJSON,expectedStub.defaultResponse)===scenarioJSON.response
	&& sI.processOperation(scenarioJSON.request,operationXML,expectedStub.defaultResponse)===expectedStub.defaultResponse

	);
}

function processOperationsTest(){
// console.log( sI.processOperations(scenarioJSON.request,expectedStub.operations,expectedStub.defaultResponse).body+"8888888"+scenarioJSON.response.body);
var gg={};
return displayResult(
    sI.processOperations(scenarioJSON.request,expectedStub.operations,expectedStub.defaultResponse)===scenarioJSON.response
//  && sI.processOperations(scenarioJSON.request,{},expectedStub.defaultResponse)==expectedStub.defaultResponse
//  && sI.processOperations(scenarioJSON.request,gg.a,expectedStub.defaultResponse)==expectedStub.defaultResponse
	);
}


function getDynamicValueFromRequestTest(){
  return displayResult(
      sI.getDynamicValueFromRequest(requestJSON,"QUERY1")=="QUERY1"
   && sI.getDynamicValueFromRequest(requestJSON,"$.lastName")=="doe"
   && sI.getDynamicValueFromRequest(requestXML,"/soapenv:Envelope/soapenv:Body/cli:getAccountListRequest/cli:client/iden:id")=="SR4 7HA"
    );
  }
  

// create a server object:
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
html="<p>";


/** Xpath conversion Test  **/
html+="<h3>test xpath </h3>";
html+=convertXpathTest();

/** TEST for sI.compareElementValueForXpath  **/
html+="<h3>test sI.compareElementValueForXpath</h3>";
html+=compareElementValueForXpathTest();


/** TEST for sI.compareElementValueForXpath  **/
html+="<h3>test sI.compareElementValueForJsonPath</h3>";
html+=compareElementValueForJsonPathTest();


/** TEST for sI.compareElementValueForQueryFormHeaderMethodPath  **/
html+="<h3>test sI.compareElementValueForQueryFormHeaderMethodPath</h3>";
html+=compareElementValueForQueryFormHeaderMethodPathTest();

/** TEST for sI.compareElementValueInPath  **/
html+="<h3>test sI.compareElementValueInPath</h3>";
html+=compareElementValueInPathTest();

/** TEST for processParameter  **/
html+="<h3>test processParameter</h3>";
html+=processParameterTest();


/** TEST for processParameters  **/
html+="<h3>test processParameters</h3>";
html+=processParametersTest();


/** TEST for get Dynamic value from request  **/
html+="<h3>test getDynamicValueFromRequest</h3>";
html+=getDynamicValueFromRequestTest();

/** TEST for processScenario  **/
html+="<h3>test processScenario</h3>";
html+=processScenarioTest();


/** TEST for processScenario  **/
html+="<h3>test processScenarios</h3>";
html+=processScenariosTest();

/** TEST for processOperation  **/
html+="<h3>test processOperation</h3>";
html+=processOperationTest();

/** TEST for processOperations  **/
html+="<h3>test processOperations</h3>";
html+=processOperationsTest();



  res.write(html); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
