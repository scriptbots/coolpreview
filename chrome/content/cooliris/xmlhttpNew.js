var cooliris_xhttp={handler:null,uri:null,auxObj:null,init:function(){
var _1;
if(!_1&&typeof XMLHttpRequest!="undefined"){
try{
_1=new XMLHttpRequest();
}
catch(e){
_1=false;
}
}
return _1;
},doAsyncPost:function(_2,_3,_4,_5){
try{
var _6=new cpvw_WebResponse(0,"");
var _7=_4,_8=_5;
var _9=this.init();
if(_4==null){
_7=this.handler;
}
if(_5==null){
_8=this.uri;
}
if(_9==false){
throw "Error initializing the object";
}
_9.open("POST",_8+"?"+_3,true);
_9.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
_9.setRequestHeader("cookie"," ");
_9.onreadystatechange=function(){
if(_9.readyState!=4){
return;
}
if(_9.status==200){
if(_7!=null){
var _a=_9.responseText;
_6.auxObj=_a;
_7(_6);
}
}else{
throw "Error occurred while retrieving from the server!";
}
};
_9.send(_2);
}
catch(ex){
return new cpvw_WebResponse(1,ex);
}
delete _9;
return _6;
},doAsyncGet:function(_b,_c,_d){
try{
var _e=new cpvw_WebResponse(0,"");
var _f=_c,_10=_d;
var _11=this.init();
if(_c==null){
_f=this.handler;
}
if(_d==null){
_10=this.uri;
}
if(_11==false){
throw "Error initializing the object";
}
if(_b!=""){
_10+="?"+_b;
}
_11.open("GET",_10,true);
_11.onreadystatechange=function(){
if(_11.readyState!=4){
return;
}
if(_11.status==200){
if(_f!=null){
var _12=_11.responseText;
_e.auxObj=_12;
_f(_e);
}
}else{
throw "Error occurred while retrieving from the server!";
}
};
_11.send(null);
}
catch(ex){
return new cpvw_WebResponse(1,ex);
}
delete _11;
return _e;
},doAsyncGetXml:function(_13,_14,uri){
try{
var _16=new cpvw_WebResponse(0,"");
var _17=_14,_18=uri;
var _19=this.init();
if(_14==null){
_17=this.handler;
}
if(uri==null){
_18=this.uri;
}
if(_19==false){
throw "Error initializing the object";
}
if(_13!=""){
_18+="?"+_13;
}
_19.open("GET",_18,true);
_19.onreadystatechange=function(){
if(_19.readyState!=4){
return;
}
if(_19.status&&_19.status==200){
if(_17!=null){
var xml=_19.responseXML;
_16.auxObj=xml;
_17(_16);
}
}else{
throw "Error occurred while retrieving from the server!";
}
};
_19.send(null);
}
catch(ex){
return new cpvw_WebResponse(1,ex);
}
delete _19;
return _16;
},doSyncGetText:function(_1b,uri){
try{
var _1d=new cpvw_WebResponse(0,"");
var _1e=uri,_1f=null;
var _20=this.init();
if(uri==null){
_1e=this.uri;
}
if(_20==false){
throw "Error initializing the object";
}
if(_1b!=""){
_1e+="?"+_1b;
}
_20.open("GET",_1e,false);
_20.send(null);
if(_20.status==200){
_1d.auxObj=_20.responseText;
_1d.headers=_20.getAllResponseHeaders();
}else{
throw _20.statusText+" "+_1e+" Error occurred while retrieving from the server!";
}
}
catch(ex){
myDump1("ERROR :: "+ex);
return new cpvw_WebResponse(1,ex);
}
delete _20;
return _1d;
},doSyncGet:function(_21,uri){
try{
var _23=new cpvw_WebResponse(0,"");
var _24=uri,_25=null;
var _26=this.init();
if(uri==null){
_24=this.uri;
}
if(_26==false){
throw "Error initializing the object";
}
if(_21!=""){
_24+="?"+_21;
}
_26.open("GET",_24,false);
_26.send(null);
if(_26.status==200){
_23.auxObj=_26.responseText;
_23.headers=_26.getAllResponseHeaders();
}else{
throw _26.statusText+" "+_24+" Error occurred while retrieving from the server!";
}
}
catch(ex){
myDump1("ERROR :: "+ex);
alert(ex);
return new cpvw_WebResponse(1,ex);
}
delete _26;
return _23;
},doSyncGetXml:function(_27,uri){
try{
var _29=new cpvw_WebResponse(0,"");
var _2a=uri,_2b=null;
var _2c=this.init();
if(uri==null){
_2a=this.uri;
}
if(_2c==false){
throw "Error initializing the object";
}
if(_27!=""){
_2a+="?"+_27;
}
_2c.open("GET",_2a,false);
_2c.send(null);
if(_2c.status==200){
_29.auxObj=_2c.responseXML;
_29.headers=_2c.getAllResponseHeaders();
}else{
throw _2c.statusText+" "+_2a+" Error occurred while retrieving from the server!";
}
}
catch(ex){
myDump1("ERROR :: "+ex);
alert(ex);
return new cpvw_WebResponse(1,ex);
}
delete _2c;
return _29;
},doSyncPost:function(_2d,_2e,uri){
try{
var _30=new cpvw_WebResponse(0,"");
var _31=uri,_32=null;
var _33=this.init();
if(uri==null){
_31=this.uri;
}
if(_33==false){
throw "Error initializing the object";
}
if(_2e!=""){
_31+="?"+_2e;
}
_33.open("POST",_31,false);
_33.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
_33.setRequestHeader("Content-Length",_2d.length);
_33.send(_2d);
if(_33.status==200){
_30.headers=_33.getAllResponseHeaders();
_30.auxObj=_33.responseText;
}else{
throw _33.statusText+" "+_31+" Error occurred while retrieving from the server!";
}
}
catch(ex){
return new cpvw_WebResponse(1,ex);
}
delete _33;
return _30;
}};

