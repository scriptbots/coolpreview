var cpvw_stackManager={hasStack:false,tabStackCount:0,stackMode:"icon",maxWidth:100,arrCanvas:new Array,arrHidFrames:new Array,_stackHeight:225,stackShowTimer:null,stackHideTimer:null,isLocked:false,canvasTimeStamp:-1,prevUrl:"",resizeStack:false,previewMouseOver:false,stackHeight:function(){
return this._stackHeight;
},setStackHeight:function(_1){
this._stackHeight=_1;
},objBrowser:function(){
return cpvw_get("browser").boxObject;
},currentTab:function(){
return getBrowser().selectedTab;
},displayStack:function(_2){
if(_2){
if(!cpvw_stackManager.isLocked){
cpvw_stackManager.stackMode="icon";
}
}
cpvw_get("cooliris_stackIcon").hidden=true;
cpvw_get("cooliris_canvasHolder").hidden=true;
conDump("----------------------"+cpvw_stackManager.stackMode);
cpvw_stackManager.tabStackCount=this.arrCanvas.length;
if(cpvw_stackManager.tabStackCount>0){
setTimeout(function(){
if(cpvw_stackManager.stackMode=="icon"){
cpvw_stackManager.showStackIcon();
}
if(cpvw_stackManager.stackMode=="stack"){
cpvw_stackManager.openStack();
}
},100);
}else{
if(cpvw_stackManager.tabStackCount==0){
getBrowser().selectedTab.removeAttribute("coolirispreviews_dispStack");
cpvw_get("cooliris_canvasHolder").hidden=true;
cpvw_get("cooliris_stackIcon").hidden=true;
}
}
for(var i=0;i<this.arrCanvas.length;i++){
this.arrCanvas[i].style.display="block";
}
},openStack:function(){
if(cpvw_stackManager.hWebControl){
cpvw_stackManager.hWebControl.stop=true;
}
cpvw_get("cooliris_stackIcon").hidden=false;
cpvw_get("cooliris_canvasHolder").hidden=false;
var _4=new cooliris_wc_Point(cpvw_stackManager.objBrowser().width-19,cpvw_stackManager.objBrowser().y+50);
var _5=new cooliris_wc_Dim(100,100);
var _6;
if(!cpvw_stackManager.resizeStack){
_6=150;
_6+=(cpvw_stackManager.tabStackCount-1)*(cpvw_stackManager.maxWidth+20);
if(_6<225){
_6=227;
}
}else{
_6=cpvw_stackManager.stackHeight();
}
if(cpvw_get("cooliris_canvasHolder").boxObject.y+_6>cpvw_stackManager.objBrowser().y+cpvw_stackManager.objBrowser().height-20){
_6=cpvw_stackManager.objBrowser().y+cpvw_stackManager.objBrowser().height-20-cpvw_get("cooliris_canvasHolder").boxObject.y;
}
cpvw_stackManager.setStackHeight(_6);
if(cpvw_get("cooliris_canvasHolder_stack")){
cpvw_get("cooliris_canvasHolder_stack").style.height=1+"px";
}
cpvw_get("cooliris_cHolder").style.maxHeight=(_6-25)+"px";
if(cpvw_stackManager.isLocked){
if(cpvw_stackManager.stackHideTimer){
clearTimeout(cpvw_stackManager.stackHideTimer);
cpvw_stackManager.stackHideTimer=null;
}
cpvw_get("cooliris_stackIcon").hidden=false;
cpvw_get("cooliris_canvasHolder").hidden=false;
_4=new cooliris_wc_Point(cpvw_stackManager.objBrowser().width-118,cpvw_stackManager.objBrowser().y+30);
_5=new cooliris_wc_Dim(118,cpvw_stackManager.stackHeight());
}
getBrowser().selectedTab.setAttribute("coolirispreviews_dispStack","show");
var _7=118;
if(getBrowser().mCurrentBrowser.contentWindow.scrollMaxY!=0){
_7=136;
}
cpvw_stackManager.sWebControl=new cooliris_wc_clsWebControl(cpvw_get("cooliris_canvasHolder"),_4,new cooliris_wc_Point(cpvw_stackManager.objBrowser().width-_7,cpvw_stackManager.objBrowser().y+30),"magnifystack");
cpvw_stackManager.sWebControl.setDim(_5,new cooliris_wc_Dim(118,cpvw_stackManager.stackHeight()));
cpvw_stackManager.sWebControl.maxTimes=30;
cpvw_stackManager.sWebControl.callback=function(_8){
if(_8<cpvw_stackManager.sWebControl.maxTimes/2){
cpvw_get("cooliris_stackTabIcon").hidden=true;
cpvw_get("cooliris_stackTabShow").hidden=false;
cpvw_get("cooliris-stackresize").hidden=false;
cpvw_get("cooliris-stackresize").style.top=(cpvw_get("cooliris_canvasHolder").boxObject.y+cpvw_get("cooliris_canvasHolder").boxObject.height-5)+"px";
cpvw_get("cooliris-stackresize").style.left=cpvw_get("cooliris_canvasHolder").boxObject.x+"px";
}
if(cpvw_get("cooliris_canvasHolder_stack")){
cpvw_get("cooliris_canvasHolder_stack").style.height=(cpvw_get("cooliris_canvasHolder").boxObject.height-1)+"px";
}
cpvw_get("cooliris_cHolder").hidden=false;
cpvw_stackManager.setStackPos(cpvw_get("cooliris_canvasHolder").boxObject.x-19,cpvw_stackManager.objBrowser().y+50,-1,-1);
cpvw_stackManager.previewMouseOver=false;
if(cpvw_get("cooliris-preview-overlay").boxObject.x+cpvw_get("cooliris-preview-overlay").boxObject.width>cpvw_get("cooliris_canvasHolder").boxObject.x-19){
cpvw_previewHandler.changeDimensions(cpvw_get("cooliris-preview-overlay").boxObject.x,cpvw_get("cooliris-preview-overlay").boxObject.y,cpvw_get("cooliris_canvasHolder").boxObject.x-21,cpvw_get("cooliris-preview-overlay").boxObject.height,true);
}
};
setTimeout(function(){
cpvw_stackManager.sWebControl.magnifyStack();
},0);
},addToStack:function(_9,_a,_b){
this.hasStack=true;
var _c=this.maxWidth;
var _d=(cpvw_stackManager.objBrowser().height-60)/_c;
var _e=(new Date()).getTime();
if(_9==null){
var _f=document.createElement("iframe");
_f.setAttribute("src",_a);
_f.setAttribute("style","width:800px;height:800px");
_f.setAttribute("id","cooliris_stackIframe"+_e);
cpvw_get("cooliris_hidFrames").appendChild(_f);
var _10=function(evt){
var _12=this;
_f.removeEventListener("load",_10,true);
setTimeout(function(){
cpvw_stackManager.addToStack(_12.contentWindow,_12.getAttribute("src"),_12);
},100);
};
_f.addEventListener("load",_10,true);
return;
}
var _13,_14;
if(_9.innerWidth<100){
_13=_9.innerWidth+_9.scrollMaxX;
_14=_9.innerHeight+_9.scrollMaxY;
}else{
_13=_9.innerWidth;
_14=_9.innerHeight;
}
var _15,_16;
if(_13>_14){
_15=_c;
_16=Math.ceil(_c*_14/_13);
}else{
_15=Math.ceil(_c*_13/_14);
_16=_c;
}
cpvw_stackManager.prevUrl=_a;
var _17=document.getElementById("cooliris_canvas");
var _18=_17.cloneNode(true);
var _e=(new Date()).getTime();
_18.setAttribute("id","coolirispreviews_"+_e);
_18.setAttribute("url",_a);
_18.setAttribute("canvasTimeStamp",_e);
_18.setAttribute("hidden",false);
_18.setAttribute("class","cooliris-stack-element");
cpvw_stackManager.arrCanvas.push(_18);
_18.addEventListener("click",function(evt){
var _1a=this.getAttribute("url");
if(!cpvw_docHandler.isShowingPreview){
cpvw_docHandler.openDelayTime=100;
cpvw_docHandler.dispDelayTime=500;
cpvw_docHandler.screenX=document.getElementById("appcontent").boxObject.width-10;
cpvw_docHandler.initPreviewShow(evt,_1a,null,true);
}else{
cpvw_docHandler.initPreviewShow(evt,_1a,null,true);
}
},true);
if(this.stackMode=="icon"){
cpvw_get("cooliris_stackIcon").hidden=true;
cpvw_get("cooliris_canvasHolder").hidden=false;
cpvw_get("cooliris_cHolder").hidden=false;
cpvw_get("cooliris_canvasHolder").style.top=(cpvw_stackManager.objBrowser().y+50)+"px";
cpvw_get("cooliris_canvasHolder").style.left=(cpvw_stackManager.objBrowser().width+50)+"px";
cpvw_get("cooliris_canvasHolder").style.width="0px";
cpvw_get("cooliris_canvasHolder").style.height="0px";
}
cpvw_get("cooliris_cHolder").appendChild(_18);
_18.width=_15;
_18.height=_16;
var ctx=_18.getContext("2d");
ctx.save();
ctx.scale(_15/_13,_16/_14);
ctx.drawWindow(_9,0,0,_13,_14,"rgb(255,255,255)");
ctx.restore();
var _1c=_18.cloneNode(true);
var _1d=_1c.getContext("2d");
_1d.save();
_1d.scale(_15/_13,_16/_14);
_1d.drawWindow(_9,0,0,_13,_14,"rgb(255,255,255)");
_1d.restore();
cpvw_get("cooliris_animFrame_stack").appendChild(_1c);
cpvw_previewHandler.hidePreview(true);
if(cpvw_previewHandler.dimPreview!=null){
var _1e=new cooliris_wc_Point(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top);
}else{
var _1e=new cooliris_wc_Point(250,250);
}
cpvw_get("cooliris_animFrame").style.display="block";
var _1f=new cooliris_wc_clsWebControl(cpvw_get("cooliris_animFrame"),_1e,new cooliris_wc_Point(cpvw_get("cooliris_canvasHolder").boxObject.x,cpvw_get("cooliris_canvasHolder").boxObject.y),"magnify");
_1f.setDim(new cooliris_wc_Dim(_15,_16),new cooliris_wc_Dim(_15,_16));
_1f.callback=function(_20){
if(_20==0){
if(cpvw_stackManager.stackMode=="icon"){
cpvw_get("cooliris_canvasHolder").hidden=true;
}
cpvw_get("cooliris_animFrame_stack").removeChild(_1c);
cpvw_get("cooliris_animFrame").style.display="none";
if(_b!=null){
cpvw_get("cooliris_hidFrames").removeChild(_b);
}
}
};
_1f.maxTimes=30;
setTimeout(function(){
_1f.magnifyStack();
},0);
conDump("add to stack");
this.tabStackCount++;
cpvw_objStats.incrementStackCounter();
if(this.stackMode=="icon"){
this.showStackIcon();
}else{
this.displayStack();
}
},onStackMouseover:function(){
if(cpvw_stackManager.stackHideTimer){
clearTimeout(cpvw_stackManager.stackHideTimer);
cpvw_stackManager.stackHideTimer=null;
}
if(!cpvw_stackManager.stackShowTimer&&cpvw_stackManager.stackMode=="icon"&&!cpvw_stackManager.isLocked){
cpvw_stackManager.stackShowTimer=setTimeout("cpvw_stackManager.stackMode = \"stack\";cpvw_stackManager.displayStack()",300);
}
},onStackMouseout:function(){
if(cpvw_stackManager.stackShowTimer){
clearTimeout(cpvw_stackManager.stackShowTimer);
cpvw_stackManager.stackShowTimer=null;
}
if(cpvw_stackManager.stackHideTimer==null&&cpvw_stackManager.stackMode=="stack"&&!cpvw_stackManager.isLocked&&cpvw_stackManager.arrCanvas.length>0){
cpvw_stackManager.stackHideTimer=setTimeout("cpvw_stackManager.stackMode = \"icon\";cpvw_stackManager.hideStack()",1000);
}
},hideStack:function(){
if(cpvw_stackManager.sWebControl){
cpvw_stackManager.sWebControl.stop=true;
}
cpvw_get("cooliris-stackresize").hidden=true;
cpvw_stackManager.hWebControl=new cooliris_wc_clsWebControl(cpvw_get("cooliris_canvasHolder"),new cooliris_wc_Point(cpvw_get("cooliris_canvasHolder").boxObject.x,cpvw_get("cooliris_canvasHolder").boxObject.y),new cooliris_wc_Point(cpvw_stackManager.objBrowser().width-19,cpvw_stackManager.objBrowser().y+50),"magnifystack");
cpvw_stackManager.hWebControl.setDim(new cooliris_wc_Dim(cpvw_get("cooliris_canvasHolder").boxObject.width,cpvw_get("cooliris_canvasHolder").boxObject.height),new cooliris_wc_Dim(19,57));
cpvw_stackManager.hWebControl.maxTimes=30;
cpvw_stackManager.hWebControl.callback=function(_21){
conDump("hide stack");
if(!cpvw_get("cooliris_canvasHolder").hidden){
cpvw_stackManager.setStackPos(cpvw_get("cooliris_canvasHolder").boxObject.x-19,cpvw_stackManager.objBrowser().y+50,-1,-1);
}
if(_21==cpvw_stackManager.hWebControl.maxTimes/2){
cpvw_get("cooliris_stackTabIcon").hidden=false;
cpvw_get("cooliris_stackTabShow").hidden=true;
cpvw_get("cooliris_cHolder").hidden=true;
}else{
if(_21==0){
cpvw_get("cooliris_canvasHolder").hidden=true;
conDump("hide Stack1 "+getBrowser().selectedTab.getAttribute("coolirispreviews_id"));
if(cpvw_stackManager.tabStackCount>0){
cpvw_stackManager.showStackIcon();
}
getBrowser().selectedTab.removeAttribute("coolirispreviews_dispStack");
if(!cpvw_stackManager.previewMouseOver){
cpvw_docHandler.initPreviewHide();
}
}
}
};
setTimeout(function(){
cpvw_stackManager.hWebControl.magnifyStack();
},0);
cpvw_stackManager.stackMode="icon";
},showStackIcon:function(){
cpvw_get("cooliris_stackIcon").style.position="fixed";
cpvw_get("cooliris_stackIcon").style.zIndex=1000;
cpvw_get("cooliris_stackIcon").hidden=false;
cpvw_get("cooliris_stackTabIcon").hidden=false;
cpvw_get("cooliris_stackTabShow").hidden=true;
var _22=19;
if(getBrowser().mCurrentBrowser.contentWindow.scrollMaxY!=0){
_22=36;
}
conDump("show stack icon");
this.setStackPos(cpvw_get("browser").boxObject.width-_22,cpvw_get("browser").boxObject.y+50,20,57);
},setStackPos:function(_23,top,_25,_26){
conDump("CCC = "+_23+", "+top+", "+_25+", "+_26);
if(_23!=-1){
cpvw_get("cooliris_stackIcon").style.left=_23+"px";
}
if(top!=-1){
cpvw_get("cooliris_stackIcon").style.top=top+"px";
}
if(_25!=-1){
cpvw_get("cooliris_stackIcon").style.width=_25+"px";
}
if(_26!=-1){
cpvw_get("cooliris_stackIcon").style.height=_26+"px";
}
},lockStack:function(){
if(cpvw_stackManager.isLocked){
cpvw_stackManager.isLocked=false;
cpvw_get("cooliris_stackLocked").setAttribute("src","chrome://cooliris/skin/new/tab_lock.png");
getBrowser().selectedTab.setAttribute("coolirispreviews_dispStack","hide");
if(cpvw_stackManager.stackShowTimer){
clearTimeout(cpvw_stackManager.stackShowTimer);
cpvw_stackManager.stackShowTimer=null;
}
}else{
cpvw_stackManager.isLocked=true;
cpvw_get("cooliris_stackLocked").setAttribute("src","chrome://cooliris/skin/new/tab_locked.png");
getBrowser().selectedTab.setAttribute("coolirispreviews_dispStack","show");
if(cpvw_stackManager.stackHideTimer){
clearTimeout(cpvw_stackManager.stackHideTimer);
cpvw_stackManager.stackHideTimer=null;
}
}
},startResize:function(evt){
cpvw_stackManager.curMouseLocY=evt.screenY;
document.getElementById("main-window").addEventListener("mouseup",cpvw_stackManager.stopResize,true);
document.getElementById("main-window").addEventListener("mousemove",cpvw_stackManager.doResize,true);
},stopResize:function(evt){
var _29=cpvw_stackManager.stackHeight()+evt.screenY-cpvw_stackManager.curMouseLocY;
if(_29<225){
_29=227;
}
if(cpvw_get("cooliris_canvasHolder").boxObject.y+_29>cpvw_stackManager.objBrowser().y+cpvw_stackManager.objBrowser().height-20){
_29=cpvw_stackManager.objBrowser().y+cpvw_stackManager.objBrowser().height-20-cpvw_get("cooliris_canvasHolder").boxObject.y;
}
cpvw_stackManager.setStackHeight(_29);
if(cpvw_get("cooliris_canvasHolder_stack")){
cpvw_get("cooliris_canvasHolder_stack").style.height=_29+"px";
}
cpvw_get("cooliris_cHolder").style.maxHeight=(_29-25)+"px";
cpvw_stackManager.resizeStack=true;
document.getElementById("main-window").removeEventListener("mouseup",cpvw_stackManager.stopResize,true);
document.getElementById("main-window").removeEventListener("mousemove",cpvw_stackManager.doResize,true);
},doResize:function(evt){
var _2b=cpvw_stackManager.stackHeight()+evt.screenY-cpvw_stackManager.curMouseLocY;
if(_2b<225||(cpvw_get("cooliris_canvasHolder").boxObject.y+_2b>cpvw_stackManager.objBrowser().y+cpvw_stackManager.objBrowser().height-20)){
return;
}
cpvw_get("cooliris_canvasHolder").style.height=_2b+"px";
cpvw_get("cooliris-stackresize").style.top=(cpvw_get("cooliris_canvasHolder").boxObject.y+cpvw_get("cooliris_canvasHolder").boxObject.height-5)+"px";
conDump("height = "+_2b);
if(cpvw_get("cooliris_canvasHolder_stack")){
cpvw_get("cooliris_canvasHolder_stack").style.height=_2b+"px";
}
cpvw_get("cooliris_cHolder").style.height=(_2b-25)+"px";
},closeStack:function(){
var _2c=cpvw_stackManager.arrCanvas;
for(var i=0;i<_2c.length;i++){
cpvw_get("cooliris_cHolder").removeChild(_2c[i]);
_2c.splice(i,1);
i--;
}
getBrowser().selectedTab.removeAttribute("coolirispreviews_dispStack");
if(cpvw_stackManager.stackHideTimer){
clearTimeout(cpvw_stackManager.stackHideTimer);
cpvw_stackManager.stackHideTimer=null;
}
cpvw_get("cooliris_canvasHolder").hidden=true;
cpvw_get("cooliris_stackIcon").hidden=true;
},removeFromStack:function(){
var _2e=document.popupNode.getAttribute("canvasTimeStamp");
var _2f=cpvw_stackManager.arrCanvas;
for(var i=0;i<_2f.length;i++){
var _31=_2f[i].getAttribute("canvasTimeStamp");
if(_2e==_31){
cpvw_get("cooliris_cHolder").removeChild(_2f[i]);
_2f.splice(i,1);
cpvw_stackManager.tabStackCount--;
}
}
if(cpvw_stackManager.tabStackCount==0){
getBrowser().selectedTab.removeAttribute("coolirispreviews_dispStack");
cpvw_get("cooliris_canvasHolder").hidden=true;
cpvw_get("cooliris_stackIcon").hidden=true;
}
}};

