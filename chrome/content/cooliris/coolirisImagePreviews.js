cpvw_clsPreviewImages.prototype=new cpvw_clsPreview;
function cpvw_clsPreviewImages(_1,_2){
this.parentDoc=_1;
this.customSite=_2;
this.convertLinks();
this.prefetchDelay=6000;
this.openDelayTime=800;
var _3=cpvw_docHandler.parentDoc.isPrefetchSet;
if(_3==null||_3==false){
var _4=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewPrefetch,"char");
if(_4=="yes"){
cpvw_docHandler.parentDoc.isPrefetchSet=true;
this.startPrefetch();
}
}
}
cpvw_clsPreviewImages.prototype.setup=function(){
var _5=cpvw_previewHandler.getPreviewFrame();
_5.setAttribute("src","chrome://cooliris/content/coolirisPreviewImages.htm");
_5.removeEventListener("load",cpvw_previewHandler.pageLoad,true);
_5.addEventListener("load",cpvw_previewHandler.pageLoad,true);
var _6=this.parentDoc;
if(_6.loadPiclensJS!=1){
_6.loadPiclensJS=1;
var _7=_6.createElement("script");
_7.setAttribute("type","text/javascript");
_7.setAttribute("src","http://lite.piclens.com/current/piclens.js");
var _8=_6.getElementsByTagName("head")[0];
if(_8!=null){
_8.appendChild(_7);
}else{
if(_6.body!=null){
_6.body.appendChild(_7);
}
}
}
};
cpvw_clsPreviewImages.prototype.startPrefetch=function(){
var _9=new XPCNativeWrapper(window._content,"document").document;
if(_9!=this.parentDoc){
this.prefetchIndex=this.prefetchLinks.length;
}
if(this.prefetchIndex>=this.prefetchLinks.length){
return;
}
var _a=this;
var _b=this.prefetchLinks[this.prefetchIndex];
var _c=document.getElementById("frmPrefetch");
if(_c==null){
_c=document.createElement("browser");
_c.setAttribute("id","frmPrefetch");
_c.setAttribute("type","content");
_c.setAttribute("src",_b);
_c.setAttribute("style","visibility:hidden;overflow:auto;scrolling:yes;border:0px solid black;background-color:white;width:0px;height:0px;");
document.getElementById("main-window").appendChild(_c);
_c.addEventListener("load",function(_d){
_a.afterPrefetch("onload");
},true);
}else{
_c.setAttribute("src",_b);
}
_c.docShell.allowJavascript=false;
_c.docShell.allowMetaRedirects=false;
_c.docShell.allowAuth=false;
_c.docShell.allowPlugins=false;
_c.docShell.allowSubframes=false;
this.prefetchTimer=setTimeout(function(){
_a.afterPrefetch("timeout");
},this.prefetchDelay);
};
cpvw_clsPreviewImages.prototype.afterPrefetch=function(_e){
if(this.prefetchTimer){
clearTimeout(this.prefetchTimer);
}
this.prefetchIndex++;
if(this.prefetchIndex>=this.prefetchLinks.length){
var _f=document.getElementById("frmPrefetch");
document.getElementById("main-window").removeChild(_f);
return;
}
this.startPrefetch();
};
cpvw_clsPreviewImages.prototype.convertLinks=function(){
var doc=this.parentDoc;
var _11=doc.getElementsByTagName("IMG");
for(var i=0;i<_11.length;i++){
_11[i].addEventListener("mouseover",function(evt){
var _14=Components.classes["@cooliris.com/piclens/manager;1"];
if(_14){
cpvw_imageDocHandler.previewOpen(evt,this.href,this);
}else{
cpvw_imageDocHandler.initPreviewShow(evt,this.href,this);
}
},true);
_11[i].addEventListener("mouseout",function(evt){
cpvw_imageDocHandler.initPreviewHide(evt);
},true);
if(cpvw_jsUtils.trimWhitespace(_11[i].src)!=""){
this.prefetchLinks.push(_11[i].src);
}
}
};
cpvw_clsPreviewImages.prototype.initPreviewShow=function(evt,_17,img){
this.clearTimer(this.hideTimer);
var _19=img.parentNode.href;
var _1a=img.getAttribute("src");
var uri=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
uri.spec=this.parentDoc.URL;
if(uri.host=="images.google.com"){
_1a=img.getAttribute("src");
}
var _1c=cpvw_imageDocHandler.parentDoc.enablePreview;
if(!_1c){
return;
}
_19=_19;
this.pageX=evt.pageX;
this.pageY=evt.pageY;
if(this.linkUrl==_19&&this.isShowingPreview){
return;
}
var _1d=new cpvw_previewSize(10000,10000,1,0);
if(!this.isShowingPreview){
cpvw_previewHandler.showPreview(_1d,this.customSite,true,true);
}
var _1e=cpvw_previewHandler.getPreviewFrame();
if(_1e.getAttribute("src")!="chrome://cooliris/content/coolirisPreviewImages.htm"){
this.setup();
}
this.popTimer=setTimeout(function(){
cpvw_imageDocHandler.showPreview(_19,_1a);
},this.openDelayTime);
};
cpvw_clsPreviewImages.prototype.initPreviewHide=function(evt){
cpvw_imageDocHandler.clearTimer(cpvw_imageDocHandler.popTimer);
if(!cpvw_imageDocHandler.isShowingPreview){
return;
}
cpvw_imageDocHandler.hideTimer=setTimeout(function(){
cpvw_imageDocHandler.hidePreview();
},cpvw_Delays.CLOSE_DELAY_TIME);
};
cpvw_clsPreviewImages.prototype.showPreview=function(_20,_21){
if(this.popTimer==null){
return;
}
this.clearTimer(this.hideTimer);
var _22,_23;
var _24="";
if(this.customSite=="google_images"){
var _25=_20.substring(_20.indexOf("?")+1,_20.length);
var _26=_25.split("&");
for(var i=0;i<_26.length;i++){
if(_26[i].indexOf("imgurl")!=-1){
var _28=_26[i].split("=");
_24=decodeURI(_28[1]);
break;
}
}
}else{
if(this.customSite=="yahoo_images"){
var _25=_20.substring(_20.indexOf("imgurl"),_20.length);
_25=unescape(_25);
var _26=_25.split("&");
for(var i=0;i<_26.length;i++){
if(_26[i].indexOf("imgurl")!=-1){
var _28=_26[i].split("=");
_24="http://"+unescape(_28[1]);
break;
}
}
}
}
var _29=this;
cpvw_previewHandler.isContextMenu=false;
_23=cpvw_previewHandler.getPreviewFrame();
var _2a=_23.contentDocument;
var _2b=_2a.getElementById("divImagePreview");
_2b.innerHTML="";
var _2c=_2a.createElement("IMG");
_2c.setAttribute("id","tmpImgPreview");
_2c.setAttribute("src",_21);
var _2d=_2a.createElement("IMG");
_2d.setAttribute("id","imgPreview");
_2d.setAttribute("src",_24);
_2d.setAttribute("style","visibility:hidden");
_2b.appendChild(_2c);
_2b.appendChild(_2d);
_2c.addEventListener("load",_29.previewOnLoadThumbnail,true);
_2d.addEventListener("load",_29.previewOnLoadRealImg,true);
this.linkUrl=_20;
this.isShowingPreview=true;
this.parentDoc.addEventListener("click",_29.hidePreview,true);
};
cpvw_clsPreviewImages.prototype.previewOnLoadRealImg=function(evt){
var _2f=cpvw_previewHandler.getPreviewFrame();
var _30=_2f.contentDocument;
cpvw_previewHandler.isLoaded=true;
var _31=_30.getElementById("tmpImgPreview");
_31.style.visibility="hidden";
_31.style.display="none";
var _32=_30.getElementById("imgPreview");
_32.style.visibility="visible";
cpvw_imageDocHandler.setPreviewDimensions(true);
};
cpvw_clsPreviewImages.prototype.previewOnLoadThumbnail=function(evt){
var _34=cpvw_previewHandler.getPreviewFrame();
var _35=_34.contentDocument;
var _36=_35.getElementById("imgPreview");
var _37=_35.getElementById("tmpImgPreview");
if(_37.style.visibility!="hidden"){
_37.style.visibility="visible";
_37.style.display="block";
_36.style.visibility="hidden";
cpvw_imageDocHandler.setPreviewDimensions(false);
}
};
cpvw_clsPreviewImages.prototype.hidePreview=function(){
conDump("Hide Timer Images"+cpvw_imageDocHandler.hideTimer);
if(cpvw_imageDocHandler.hideTimer==null){
return;
}
try{
var _38=cpvw_previewHandler.hidePreview();
if(_38){
cpvw_imageDocHandler.isShowingPreview=false;
}
}
catch(ex){
conDump("Error "+ex);
}
};
cpvw_clsPreviewImages.prototype.setPreviewDimensions=function(_39){
frmPreview=cpvw_previewHandler.getPreviewFrame();
var _3a=frmPreview.contentDocument;
var doc=this.parentDoc;
var _3c=document.getElementById("appcontent").boxObject.y+30;
var _3d=this.pageX,_3e=this.pageY;
this.dimPreview=new cpvw_previewSize();
var _3f=_3a.getElementById("imgPreview");
var _40=_3a.getElementById("tmpImgPreview");
if(_40!=null&&_40.style.display=="none"){
_39=true;
}
var _41=(_3d<doc.body.clientWidth/2)?doc.body.clientWidth-_3d-40:_3d-40;
var _42=screen.availHeight-document.getElementById("appcontent").boxObject.y-120;
var _43=_3f.width/_3f.height;
var _44=_43>_41/_42?_41:_42*_43;
var _45=_43>_41/_42?_41/_43:_42;
_44=_44>_3f.width?_3f.width:_44;
_45=_45>_3f.height?_3f.height:_45;
this.dimPreview.width=(_39)?_44:_40.width*1.5;
this.dimPreview.height=(_39)?_45:_40.height*1.5;
this.dimPreview.top=_3c+5;
if(_39){
_3f.width=_44;
_3f.height=_45;
}else{
_40.width=this.dimPreview.width;
_40.height=this.dimPreview.height;
}
if(_3d<doc.body.clientWidth/2){
this.dimPreview.left=(_3d+40)<200?200:_3d+40;
}else{
this.dimPreview.left=10;
}
this.dimPreview.width+=20;
this.dimPreview.height+=60;
if(this.dimPreview.width<500){
this.dimPreview.width=500;
}
conDump("Preview Image1 "+this.dimPreview.left+", "+this.dimPreview.top+", "+this.dimPreview.width+", "+this.dimPreview.height);
var _46=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
if(_46=="yes"){
var _47=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewLoc,"char");
if(_47.indexOf(",")!=-1){
this.dimPreview.left=parseInt(_47.split(",")[0]);
this.dimPreview.top=parseInt(_47.split(",")[1]);
}
}
cpvw_previewHandler.showPreview(this.dimPreview,this.customSite,true,true);
};
cpvw_clsPreviewImages.prototype.startPiclensLite=function(){
var doc=this.parentDoc;
if(doc.loadPiclensJS!=1){
doc.loadPiclensJS=1;
var _49=doc.createElement("script");
_49.setAttribute("type","text/javascript");
_49.setAttribute("src","http://lite.piclens.com/current/piclens.js");
var _4a=doc.getElementsByTagName("head")[0];
if(_4a!=null){
_4a.appendChild(_49);
}else{
if(doc.body!=null){
doc.body.appendChild(_49);
}
}
}
var _4b=this.parWindow;
var _4c=new Array();
var _4d=doc.getElementsByTagName("IMG");
conDump("images lenght = "+_4d.length);
for(var i=0;i<_4d.length;i++){
var img=_4d[i];
var _50=img.parentNode.href;
if(_50==null){
continue;
}
var _51=img.getAttribute("src");
var _52=_51;
if(this.customSite=="google_images"){
var _53=_50.substring(_50.indexOf("?")+1,_50.length);
var _54=_53.split("&");
for(var j=0;j<_54.length;j++){
if(_54[j].indexOf("imgurl")!=-1){
var _56=_54[j].split("=");
_52=decodeURI(_56[1]);
break;
}
}
}else{
if(this.customSite=="yahoo_images"){
if(_50.indexOf("images/view")==-1){
continue;
}
var _53=_50.substring(_50.indexOf("imgurl"),_50.length);
_53=unescape(_53);
conDump("queryString = "+_53);
var _54=_53.split("&");
for(var j=0;j<_54.length;j++){
if(_54[j].indexOf("imgurl")!=-1){
var _56=_54[j].split("=");
_52="http://"+unescape(_56[1]);
conDump("IMG URL = "+_52);
break;
}
}
}
}
_4c.push({"src":_52,"thumbnailSrc":_51});
}
setTimeout(function(){
cpvw_jsUtils.showPiclensLite(_4b,doc.title,doc.URL,_4c,false);
},1000);
};
cpvw_clsContextMenu.prototype=new cpvw_clsPreview;
function cpvw_clsContextMenu(){
this.selectStr="";
this.siteType="";
this.menuType="";
this.openDelayTime=1000;
}
cpvw_clsContextMenu.prototype.initPreviewShow=function(_57,how,evt){
cpvw_objContextMenu.clearTimer(cpvw_objContextMenu.hideTimer);
var _5a=this.selectStr;
var _5b=cpvw_contextSitesTreeView.getUrl(_57.value,_5a);
this.menuType="right-click";
if(how=="click"){
getBrowser().selectedTab=getBrowser().addTab(_5b);
evt.stopPropagation();
}
var _5c=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewEnable,"char");
if(_5c=="no"){
return;
}
if(_5b==this.linkUrl&&this.isShowingPreview){
this.setPreviewDimensions();
return;
}
this.parentDoc.addEventListener("click",cpvw_objContextMenu.initPreviewHide,false);
this.popTimer=setTimeout(function(){
cpvw_objContextMenu.showPreview(_5b,_57.value);
},this.openDelayTime);
this.dispTimer=setTimeout(function(){
cpvw_objContextMenu.displayPreview();
},this.dispDelayTime);
};
cpvw_clsContextMenu.prototype.initPreviewHide=function(evt){
cpvw_objContextMenu.clearTimer(cpvw_objContextMenu.popTimer);
cpvw_objContextMenu.clearTimer(cpvw_objContextMenu.dispTimer);
conDump("In Context Menu hide");
if(!cpvw_objContextMenu.isShowingPreview){
return;
}
cpvw_objContextMenu.hideTimer=setTimeout(function(){
cpvw_objContextMenu.hidePreview(false);
},cpvw_Delays.CLOSE_DELAY_TIME);
};
cpvw_clsContextMenu.prototype.showPreview=function(_5e,_5f){
if(this.popTimer==null){
return;
}
var _60,_61;
this.linkUrl=_5e;
this.setPreviewDimensions();
this.siteType=_5f;
cpvw_previewHandler.isContextMenu=true;
_61=cpvw_previewHandler.getPreviewFrame();
_61.setAttribute("src",this.linkUrl);
_61.removeEventListener("load",cpvw_previewHandler.pageLoad,true);
_61.addEventListener("load",cpvw_previewHandler.pageLoad,true);
this.isShowingPreview=true;
};
cpvw_clsContextMenu.prototype.displayPreview=function(){
if(this.dispTimer==null){
return;
}
if(this.dimPreview==null){
this.setPreviewDimensions();
}
cpvw_previewHandler.showPreview(this.dimPreview);
};
cpvw_clsContextMenu.prototype.setPreviewDimensions=function(){
var doc=this.parentDoc;
var _63=document.getElementById("appcontent").boxObject.y+30;
cpvw_objContextMenu.dimPreview=new cpvw_previewSize();
var _64=document.getElementById("contentAreaContextMenu");
if(_64.boxObject.x>doc.body.clientWidth/2){
cpvw_objContextMenu.dimPreview.left=10;
cpvw_objContextMenu.dimPreview.width=_64.boxObject.x-20;
}else{
cpvw_objContextMenu.dimPreview.left=_64.boxObject.x+_64.boxObject.width+10;
cpvw_objContextMenu.dimPreview.width=(doc.body.clientWidth)-(_64.boxObject.x+_64.boxObject.width)-20;
}
this.dimPreview.top=_63;
var _65=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
if(_65=="yes"){
var _66=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewLoc,"char");
if(_66.indexOf(",")!=-1){
this.dimPreview.left=parseInt(_66.split(",")[0]);
this.dimPreview.top=parseInt(_66.split(",")[1]);
}
}
this.dimPreview.height=document.getElementById("appcontent").boxObject.height-45;
};
cpvw_clsContextMenu.prototype.previewOnLoad=function(){
var _67=cpvw_objContextMenu.siteType;
var _68=cpvw_previewHandler.getPreviewFrame();
if(_68==null){
return;
}
var _69=_68.contentDocument;
if(filterSites[_67]!=null){
}
};
cpvw_clsContextMenu.prototype.highlightText=function(how){
var _6b="";
var _6c=document.getElementById("cooliris-preview-frame");
if(_6c.contentDocument!=null&&_6c.contentDocument.body!=null){
_6b=cpvw_objContextMenu.selectStr;
conDump("words = "+_6b+", "+this.customSite);
if(_6b==""){
return;
}
this.arrHighlightText=_6b.split(" ");
if(this.arrHighlightText==null){
return;
}
if(how=="show"){
for(var i=0;i<this.arrHighlightText.length;i++){
conDump("search words = "+this.arrHighlightText[i]);
this.highlightWord("#FFFF99","black",this.arrHighlightText[i],_6c.contentWindow);
}
this.doneHighlight=true;
}else{
for(var i=0;i<this.arrHighlightText.length;i++){
conDump("search words remove = "+this.arrHighlightText[i]);
this.removeHighlight(this.arrHighlightText[i],_6c.contentWindow);
}
this.doneHighlight=false;
}
}
};
function cpvw_clsFilterSites(){
this.spanNoResults="No results!";
this.headingSpan="";
this.filterWebPage=function(_6e){
};
}
var filterSites=new Array();
filterSites[0]=new cpvw_clsFilterSites();
filterSites[0].filterWebPage=function(_6f){
};
filterSites[1]=new cpvw_clsFilterSites();
filterSites[1].filterWebPage=function(_70){
for(var i=0;i<2;i++){
_70.body.removeChild(_70.body.firstChild);
}
};
filterSites[2]=new cpvw_clsFilterSites();
filterSites[2].filterWebPage=function(_72){
var _73=_72.getElementById("bodyContent").cloneNode(true);
var _74=_72.createElement("font");
_74.setAttribute("size","2");
_74.appendChild(_73);
_72.body.innerHTML="";
_72.body.appendChild(_74);
};
filterSites[3]=new cpvw_clsFilterSites();
filterSites[3].filterWebPage=function(_75){
for(var i=0;i<1;i++){
if(_75.body.firstChild){
_75.body.removeChild(_75.body.firstChild);
}
}
};
var cpvw_objContextMenu=new cpvw_clsContextMenu();

