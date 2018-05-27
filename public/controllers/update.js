var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('AppCtrl',  function($scope, $http,$anchorScroll) {

	$scope.init = function(pageData) {
	
    
     pageData=JSON.parse(pageData);

   $scope.pageType = pageData.pageType;
   $scope.hrefPath = pageData.hrefPath;
	 $scope.back = pageData.back;
	 $scope[pageData.pageType+"Id"] = pageData[pageData.pageType+"Id"];
	 $scope[pageData.pageType+"Id"] = pageData[pageData.pageType+"Id"];
	 $scope[pageData.pageType+"Id"] = pageData[pageData.pageType+"Id"];
     // console.log(pageData.hrefPath);

if($scope[pageData.pageType+"Id"]){
       $http.get("/data/"+$scope.hrefPath)
    .then(function(response) {
        $scope.page = processpageData(response.data);

    });
}else{
	$scope.page={"parameters":[]};

}
    
}


  $scope.delete = function() {
if($scope[$scope.pageType+"Id"]){
		$http.delete("/data/"+$scope.hrefPath)
		.then(function(response) {
			// console.log(JSON.stringify(response.data));
				if(response.data.status==true){
					$scope.systemErrorMessage=false;
				 window.location.href = $scope.back;
		}else{

    		$scope.systemErrorMessage=true;
    		console.log("failure");
    	}
		});
}
  };
    
  $scope.copy = function() {
  	$scope[$scope.pageType+"Id"]=false;
   $scope.page.name=$scope.page.name+"-Copy";
   $scope.validateAndSubmit($scope);
  };
    

  $scope.addNewParameter = function() {
   $scope.page.parameters.push({"key":"","in":"","comparator":"","val":""});
  };
    
  $scope.removeParameter = function(i) {
    $scope.page.parameters.splice(i,1);
  };
    $scope.validateAndSubmit= function() {
    	 $anchorScroll();
    	if(validateScope()){
    			var sendData=$scope.page;
    			var sendParameters=[];
    			if(isNotEmpty(sendData.parameters)){
    					sendData.parameters.forEach(function(val){
    							 sendParameters.push({"key":val.key,"in":val.in,"comparator":val.comparator,"val":val.val});
    					});

    						}
		sendData.parameters=sendParameters;

    	if(isNotEmpty(sendData.request)){
    	    		if(isNotEmpty(sendData.request.path))
    	    			 sendData.parameters.push({"key":"PATH","in":"completePath","comparator":"contains","val":sendData.request.path});
    	    		if( isNotEmpty(sendData.request.method))
    	    			 sendData.parameters.push({"key":"METHOD","in":"method","comparator":"==","val":sendData.request.method});
	if(isNotEmpty(sendData.request.headers)){
    	    		if( isNotEmpty(sendData.request.headers['Content-Type']))
    	    			 sendData.parameters.push({"key":"Content-Type","in":"headers","comparator":"contains","val":sendData.request.headers['Content-Type']});}
    	    		}
    	    		// console.log(sendData);
   	if(isNotEmpty(sendData.response)){
    	    		if(isNotEmpty(sendData.response.body))
sendData.response.body=(isValidJSONString(sendData.response.body))?JSON.parse(sendData.response.body):sendData.response.body;
    	    	}


if($scope[$scope.pageType+"Id"]){
	   sendData.id=$scope[$scope.pageType+"Id"];
	 // alert("Updating");
		$http.patch("/data/"+$scope.hrefPath,JSON.stringify(sendData))
		.then(function(response) {
				if(response.data.status==true){
		$scope.updatedMessage=true;
		$scope.validationErrorMessage=false;
		$scope.systemErrorMessage=false;
		
		}else{

    		$scope.systemErrorMessage=true;
    		$scope.validationErrorMessage=false;
    		console.log("failure");
    	}
$scope.page = processpageData($scope.page);
		});
}else{
	sendData.id=guid();
	 // alert("Creating /data/"+$scope.back.replace("/system/",""));
			$http.post("/data/"+$scope.back.replace("/system/",""),JSON.stringify(sendData))
		.then(function(response) {
			// console.log(JSON.stringify(response.data));
		if(response.data.status==true){

		$scope.createdMessage=true;
		$scope.systemErrorMessage=false;
		$scope.validationErrorMessage=false;
		alert("Successfully Created "+ $scope.pageType);
	 if($scope.pageType=="root")window.location.href = "/"+$scope.pageType+"/"+$scope.back.replace("/root/","");
	 else window.location.href = "/"+$scope.pageType+"/"+$scope.back.replace("/system/","")+sendData.id;
		}else{
			$scope.validationErrorMessage=false;
    		$scope.systemErrorMessage=true;
    		console.log("failure"+JSON.stringify(sendData));
    	}
$scope.page = processpageData($scope.page);
		});

}

    	}else{

    		$scope.validationErrorMessage=true;
    		console.log("failure");
    	}
  };



function processpageData(processablePageData){
	try{

	// console.log( isNotEmpty(processablePageData.parameters) && (processablePageData.parameters.length>0));
	if(isNotEmpty(processablePageData.parameters) && (processablePageData.parameters.length>0)){
console.log(processablePageData.response.body);
	var parametersData=[];
	var requestContentType;
	var requestPath;
	var requestMethod;
		processablePageData.parameters.forEach(function(val){
			if(val.in=="completePath"){
			requestPath=val.val;
			}else if(val.in=="method"){
			requestMethod=val.val;
			}else if(val.key=="Content-Type" && val.in=="headers"){
			requestContentType=val.val;
			}else{
				 parametersData.push(val);
			}
		});

		processablePageData.parameters=parametersData;
		processablePageData["request"]={"path":requestPath,"headers":{'Content-Type':requestContentType},"method":requestMethod};


		console.log( processablePageData.parameters );

	}else{

		if(!isNotEmpty(processablePageData.response) && isNotEmpty(processablePageData.defaultResponse)){
				// processablePageData.defaultResponse.body=JSON.stringify(processablePageData.defaultResponse.body);
					processablePageData.response=processablePageData.defaultResponse;
				}
		// console.log( processablePageData );
	}
// console.log( 	processablePageData.response.body  + ( typeof processablePageData.response.body=="object"));
	processablePageData.response.body=( typeof processablePageData.response.body=="object")?JSON.stringify(processablePageData.response.body):processablePageData.response.body;
		return processablePageData;

}catch(error){

	console.log(error);
return processablePageData;
}

}

function validateScope(){
	 var parameters = document.querySelectorAll('input[ng-model="parameter.key"][mandatory]');
	 var inputElements = document.querySelectorAll('input[ng-model][mandatory],select[ng-model][mandatory]');
	 var responseBodyElement = document.querySelector('textarea[ng-model="$parent.page.response.body"][mandatory]');

var passed=0;
if(isNotEmpty(inputElements)){
	 		if( inputElementsNotEmpty(inputElements)) 
	 			passed++
	 	}
if(isNotEmpty(parameters) && isNotEmpty($scope.page.request)){
	 	if(isNotEmpty($scope.page.request.headers)) {
	 			if(validateAllParametersKeys(parameters,$scope.page.request.headers['Content-Type'])) 
	 				passed++;
	 		}else{
	 			passed++;
	 		}
	 	}else{
	 		passed++;
	 	}

 if(isNotEmpty($scope.page.response) && isNotEmpty(responseBodyElement)){
	 	if(isNotEmpty($scope.page.response.body) && isNotEmpty($scope.page.response.headers['Content-Type'])  ) {
	 			if(isValidResponseBody(responseBodyElement,$scope.page.response.body,$scope.page.response.headers['Content-Type'])) 
	 				passed++;
	 		}else{
	 			passed++;
	 		}
	 	}else{
	 		passed++;
	 	}




  return(passed==3);
}




});﻿