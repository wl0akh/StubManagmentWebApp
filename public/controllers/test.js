var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('AppCtrl',  function($scope, $http,$location,$anchorScroll) {

	$scope.init = function(port) {
	
   $scope.path ="http://localhost:"+port;
}

$scope.run= function(){
  var reqData = {
    method: $scope.method,
    url: $scope.path,
    headers: {
      'Content-Type': $scope.requestContentType,
    },
    data: $scope.requestBody
   };

   var  req={
    method: "POST",
    url: "/testStubDataProcessing",
    data: reqData
   };
   
   
$http(req).then(function onSuccess(response) {
  $location.hash("bottom");
      $anchorScroll();
  console.log(JSON.stringify(response));
$scope.output = response.data;
$scope.outputCode = response.status;
  }).catch(function onError(response) {
    $location.hash("bottom");
      $anchorScroll();
    console.log("000");
    console.log(JSON.stringify(response));
$scope.output = (response.data)?response.data:"Not Supported By Your Browser Please use Postman";
$scope.outputCode = response.status;
  });





}

    

});﻿