var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('AppCtrl',  function($scope, $http, $route, $routeParams, $location) {
  
    $scope.displayTab=function(section){
        $http.get("/list/"+$scope.hrefPath)
        .then(function(response) {
            var data=response.data;
        var list={};
        var tabs=[];
        for(var element in data) { 
           if(data[element]["tag"]==section)
            list[element]=data[element]["name"];
            if( typeof data[element]["tag"] !== 'undefined' && data[element]["tag"] && !tabs.includes(data[element]["tag"]) )
            tabs.push(data[element]["tag"]);            
        };
        $scope.list = list;
        $scope.tabs = tabs;
        $scope.selected = section;
    });
    }
    $scope.isSelected = function(section) {
        return $scope.selected === section;
    }
	$scope.init = function(page) {
	
    
     page=JSON.parse(page)
   $scope.hrefPath = (page.hrefPath=="/")?"":page.hrefPath.replace(/\/\//g, '/');
	 $scope.back = page.back;
	 $scope.pageType = page.pageType;
  

          $http.get("/list/"+$scope.hrefPath)
    .then(function(response) {
        var data=response.data;
        var list={};
        var tabs=[];
        for(var element in data) { 
            list[element]=( typeof data[element]["name"] !== 'undefined' && data[element]["name"] )?data[element]["name"]:data[element];
            if( typeof data[element]["tag"] !== 'undefined' && data[element]["tag"] && !tabs.includes(data[element]["tag"]) )
            tabs.push(data[element]["tag"]);            
        };
        $scope.list = list;
        $scope.tabs = tabs;
        if( tabs[0] !== 'undefined' && tabs[0] )$scope.displayTab(tabs[0]);
    });
}

    

});﻿