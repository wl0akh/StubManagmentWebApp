var express = require('express');
var request = require("request")
var sM=require("./stubManagment.js");
var app = express();
var path = require('path');

var bodyParser = require('body-parser');

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/system/', function(req, res){
	var page={
			pageType:"root",
		back:"",
	hrefPath:"/"
};
	var pageStrinfitied=JSON.stringify(page);
res.render('listing', {pageData:page,strinfiedPage:pageStrinfitied});
});

app.get('/list/', function(req, res){
res.json(sM.getRoots());
});


app.get('/system/:rootId', function(req, res){
var page={
		pageType:"stub",
back:"/system/",
hrefPath:""+req.params.rootId+"/"
};
	var pageStrinfitied=JSON.stringify(page);
res.render('listing', {pageData:page,strinfiedPage:pageStrinfitied});
});



app.get('/list/:rootId', function(req, res){
res.json(sM.getStubs(req.params.rootId));
});


app.get('/system/:rootId/:stubId', function(req, res){
var page={
	pageType:"operation",
back:"/system/"+req.params.rootId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/"
};
var pageStrinfitied=JSON.stringify(page);
res.render('listing', {pageData:page,strinfiedPage:pageStrinfitied});
});



app.get('/list/:rootId/:stubId', function(req, res){
res.json(sM.getListOfOperationsOrScenarios(sM.getStub(req.params.rootId,req.params.stubId)['operations']));
});

app.get('/system/:rootId/:stubId/:operationId', function(req, res){
var page={
		pageType:"scenario",
back:"/system/"+req.params.rootId+"/"+req.params.stubId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/"
};
var pageStrinfitied=JSON.stringify(page);
res.render('listing', {pageData:page,strinfiedPage:pageStrinfitied});

});


app.get('/list/:rootId/:stubId/:operationId', function(req, res){
res.json(sM.getListOfOperationsOrScenarios(sM.getStub(req.params.rootId,req.params.stubId)['operations'][req.params.operationId]['scenarios']));
});


/*****
UPDATE Scenario
*******/

app.get('/scenario/:rootId/:stubId/:operationId/:scenarioId', function(req, res){
var page={
		pageType:"scenario",
		rootId:req.params.rootId,
	stubId:req.params.stubId,
	operationId:req.params.operationId,
	scenarioId:req.params.scenarioId,
back:"/system/"+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/"+req.params.scenarioId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.get('/data/:rootId/:stubId/:operationId/:scenarioId', function(req, res){
res.json(sM.getStub(req.params.rootId,req.params.stubId)['operations'][req.params.operationId]['scenarios'][req.params.scenarioId]);
});
app.delete('/data/:rootId/:stubId/:operationId/:scenarioId', function(req, res){
	var result=false;
	try{
		result=sM.deleteScenario(req.params.rootId, req.params.stubId,req.params.operationId,req.params.scenarioId);
		}catch(error){
		result=false;
	}
res.json({"status":result});
});
app.patch('/data/:rootId/:stubId/:operationId/:scenarioId', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateScenario(req.params.rootId, req.params.stubId,req.params.operationId,req.params.scenarioId,req.body.name,req.body.request,req.body.response,req.body.parameters,req.body.tag);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});

