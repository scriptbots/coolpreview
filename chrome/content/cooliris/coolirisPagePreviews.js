function cpvw_clsPreview(_1){
this.parentDoc=_1;
this.popTimer=null;
this.linkUrl="";
this.pageX=0;
this.pageY=0;
this.openDelayTime=cpvw_Delays.OPEN_DELAY_TIME;
this.isShowingPreview=false;
this.isShowingSmallDiv=false;
this.dimPreview=null;
this.prefetchIndex=0;
this.prefetchTimer=null;
this.prefetchDelay=cpvw_Delays.PREFETCH_DELAY_TIME;
this.hideTimer=null;
this.dispDelayTime=cpvw_Delays.DISPLAY_DELAY_TIME;
this.dispTimer=null;
this.doneHighlight=false;
this.highlightTimer=null;
this.smallDivTimer=null;
this.showSmallDivTimer=null;
this.newHistory=null;
this.aIndex=0;
this.prefetchIndex=0;
this.prefetchLinks=new Array();
this.customSite="";
this.hText="";
this.linkElem=null;
this.pushpin=false;
this.enablePreview=true;
this.curIndex=0;
this.arrLinks=null;
this.evt=null;
this.mouseoverIconTimer=null;
}
cpvw_clsPreview.prototype={setup:function(){
var _2=cpvw_previewHandler.getPreviewFrame();
_2.removeEventListener("load",cpvw_previewHandler.pageLoad,true);
_2.addEventListener("load",cpvw_previewHandler.pageLoad,true);
},clearTimer:function(_3){
if(_3==this.popTimer){
clearTimeout(this.popTimer);
this.popTimer=null;
}else{
if(_3==this.hideTimer){
clearTimeout(this.hideTimer);
this.hideTimer=null;
}else{
if(_3==this.dispTimer){
clearTimeout(this.dispTimer);
this.dispTimer=null;
}else{
if(_3==this.smallDivTimer){
clearTimeout(this.smallDivTimer);
this.smallDivTimer=null;
}else{
if(_3==this.showSmallDivTimer){
clearTimeout(this.showSmallDivTimer);
this.showSmallDivTimer=null;
}else{
clearTimeout(_3);
}
}
}
}
}
},startPrefetch:function(){
var _4=this.parentDoc.location.href;
var _5=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
_5.spec=_4;
var _6=this;
for(var i=0;i<this.prefetchLinks.length;i++){
var _8=this.prefetchLinks[i];
var _9=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
_9.spec=_8;
var _a=Components.classes["@mozilla.org/prefetch-service;1"].createInstance(Components.interfaces.nsIPrefetchService);
try{
_a.prefetchURI(_9,_5,true);
}
catch(ex){
}
}
},afterPrefetch:function(_b){
if(this.prefetchTimer){
clearTimeout(this.prefetchTimer);
}
this.prefetchIndex++;
if(this.prefetchIndex>=this.prefetchLinks.length){
var _c=document.getElementById("frmPrefetch");
if(_c!=null){
document.getElementById("main-window").removeChild(_c);
}
return;
}
this.startPrefetch();
},convertLinks:function(){
var _d=this.parentDoc;
this.prefetchLinks=new Array();
this.arrLinks=new Array();
var _e=this.parentDoc.getElementsByTagName("a");
_d.addEventListener("DOMNodeInserted",function(_f){
var _10=_f.target;
var _11;
if(_10 instanceof HTMLLinkElement){
_11=new Array;
_11.push(_10);
cpvw_docHandler.modifyLinks(_11);
}else{
if(_10.getElementsByTagName){
_11=_10.getElementsByTagName("a");
cpvw_docHandler.modifyLinks(_11);
}
}
},false);
this.modifyLinks(_e);
},modifyLinks:function(_12){
var _13=this;
var _14=new Array();
var _15=new Array();
var _16=false;
for(var i=0;i<navigator.mimeTypes.length;i++){
if(navigator.mimeTypes[i].type.toLowerCase()=="application/pdf"){
_16=true;
}
}
for(i=0;i<_12.length;i++){
if(_12[i].href.toString().indexOf("http")==-1||_12[i].href.toString().indexOf("#")==_12[i].href.toString().length-1||_12[i].href.toString().toLowerCase().indexOf("logout")!=-1||_12[i].href.toString().toLowerCase().indexOf("signin")!=-1||_12[i].href.toString().toLowerCase().indexOf("login")!=-1||_12[i].href.toString().toLowerCase().indexOf("signout")!=-1){
continue;
}
if(this.customSite=="google_search"){
var _18=_12[i].href.toString().indexOf("/",8);
if(_12[i].href.toString().indexOf("/webhp")!=-1){
continue;
}
}
if(this.customSite=="technorati"){
if(_12[i].href.toString().indexOf("www.technorati.com/search")!=-1||_12[i].href.toString().indexOf("www.technorati.com/faves")!=-1){
continue;
}
}
if(this.customSite=="delicious"){
if(_12[i].href.toString().indexOf("delete=")!=-1){
continue;
}
}
var _19=""+_12[i].href;
if(_19.match(/\.(pdf)$/i)){
if(!_16){
continue;
}
}
if(_12[i].getAttribute("set")=="yes"){
continue;
}
_12[i].setAttribute("linkIndex",this.arrLinks.length);
_12[i].addEventListener("mouseover",function(evt){
this.setAttribute("set","yes");
var _1b=this;
cpvw_docHandler.curIndex=parseInt(this.getAttribute("linkIndex"));
cpvw_docHandler.evt=evt;
_13.previewOpen(evt,this.href,this);
},false);
_12[i].addEventListener("mouseout",function(evt){
var _1d=this;
_13.previewClose(evt);
},false);
_12[i].addEventListener("click",function(evt){
var _1f=this.href.toString();
if(cpvw_previewHandler.previewOpenMode=="click"&&(!cpvw_docHandler.isShowingPreview||cpvw_docHandler.linkUrl!=_1f)){
cpvw_docHandler.openDelayTime=0;
cpvw_docHandler.dispDelayTime=500;
cpvw_docHandler.initPreviewShow(evt,this.href,this);
evt.preventDefault();
}else{
_13.initPreviewHide(evt);
cpvw_previewHandler.hidePreview();
}
},false);
if(_19.match(/\.(pdf|doc|xls|ppt)$/i)){
continue;
}
this.arrLinks.push(_12[i].getAttribute("href"));
if(_12[i].id==""){
_15.push(_12[i]);
}else{
_14.push(_12[i]);
}
}
this.prefetchLinks=this.prefetchLinks.concat(_15,_14);
},getCurrentIndex:function(url){
var _21=-1;
for(var i=0;i<this.arrLinks.length;i++){
var _23=this.arrLinks[i];
if(this.customSite=="google_search"){
if(_23==url){
return i;
}
}else{
if(this.customSite=="yahoo_search"){
conDump("getCurrentIndex = "+i+", "+url+", "+_23);
url=url.replace(":","%3a");
if(_23.indexOf(url)!=-1){
return i;
}
}
}
}
return _21;
},findNextGoogleLink:function(){
var _24=cpvw_previewHandler.getPreviewFrame();
var _25=_24.contentDocument;
var _26=this.getCurrentIndex(_25.URL);
var _27=(_26==-1)?cpvw_docHandler.curIndex:_26;
for(var i=_27+1;i<this.arrLinks.length;i++){
var _29=this.arrLinks[i];
if(_29==null){
continue;
}
var uri=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
uri.spec=_29;
if(this.customSite=="google_search"){
if(uri.host.indexOf("google")!=-1||(_29.indexOf("/search")!=-1||_29.indexOf("q=cache")!=-1)){
continue;
}else{
break;
}
}else{
if(this.customSite=="yahoo_search"){
if(_29.indexOf("cache.search")!=-1){
continue;
}else{
break;
}
}
}
}
return i;
},displayNextLink:function(){
if(this.arrLinks.length==0){
return;
}
var _2b="";
if(this.customSite!="google_search"&&this.customSite!="yahoo_search"){
cpvw_docHandler.curIndex++;
}else{
cpvw_docHandler.curIndex=this.findNextGoogleLink();
}
if(cpvw_docHandler.curIndex>this.arrLinks.length){
cpvw_docHandler.curIndex=0;
}
_2b=this.arrLinks[cpvw_docHandler.curIndex];
if(this.customSite=="google_search"){
if(_2b.charAt(0)=="/"){
_2b="http://www.google.com"+_2b;
}
}
this.popTimer=setTimeout(function(){
cpvw_docHandler.showPreview(_2b);
},10);
},handleKeyPress:function(evt){
if(evt.keyCode==32){
cpvw_docHandler.openDelayTime=cpvw_Delays.OPEN_DELAY_TIME;
cpvw_docHandler.dispDelayTime=cpvw_Delays.DISPLAY_DELAY_TIME;
cpvw_docHandler.initPreviewShow(evt,href,elem);
}
},previewClose:function(evt){
var _2e=this;
if(cpvw_previewHandler.previewOpenMode=="direct"){
_2e.initPreviewHide(evt);
}else{
if(cpvw_previewHandler.previewOpenMode=="icon"){
_2e.clearTimer(_2e.showSmallDivTimer);
_2e.smallDivTimer=setTimeout(function(){
_2e.removeSmallDiv();
},2000);
if(_2e.isShowingPreview){
_2e.initPreviewHide(evt);
}
}else{
if(cpvw_previewHandler.previewOpenMode=="click"){
_2e.clearTimer(_2e.popTimer);
_2e.clearTimer(_2e.dispTimer);
}else{
if(cpvw_previewHandler.previewOpenMode=="hotkey"&&evt.ctrlKey){
_2e.initPreviewHide(evt);
}
}
}
}
},previewOpen:function(evt,_30,_31){
var _32=this;
if(!_32.parentDoc.enablePreview){
return;
}
if(cpvw_previewHandler.previewOpenMode=="direct"){
_32.openDelayTime=cpvw_Delays.OPEN_DELAY_TIME;
_32.dispDelayTime=cpvw_Delays.DISPLAY_DELAY_TIME;
_32.initPreviewShow(evt,_30,_31);
}else{
if(cpvw_previewHandler.previewOpenMode=="icon"||cpvw_previewHandler.previewOpenMode=="icon-click"){
_32.openDelayTime=500;
_32.dispDelayTime=500;
_32.clearTimer(_32.smallDivTimer);
if(_32.isShowingPreview){
_32.initPreviewShow(evt,_30,_31);
}else{
_32.showSmallDivTimer=setTimeout(function(){
_32.showSmallDiv(evt,_30,_31);
},cpvw_Delays.ICON_DELAY_TIME);
}
}else{
if(cpvw_previewHandler.previewOpenMode=="click"){
_32.clearTimer(_32.hideTimer);
}else{
if(cpvw_previewHandler.previewOpenMode=="hotkey"&&evt.ctrlKey){
_32.openDelayTime=100;
_32.dispDelayTime=500;
_32.initPreviewShow(evt,_30,_31);
}
}
}
}
},getElementPosition:function(_33){
var _34=0;
var _35=0;
if(_33){
var _36=_33.offsetParent;
if(_36){
while((_36=_33.offsetParent)!=null){
_34+=_33.offsetLeft;
_35+=_33.offsetTop;
_33=_36;
}
}else{
_34=_33.offsetLeft;
_35=_33.offsetTop;
}
}
return {"px":_34,"py":_35};
},showSmallDiv:function(evt,_38,_39){
if(this==cpvw_docHandler){
evt=cpvw_docHandler.evt;
}
var _3a=this;
var pos=_3a.getElementPosition(_39);
var px,_3d=60;
if(cpvw_prefHandler.getPref(cpvw_Prefs.prefFixedIcon,"bool")){
px=pos.px+_39.offsetWidth;
}else{
if(_39.offsetWidth+_39.offsetLeft>document.getElementById("appcontent").boxObject.width){
px=pos.px-20;
}else{
if(evt.screenX-_3d<pos.px){
if(evt.screenX+_3d+20>pos.px+_39.offsetWidth){
px=pos.px+_39.offsetWidth;
}else{
px=evt.screenX+_3d+20;
}
}else{
px=evt.screenX-_3d-20;
}
}
}
conDump("small div loc = "+px+", "+cpvw_docHandler.isShowingPreview+", "+cpvw_docHandler.isShowingSmallDiv);
pos.px=px;
if(_3a.curLink==_39){
return;
}
_3a.removeSmallDiv(true);
if(!_3a.isShowingPreview&&!_3a.isShowingSmallDiv){
var _3e=_3a.parentDoc.createElement("img");
_3e.setAttribute("src","chrome://cooliris/skin/new/mouseover.png");
_3e.setAttribute("id","cpvw_smallDivTip");
_3e.setAttribute("style","z-index:10000;border: 0px solid blue;-moz-opacity:0.20;position:absolute;width:20px;height:20px;");
var _3f=function(){
_3e.style.opacity=parseFloat(_3e.style.opacity)+0.2;
if(parseFloat(_3e.style.opacity)<0.9){
setTimeout(_3f,75);
}
};
setTimeout(_3f,50);
_3e.style.left=pos.px+"px";
_3e.style.top=pos.py+"px";
_3a.parentDoc.body.appendChild(_3e);
_3a.isShowingSmallDiv=true;
_3a.curLink=_39;
_3e.addEventListener("mouseover",function(evt){
if(cpvw_previewHandler.previewOpenMode=="icon-click"){
return;
}
conDump("IN SMALL_DIV_MOUSE OVER ");
clearTimeout(_3a.smallDivTimer);
clearTimeout(_3a.smallDivRemoveTimer);
_3e.style.opacity=0.9;
_3a.mouseX=evt.screenX;
_3a.mouseY=evt.screenY;
if(evt.altKey){
conDump("IN ALT KEY");
if(_38!=cpvw_stackManager.prevUrl){
cpvw_stackManager.addToStack(null,_38);
}
}else{
_3a.mouseoverIconTimer=setTimeout(function(){
_3a.initPreviewShow(evt,_38,_39);
},cpvw_Delays.PREVIEW_ON_ICON_DELAY);
}
},true);
_3e.addEventListener("click",function(evt){
clearTimeout(_3a.smallDivTimer);
clearTimeout(_3a.smallDivRemoveTimer);
_3e.style.opacity=0.9;
_3a.mouseX=evt.screenX;
_3a.mouseY=evt.screenY;
if(evt.altKey){
conDump("IN ALT KEY");
if(_38!=cpvw_stackManager.prevUrl){
cpvw_stackManager.addToStack(null,_38);
}
}else{
_3a.initPreviewShow(evt,_38,_39);
}
},true);
_3e.addEventListener("mouseout",function(evt){
clearTimeout(_3a.mouseoverIconTimer);
_3a.initPreviewHide(evt);
_3a.removeSmallDiv();
},true);
_3a.smallDivTimer=setTimeout(function(){
_3a.removeSmallDiv();
},5000);
}else{
_3a.initPreviewShow(evt,_38,_39);
}
},removeSmallDiv:function(_43){
var _44=this;
var _45=_44.parentDoc.getElementById("cpvw_smallDivTip");
if(_43){
_44.isShowingSmallDiv=false;
cpvw_docHandler.curLink=null;
if(_45!=null){
_44.parentDoc.body.removeChild(_45);
clearTimeout(_44.smallDivTimer);
}
}else{
if(_45!=null){
_45.style.opacity=parseFloat(_45.style.opacity)-0.1;
if(parseFloat(_45.style.opacity)>0){
_44.smallDivRemoveTimer=setTimeout(function(){
_44.removeSmallDiv();
},120);
}else{
_44.removeSmallDiv(true);
}
}
}
},initPreviewShow:function(evt,_47,_48,_49){
this.clearTimer(this.hideTimer);
var _4a=this;
var _4b=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewEnable,"char");
conDump("IN PAGE_PREVIEW_SHOW");
if((_4b=="no"||!_4a.parentDoc.enablePreview)&&!_49){
return;
}
if(this.customSite=="google_search"&&(_47.indexOf("http://www.google.com/pagead/iclk")!=-1||_47.indexOf("http://www.google.com/url")!=-1)){
var _4c=_47.split("&");
for(var i=0;i<_4c.length;i++){
if(_4c[i].indexOf("adurl=")!=-1){
_47=_4c[i].substr(6);
_47=unescape(_47);
}
if(_4c[i].indexOf("q=")!=-1){
_47=_4c[i].substr(_4c[i].indexOf("q=")+2);
_47=unescape(_47);
}
}
}
if(this.customSite=="yahoo_search"&&(_47.indexOf("overture.com")!=-1)){
var _4e=_47.indexOf("yargs=");
if(_4e!=-1){
_47=_47.substr(_4e+6);
_47=unescape(_47);
if(_47.indexOf("http://")==-1&&_47.indexOf("https://")==-1){
_47="http://"+_47;
}
}
}
this.pageX=evt.pageX;
this.pageY=evt.pageY;
this.screenX=evt.screenX;
this.screenY=evt.screenY;
if(this.linkUrl==_47&&this.isShowingPreview){
this.setPreviewDimensions();
return;
}
conDump("DELAYS = "+this.openDelayTime+", "+this.dispDelayTime);
this.linkElem=_48;
this.popTimer=setTimeout(function(){
_4a.showPreview(_47);
},this.openDelayTime);
var _4f=this.dispDelayTime;
if(this.customSite=="google_video"||this.customSite=="youtube_video"||this.customSite=="newsvine"){
_4f+=1000;
}
this.dispTimer=setTimeout(function(){
_4a.displayPreview();
},_4f);
},initPreviewHide:function(evt){
var _51=this;
_51.clearTimer(this.popTimer);
_51.clearTimer(this.dispTimer);
cpvw_docHandler.clearTimer(cpvw_docHandler.showSmallDivTimer);
if(!_51.isShowingPreview){
return;
}
_51.hideTimer=setTimeout(function(){
_51.hidePreview(false);
},cpvw_Delays.CLOSE_DELAY_TIME);
},clearHideTimer:function(){
this.clearTimer(this.hideTimer);
},showPreview:function(_52){
if(this.popTimer==null){
return;
}
conDump("IN SHOW PREVIEW HREF TIMER  "+_52+", "+this.screenX);
var _53,_54;
this.linkUrl=_52;
var _55=this;
this.setPreviewDimensions();
_54=cpvw_previewHandler.getPreviewFrame();
cpvw_previewHandler.isContextMenu=false;
_54.setAttribute("src",this.linkUrl);
cpvw_previewHandler.isLoaded=false;
if(cpvw_previewHandler.previewOpenMode!="click"){
this.parentDoc.addEventListener("click",cpvw_previewHandler.hidePreview,true);
}
},setPreviewDimensions:function(){
var doc=this.parentDoc;
var _57=document.getElementById("appcontent").boxObject.y+30;
var _58=this.screenX,_59=this.screenY;
this.dimPreview=new cpvw_previewSize();
this.dimPreview.top=_57;
var _5a=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewSize,"char");
conDump("IN SET PREVIEW DIMENSIONS = "+_5a+", "+_58+", "+_59);
if(_5a.indexOf(",")!=-1){
this.dimPreview.width=parseInt(_5a.split(",")[0]);
this.dimPreview.height=parseInt(_5a.split(",")[1]);
if(_58<document.getElementById("appcontent").boxObject.width/2){
this.dimPreview.left=(_58+40)<200?200:_58+40;
}else{
var _5b=getBrowser().selectedTab.getAttribute("coolirispreviews_dispStack");
this.dimPreview.left=_58-100-this.dimPreview.width;
if(this.dimPreview.left<0||(_5b=="show")){
this.dimPreview.left=10;
}
}
if(this.dimPreview.width+this.dimPreview.left>document.getElementById("appcontent").boxObject.width){
this.dimPreview.width=document.getElementById("appcontent").boxObject.width-30-this.dimPreview.left;
}
if((this.dimPreview.left<_58)&&(this.dimPreview.width+this.dimPreview.left>_58)){
this.dimPreview.width=_58-10-this.dimPreview.left;
}
if(this.dimPreview.height+30>document.getElementById("appcontent").boxObject.height){
this.dimPreview.height=document.getElementById("appcontent").boxObject.height-40;
}
}else{
if(_58<document.getElementById("appcontent").boxObject.width/2){
this.dimPreview.left=(_58+40)<200?200:_58+40;
}else{
this.dimPreview.left=10;
}
if(_58<document.getElementById("appcontent").boxObject.width/2){
this.dimPreview.width=document.getElementById("appcontent").boxObject.width-30-this.dimPreview.left;
}else{
this.dimPreview.width=_58-40;
}
this.dimPreview.height=document.getElementById("appcontent").boxObject.height-30;
}
var _5c=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
if(_5c=="yes"){
var _5d=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewLoc,"char");
if(_5d.indexOf(",")!=-1){
this.dimPreview.left=parseInt(_5d.split(",")[0]);
this.dimPreview.top=parseInt(_5d.split(",")[1]);
if(this.dimPreview.top==0||this.dimPreview.top<0){
this.dimPreview.top=_57;
}
}
if(_5a.indexOf(",")!=-1){
this.dimPreview.width=parseInt(_5a.split(",")[0]);
this.dimPreview.height=parseInt(_5a.split(",")[1]);
}
}
this.dimPreview.mouseX=_58;
this.dimPreview.mouseY=_59;
},hidePreview:function(_5e){
if(this.hideTimer==null){
return;
}
try{
var _5f=cpvw_previewHandler.hidePreview();
if(_5f){
if(this.linkElem!=null){
this.linkElem.setAttribute("style","color:brown;");
}
this.isShowingPreview=false;
}
}
catch(ex){
conDump("Error "+ex);
}
},displayPreview:function(){
conDump("IN START OF DISPLAY PREVIEW ");
var _60=cpvw_objOverlay.getContentDocument();
if(_60==null||cpvw_docHandler==null){
return;
}
if(this.dispTimer==null){
return;
}
this.isShowingPreview=true;
conDump("IN DISPLAY PREVIEW "+this.customSite);
cpvw_previewHandler.showPreview(this.dimPreview,this.customSite);
if(this.linkElem!=null){
this.linkElem.setAttribute("style","color:orange");
}
},previewOnLoad:function(evt){
var _62=this;
var _63=cpvw_previewHandler.getPreviewFrame();
cpvw_previewHandler.isLoaded=true;
if(this.customSite=="google_video"){
googleVideo_filter(_63.contentDocument);
}
var _64=cpvw_prefHandler.getPref(cpvw_Prefs.applyBrowserZoom,"char");
if(_64=="yes"){
if(_63.markupDocumentViewer!=null){
setTimeout(function(){
_63.markupDocumentViewer.textZoom=cpvw_get("content").markupDocumentViewer.textZoom;
},100);
}
}else{
_63.markupDocumentViewer.textZoom=cpvw_prefHandler.getPref(cpvw_Prefs.prefTextZoom,"char");
}
this.doneHighlight=false;
},startPiclensLite:function(){
var doc=this.parentDoc;
if(doc.loadPiclensJS!=1){
doc.loadPiclensJS=1;
var _66=doc.createElement("script");
_66.setAttribute("type","text/javascript");
_66.setAttribute("src","http://lite.piclens.com/current/piclens.js");
var _67=doc.getElementsByTagName("head")[0];
if(_67!=null){
_67.appendChild(_66);
}else{
if(doc.body!=null){
doc.body.appendChild(_66);
}
}
}
var _68=cpvw_previewHandler.getPreviewFrame();
var _69=_68.contentDocument;
var _6a=this.parWindow;
var _6b=new Array();
var _6c=_69.getElementsByTagName("IMG");
conDump("images lenght = "+_6c.length);
var _6d=cpvw_prefHandler.getPref(cpvw_Prefs.prefPiclensFilterSize,"char");
var _6e=_6d.split(",");
var _6f=_6e[0],_70=_6e[1];
for(var i=0;i<_6c.length;i++){
var img=_6c[i];
var _73=img.src;
if(_73==null){
continue;
}
var _74=img.parentNode;
var m=0;
var _76=_73;
while(_74&&m<3){
if(_74.nodeType==Node.ELEMENT_NODE){
if((_74 instanceof HTMLAnchorElement&&_74.href)||_74 instanceof HTMLAreaElement||_74 instanceof HTMLLinkElement){
_76=_74.href;
break;
}
}
_74=_74.parentNode;
m++;
}
if(_76!=_73){
var uri=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
uri.spec=_76;
var _78=Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService);
var _79;
try{
_79=_78.getTypeFromURI(uri);
}
catch(ex){
_79="";
}
if(_79.indexOf("image")==-1){
_76=_73;
}
}
if(_76==_73){
if(img.width<_6f||img.height<_70){
continue;
}
}
_6b.push({"src":_76,"thumbnailSrc":_73});
}
if(_6b.length>0){
setTimeout(function(){
cpvw_jsUtils.showPiclensLite(_6a,doc.title,doc.URL,_6b,false);
},1000);
}else{
alert("No images to view (Images might be filtered according to your filter criteria)");
}
},highlightText:function(how){
var _7b="";
var _7c=document.getElementById("cooliris-preview-frame");
if(_7c.contentDocument!=null&&_7c.contentDocument.body!=null){
if(this.customSite=="google_search"){
var _7d=this.parentDoc.getElementsByTagName("input");
for(var i=0;i<_7d.length;i++){
if(_7d[i].getAttribute("name")=="q"){
_7b=_7d[i].value;
break;
}
}
}else{
if(this.customSite=="yahoo_search"){
var _7d=this.parentDoc.getElementsByTagName("input");
for(var i=0;i<_7d.length;i++){
if(_7d[i].getAttribute("name")=="p"){
_7b=_7d[i].value;
break;
}
}
}
}
conDump("words = "+_7b+", "+this.customSite);
if(_7b==""){
return;
}
this.arrHighlightText=_7b.split(" ");
if(this.arrHighlightText==null){
return;
}
if(how=="show"){
for(var i=0;i<this.arrHighlightText.length;i++){
conDump("search words = "+this.arrHighlightText[i]);
this.highlightWord("#FFFF99","black",this.arrHighlightText[i],_7c.contentWindow);
}
this.doneHighlight=true;
}else{
for(var i=0;i<this.arrHighlightText.length;i++){
conDump("search words remove = "+this.arrHighlightText[i]);
this.removeHighlight(this.arrHighlightText[i],_7c.contentWindow);
}
this.doneHighlight=false;
}
}
},removeHighlight:function(_7f,win){
var _81=false;
for(var i=0;win.frames&&i<win.frames.length;i++){
if(this.removeHighlight(aHighBackColor,aHighTextColor,_7f,win.frames[i])){
_81=true;
}
}
var doc=win.document;
if(!doc||!(doc instanceof HTMLDocument)){
return _81;
}
var _84=doc.body;
var _85=_84.childNodes.length;
this._searchRange=doc.createRange();
this._startPt=doc.createRange();
this._endPt=doc.createRange();
this._searchRange.setStart(_84,0);
this._searchRange.setEnd(_84,_85);
this._startPt.setStart(_84,0);
this._startPt.setEnd(_84,0);
this._endPt.setStart(_84,_85);
this._endPt.setEnd(_84,_85);
var _86=null;
var _87=Components.classes["@mozilla.org/embedcomp/rangefind;1"].createInstance(Components.interfaces.nsIFind);
while((_86=_87.Find(_7f,this._searchRange,this._startPt,this._endPt))){
var _88=_86.startContainer;
var _89=null;
try{
_89=_88.parentNode;
}
catch(ex){
}
if(_89&&_89.className=="__cooliris-search"){
var _8a=null;
var _8b=doc.createDocumentFragment();
var _8c=_89.nextSibling;
var _8d=_89.parentNode;
while((_8a=_89.firstChild)){
_8b.appendChild(_8a);
}
this._startPt=doc.createRange();
this._startPt.setStartAfter(_89);
_8d.removeChild(_89);
_8d.insertBefore(_8b,_8c);
_8d.normalize();
}else{
this._startPt=doc.createRange();
this._startPt.setStart(_86.endContainer,_86.endOffset);
}
this._startPt.collapse(true);
}
},highlightWord:function(_8e,_8f,_90,win){
var _92=false;
for(var i=0;win.frames&&i<win.frames.length;i++){
if(this.highlightWord(_8e,_8f,_90,win.frames[i])){
_92=true;
}
}
var doc=win.document;
if(!doc||!(doc instanceof HTMLDocument)){
return _92;
}
var _95=doc.body;
var _96=_95.childNodes.length;
this._searchRange=doc.createRange();
this._startPt=doc.createRange();
this._endPt=doc.createRange();
this._searchRange.setStart(_95,0);
this._searchRange.setEnd(_95,_96);
this._startPt.setStart(_95,0);
this._startPt.setEnd(_95,0);
this._endPt.setStart(_95,_96);
this._endPt.setEnd(_95,_96);
var _97=doc.createElementNS("http://www.w3.org/1999/xhtml","span");
_97.style.backgroundColor=_8e;
_97.style.color=_8f;
_97.style.display="inline";
_97.style.fontSize="inherit";
_97.style.padding="0";
_97.className="__cooliris-search";
return this.changeText(_90,_97)||_92;
},changeText:function(_98,_99){
var _9a=null;
var _9b=Components.classes["@mozilla.org/embedcomp/rangefind;1"].createInstance().QueryInterface(Components.interfaces.nsIFind);
var _9c=false;
while((_9a=_9b.Find(_98,this._searchRange,this._startPt,this._endPt))){
var _9d=_99.cloneNode(true);
var _9e=this.highlight(_9a,_9d);
this._startPt=_9e.ownerDocument.createRange();
this._startPt.setStart(_9e,_9e.childNodes.length);
this._startPt.setEnd(_9e,_9e.childNodes.length);
_9c=true;
}
return _9c;
},highlight:function(_9f,_a0){
var _a1=_9f.startContainer;
var _a2=_9f.startOffset;
var _a3=_9f.endOffset;
var _a4=_9f.extractContents();
var _a5=_a1.splitText(_a2);
var _a6=_a5.parentNode;
_a0.appendChild(_a4);
_a6.insertBefore(_a0,_a5);
return _a0;
}};
function googleVideo_filter(_a7){
if(_a7.URL.indexOf("videoplay")==-1){
return;
}
var _a8=_a7.getElementById("playvideoblock");
var _a9=_a8.cloneNode(true);
var _aa=_a7.createElement("DIV");
_aa.setAttribute("style","width:100%;height:100%;");
_a7.body.innerHTML="";
_a7.body.appendChild(_aa);
_a9.style.width="100%";
_a9.style.height="100%";
_a9.style.overflow="auto";
_aa.appendChild(_a9);
}

