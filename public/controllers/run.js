
function createImposter(divoutputResult){
  $.ajax({
    type: "POST",
    url: "http://<?php echo $mounteBankHost;?>:2525/imposters",
    data: JSON.stringify(jsonImposterData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
      complete: function(xhr, textStatus) {
 $("#"+divoutputResult+"").html(""); 
var Div;

if(textStatus=="error" && xhr.status==0){
Div= $("<div>",{"class":"alert callout"}).html("<b>Error: </b>" );
Div.append("<br/>Mount Bank Server Currently not Running. Please Restart the Server and try Again.  ");
}
else if( typeof xhr.responseText !== 'undefined'){

var data= JSON.parse(xhr.responseText);

if(typeof data.errors !== 'undefined') {  
Div = $("<div>",{"class":"alert callout"}).html("<b>Error: </b>" );
$(data.errors).each(function(){
Div.append("<br/>"+this.code+" <b>"+this.message+"</b> ");
});
}
else if(typeof data.stubs !== 'undefined'){
Div = $("<div>",{"class":"success callout"}).html("<b>Success: </b>" );
var html="<p>the <b>"+data.name+"</b> Stub is Implemetd ON Port:"+data.port+"<p> with following senarios : </p><p>";
$(data.stubs).each(function(){
html+="<li><a target='_blank' href='/senarios/RunScenario.php?stubKey=<?php echo $stubKey;?>&operationKey="+data.name+"&scenarioKey="+this.name+"'><b>"+this.name+"</b></a></li>";
});
html+="<br/>";
Div.append(html);
}
}else{
Div = $("<div>",{"class":"alert callout"}).html("<b>Error: Unknown Error</b>" );
}

$("#"+divoutputResult+"").html(Div);

    }
});
}



function deleteAndCreateBulkImposter(divoutputResult){
  $.ajax({
    type: "DELETE",
    url: "http://<?php echo $mounteBankHost;?>:2525/imposters/",
    // data: JSON.stringify(jsonImposterData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
      complete: function(xhr, textStatus) {
 $("#"+divoutputResult+"").html(""); 
var Div;

if(textStatus=="error" && xhr.status==0){
Div= $("<div>",{"class":"alert callout"}).html("<b>Error: </b>" );
Div.append("<br/>Mount Bank Server Currently not Running. Please Restart the Server and try Again.  ");
}
else if( typeof xhr.responseText !== 'undefined' && xhr.status==200){
  var data= JSON.parse(xhr.responseText);
  console.log(data.imposters);
if(data.imposters){

  createBulkImposters("outputResult");
}else{
  Div = $("<div>",{"class":"alert callout"}).html("<b>Error: Cant Delete the Imposters</b>" );
}
}else{
Div = $("<div>",{"class":"alert callout"}).html("<b>Error: Unknown Error</b>" );
}

$("#"+divoutputResult+"").html(Div);

    }
});
}


function deleteAndCreateImposter(divoutputResult){
  $.ajax({
    type: "DELETE",
    url: "http://<?php echo $mounteBankHost;?>:2525/imposters/"+jsonImposterData.port,
    // data: JSON.stringify(jsonImposterData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
      complete: function(xhr, textStatus) {
 $("#"+divoutputResult+"").html(""); 
var Div;

if(textStatus=="error" && xhr.status==0){
Div= $("<div>",{"class":"alert callout"}).html("<b>Error: </b>" );
Div.append("<br/>Mount Bank Server Currently not Running. Please Restart the Server and try Again.  ");
}
else if( typeof xhr.responseText !== 'undefined'){
  var data= JSON.parse(xhr.responseText);
if(data.port==jsonImposterData.port){

  createImposter("outputResult");
}else{
  Div = $("<div>",{"class":"alert callout"}).html("<b>Error: Cant Delete the Imposter</b>" );
}
}else{
Div = $("<div>",{"class":"alert callout"}).html("<b>Error: Unknown Error</b>" );
}

$("#"+divoutputResult+"").html(Div);

    }
});
}
function createIfNotExist(divoutputResult){
  $.ajax({
    type: "GET",
    url: "http://<?php echo $mounteBankHost;?>:2525/imposters/"+jsonImposterData.port,
    // data: JSON.stringify(jsonImposterData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
      complete: function(xhr, textStatus) {
 $("#"+divoutputResult+"").html(""); 
var Div;
if(textStatus=="error" && xhr.status==0){
Div= $("<div>",{"class":"alert callout"}).html("<b>Error: </b>" );
Div.append("<br/>Mount Bank Server Currently not Running. Please Restart the Server and try Again.  ");
$("#"+divoutputResult+"").html(Div);
}
else if( xhr.status==200){
deleteAndCreateImposter("outputResult");
}else{
createImposter("outputResult");
}



    }
});
}