/*****
ADD SCENARIO
*******/
app.get('/scenario/:rootId/:stubId/:operationId', function(req, res){
var page={
	pageType:"scenario",
		rootId:req.params.rootId,
	stubId:req.params.stubId,
	operationId:req.params.operationId,
back:"/system/"+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.post('/data/:rootId/:stubId/:operationId/', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateScenario(req.params.rootId, req.params.stubId,req.params.operationId,req.body.id,req.body.name,req.body.request,req.body.response,req.body.parameters,req.body.tag);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});






/*****
UPDATE Operation
*******/

app.get('/operation/:rootId/:stubId/:operationId', function(req, res){
var page={
		pageType:"operation",
		rootId:req.params.rootId,
	stubId:req.params.stubId,
	operationId:req.params.operationId,
back:"/system/"+req.params.rootId+"/"+req.params.stubId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/"+req.params.operationId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.get('/data/:rootId/:stubId/:operationId', function(req, res){0
var stub =sM.getStub(req.params.rootId,req.params.stubId);
res.json(stub['operations'][req.params.operationId]);
});
app.delete('/data/:rootId/:stubId/:operationId', function(req, res){
	var result=false;
	try{
		result=sM.deleteOperation(req.params.rootId, req.params.stubId,req.params.operationId);
		}catch(error){
		result=false;
	}
res.json({"status":result});
});
app.patch('/data/:rootId/:stubId/:operationId', function(req, res){
	var result=false;
	try{

		result=sM.createUpdateOperation(req.params.rootId, req.params.stubId,req.params.operationId,req.body.name,req.body.response,req.body.parameters);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});

/*****
ADD OPERATION
*******/
app.get('/operation/:rootId/:stubId', function(req, res){
var page={
	pageType:"operation",
		rootId:req.params.rootId,
	stubId:req.params.stubId,
back:"/system/"+req.params.rootId+"/"+req.params.stubId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.post('/data/:rootId/:stubId/', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateOperation(req.params.rootId, req.params.stubId,req.body.id,req.body.name,req.body.response,req.body.parameters);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});








/*****
UPDATE Stub
*******/

app.get('/stub/:rootId/:stubId', function(req, res){
var page={
		pageType:"stub",
		rootId:req.params.rootId,
	stubId:req.params.stubId,
back:"/system/"+req.params.rootId+"/",
hrefPath:""+req.params.rootId+"/"+req.params.stubId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.get('/data/:rootId/:stubId', function(req, res){
res.json(sM.getStub(req.params.rootId,req.params.stubId));
});
app.delete('/data/:rootId/:stubId', function(req, res){
	var result=false;
	try{
		result=sM.deleteStub(req.params.rootId, req.params.stubId);
		}catch(error){
		result=false;
	}
res.json({"status":result});
});
app.patch('/data/:rootId/:stubId', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateStub(req.params.rootId, req.params.stubId,req.body.name,req.body.protocol,req.body.port,req.body.response);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});

/*****
ADD STUB
*******/
app.get('/stub/:rootId', function(req, res){
var page={
	pageType:"stub",
		rootId:req.params.rootId,
back:"/system/"+req.params.rootId+"/",
hrefPath:""+req.params.rootId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.post('/data/:rootId/', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateStub(req.params.rootId, req.body.id,req.body.name,req.body.protocol,req.body.port,req.body.response);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});









/*****
UPDATE root
*******/

app.get('/root/:rootId', function(req, res){
var page={
		pageType:"root",
		rootId:req.params.rootId,
back:"/system/",
hrefPath:""+req.params.rootId+"/",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.get('/data/:rootId', function(req, res){
res.json(sM.getRoot(req.params.rootId));
});
app.delete('/data/:rootId', function(req, res){
	var result=false;
	try{
		result=sM.deleteRoot(req.params.rootId);
		}catch(error){
		result=false;
	}
res.json({"status":result});
});
app.patch('/data/:rootId', function(req, res){
	var result=false;
	try{
		result=sM.createUpdateRoot(req.params.rootId,req.body.name,req.body.description);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});

/*****
ADD ROOT
*******/
app.get('/root', function(req, res){
var page={
	pageType:"root",
		rootId:req.params.rootId,
back:"/system/",
hrefPath:"",
};
var pageStrinfitied=JSON.stringify(page);
res.render('update', {pageData:page,strinfiedPage:pageStrinfitied});
});
app.post('/data/', function(req, res){
	var result=false;
	try{
				result=sM.createUpdateRoot(req.body.id,req.body.name,req.body.description);
	}catch(error){
		result=false;
	}
res.json({"status":result});
});















/*****
Download all
*******/
app.get('/download', function(req, res){
	var imposters=[];
	try{
	for(var rootId in sM.getRoots())  { 
	for(var stubId in sM.getStubs(rootId)){
		imposters.push(sM.getStub(rootId,stubId));
			}
	 }
}catch(error){
	console.log(error);
imposters=[];
}
res.setHeader('Content-Type', "application/json");
res.setHeader('Content-disposition','attachment; filename=imposters.json');
res.json({"imposters":imposters})
});


/*****
Download all stubs of root
*******/
app.get('/download/:rootId', function(req, res){
	var imposters=[];
	try{
	for(var stubId in sM.getStubs(req.params.rootId)){
		imposters.push(sM.getStub(req.params.rootId,stubId));
			}
}catch(error){
	console.log(error);
imposters=[];
}
res.setHeader('Content-Type', "application/json");
res.setHeader('Content-disposition','attachment; filename=imposters.json');
res.json({"imposters":imposters})
});



/*****
Download single stubs 
*******/
app.get('/download/:rootId/:stubId', function(req, res){
	var stubEJS={};
try{
		stubEJS=(sM.getStub(req.params.rootId,req.params.stubId));
}catch(error){
	console.log(error);
stubEJS={};
}
res.setHeader('Content-Type', "application/json");
res.setHeader('Content-disposition','attachment; filename=stub.ejs');
res.json({"imposters":stubEJS})
});














/*****
RUN all
*******/
app.get('/run', function(req, res){
	var imposters=[];
	try{
	for(var rootId in sM.getRoots())  { 
	for(var stubId in sM.getStubs(rootId)){
		imposters.push(sM.getStub(rootId,stubId));
			}
	 }
}catch(error){
	console.log(error);
imposters=[];
}
var dataJSON=JSON.stringify(imposters);
res.render('run', {href:"",single:false});
});


/*****
RUN all stubs of root
*******/
app.get('/run/:rootId', function(req, res){
	var imposters=[];
	try{
	for(var stubId in sM.getStubs(req.params.rootId)){
		imposters.push(sM.getStub(req.params.rootId,stubId));
			}
}catch(error){
	console.log(error);
imposters=[];
}
var dataJSON=JSON.stringify(imposters);
res.render('run', {href:""+req.params.rootId,single:false});
});



/*****
RUN single stubs 
*******/
app.get('/run/:rootId/:stubId', function(req, res){
	var stubEJS={};
try{
		stubEJS=(sM.getStub(req.params.rootId,req.params.stubId));
}catch(error){
	console.log(error);
stubEJS={};
}
var dataJSON=JSON.stringify(stubEJS);
res.render('run', {href:""+req.params.rootId+"/"+req.params.stubId,single:true});
});


/*****
GET data to RUN all
*******/
app.get('/getData', function(req, res){
	var imposters=[];
	try{
	for(var rootId in sM.getRoots())  { 
	for(var stubId in sM.getStubs(rootId)){
		console.log(sM.getStub(rootId,stubId)+","+rootId+","+stubId);
		imposters.push(sM.getStub(rootId,stubId));
			}
	 }
}catch(error){
	console.log(error);
imposters=[];
}
res.json({imposters});
});


/*****
GET data to RUN all stubs of root
*******/
app.get('/getData/:rootId', function(req, res){
	var imposters=[];
	try{
	for(var stubId in sM.getStubs(req.params.rootId)){
		imposters.push(sM.getStub(req.params.rootId,stubId));
			}
}catch(error){
	console.log(error);
imposters=[];
}
res.json({imposters});
});



/*****
GET data to RUN single stubs 
*******/
app.get('/getData/:rootId/:stubId', function(req, res){
	var stubEJS={};
try{
		stubEJS=(sM.getStub(req.params.rootId,req.params.stubId));
}catch(error){
	console.log(error);
stubEJS={};
}
res.json(stubEJS);
});


/*****
Test  stub
*******/
app.get('/testStub/:port', function(req, res){
res.render('testStub', {port:req.params.port});
});


/*****
Test  stub  Data Processing 
*******/
app.post('/testStubDataProcessing', function(req, res){

// Send request
request({
    url: req.body.url,
    method: req.body.method,
    headers: req.body.headers,
 body: req.body.data
    }, function (error, response, body) {
			console.log("error: " + error);
			res.status(response.statusCode).send((response.body));	
})



	});

	
/***** 
	/
*******/

app.all('*', function(req, res) {
  res.redirect("/system/");
});


app.listen(3000);