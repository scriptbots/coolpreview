var cpvw_Delays={OPEN_DELAY_TIME:500,CLOSE_DELAY_TIME:1000,PREFETCH_DELAY_TIME:5000,DISPLAY_DELAY_TIME:800,ICON_DELAY_TIME:400,PREVIEW_ON_ICON_DELAY:500};
var cpvw_docHandler,cpvw_imageDocHandler;
var cpvw_objOverlay={hWin:null,addEventHandlers:function(){
cpvw_Prefs.initPreferences();
cpvw_previewHandler.previewOpenMode=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewOpenMode,"char");
cpvw_docHandler=new cpvw_clsPreview();
cpvw_docHandler.setup();
var _1=document.getElementById("content");
_1.addEventListener("TabSelect",function(_2){
setTimeout(function(){
cpvw_previewHandler.hidePreview(true);
cpvw_objOverlay.changeLinks();
cpvw_stackManager.displayStack(true);
},1);
},false);
gBrowser.addProgressListener(cpvw_urlListener,Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
var _3=document.getElementById("content");
_3.addEventListener("load",function(_4){
var _5=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewEnable,"char");
if(_5=="no"){
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/globaloff.jpg";
return;
}
if("@mozilla.org/login-manager;1" in Components.classes){
}
var _6;
var _7=cpvw_objOverlay.getContentDocument();
var _8=new XPCNativeWrapper(_4,"originalTarget").originalTarget;
if(_7==_8){
cpvw_objOverlay.changeLinks(_7);
}
},true);
if(document.getElementById("contentAreaContextMenu")!=null){
document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",function(_9){
cpvw_objOverlay.previewContextMenuPopup();
},false);
}
var _a="2.7";
if(cpvw_prefHandler.isExists(cpvw_Prefs.prefPreviewIsNew,"char")==false){
cpvw_objStats.isInstalledOrUpdated(0);
setTimeout(function(){
getBrowser().selectedTab=getBrowser().addTab("http://www.coolpreviews.com/client/links/welcome.html");
},1000);
}else{
if(cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewIsNew,"char").toString()!=_a.toString()){
cpvw_objStats.isInstalledOrUpdated(1);
setTimeout(function(){
getBrowser().selectedTab=getBrowser().addTab("http://www.coolpreviews.com/client/links/upgrade.html");
},1000);
}
}
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewIsNew,_a,"char");
},removeEventHandlers:function(){
gBrowser.removeProgressListener(cpvw_urlListener);
},createBrowser:function(){
var _b=document.getElementById("cooliris-preview-frame");
var _c;
try{
_c=_b.webNavigation;
if(!_c){
throw "no XBL binding for browser";
}
}
catch(e){
alert("Error launching browser window:"+e);
window.close();
return;
}
_b.setAttribute("disablehistory",false);
_c.sessionHistory=Components.classes["@mozilla.org/browser/shistory;1"].createInstance(Components.interfaces.nsISHistory);
},changeLinks:function(){
var _d=cpvw_objOverlay.getContentDocument();
if(_d.fromCache!=null){
if(_d.enablePreview){
cpvw_docHandler.parentDoc=_d;
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-on.png";
return;
}
}
var _d=cpvw_objOverlay.getContentDocument();
cpvw_docHandler.parentDoc=_d;
cpvw_docHandler.curIndex=0;
var _e=cpvw_siteManager.isCustomSite(_d.location.href);
cpvw_docHandler.parentDoc.enablePreview=false;
if(_e[0]){
_d.fromCache=true;
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-on.png";
if(_d.isChanged==null){
var _f=_e[1];
cpvw_previewHandler.customSite=_f;
if(_f=="google_images"||_f=="yahoo_images"){
_d.isChanged="yes";
delete cpvw_imageDocHandler;
cpvw_imageDocHandler=new cpvw_clsPreviewImages(_d,_f);
cpvw_imageDocHandler.setup();
cpvw_imageDocHandler.parWindow=cpvw_objOverlay.getContentWindow();
cpvw_imageDocHandler.parentDoc.enablePreview=true;
}else{
_d.isChanged="yes";
cpvw_docHandler.customSite=_f;
cpvw_docHandler.parWindow=cpvw_objOverlay.getContentWindow();
cpvw_docHandler.parentDoc.enablePreview=true;
cpvw_docHandler.parentDoc.arrHighlightText="";
if(_f=="google_search"){
var _10=_d.location.href;
var _11=null;
var _12=_10.match(/[&|?]q=(.*?)&/);
if(_12!=null&&_12.length>1){
_11=_12[1].split("+");
}
cpvw_docHandler.parentDoc.arrHighlightText=_11;
conDump("Search words = "+cpvw_docHandler.parentDoc.arrHighlightText);
var _13=cpvw_docHandler.parentDoc.isPrefetchSet;
if(_13==null||_13==false){
var _14=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewPrefetch,"char");
if(_14=="yes"){
cpvw_docHandler.parentDoc.isPrefetchSet=true;
cpvw_docHandler.startPrefetch();
}
}
}else{
if(_f=="yahoo_search"){
var _13=cpvw_docHandler.parentDoc.isPrefetchSet;
if(_13==null||_13==false){
var _14=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewPrefetch,"char");
if(_14=="yes"){
cpvw_docHandler.parentDoc.isPrefetchSet=true;
cpvw_docHandler.startPrefetch();
}
}
}
}
cpvw_docHandler.convertLinks();
}
}else{
cpvw_docHandler.parentDoc.enablePreview=true;
}
}else{
cpvw_docHandler.parentDoc.enablePreview=false;
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-off.png";
}
},contextMenus:["thefreedictionary","GoogleImages","Wicktionary","GoogleSearch"],previewContextMenuPopup:function(){
var _15=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewEnable,"char");
if(cpvw_objContextMenu.isShowingPreview){
return;
}
var _16=document.commandDispatcher.focusedWindow;
var _17=_16.getSelection.call(_16);
cpvw_objContextMenu.parentDoc=document.commandDispatcher.focusedWindow.document;
_17=cpvw_jsUtils.trimWhitespace(_17.toString());
var _18=document.getElementById("coolirisSearch");
if(_17==""||_15=="no"){
_18.hidden=true;
}else{
_18.hidden=false;
}
cpvw_objContextMenu.selectStr=_17;
},getContentDocument:function(){
return getBrowser().mCurrentBrowser.contentDocument;
},getContentWindow:function(){
return getBrowser().mCurrentBrowser.contentWindow;
}};
var cpvw_previewHandler={pushpin:false,isSendToOpen:false,isContextMenu:false,dragActive:false,resizeActive:false,dimPreview:null,curMouseLocX:0,curMouseLocY:0,sendToBoxLink:"http://www.coolpreviews.com/client/scripts/sendto.php",registrationLink:"http://www.coolpreviews.com/client/scripts/registration.htm",loginLink:"http://www.coolpreviews.com/client/scripts/login.htm",fontSize:1,hWin:null,startTime:(new Date()).getTime(),handleKeyPress:function(evt){
conDump("Key Press = "+evt.keyCode+", "+evt.charCode);
if(evt.keyCode==27){
cpvw_previewHandler.hidePreview(true);
}else{
if(evt.keyCode==112){
cpvw_previewHandler.togglePushPin();
evt.preventDefault();
}else{
if(evt.altKey&&evt.keyCode==40){
cpvw_previewHandler.gotoNextLink();
evt.preventDefault();
}else{
if(evt.altKey&&evt.charCode==61){
cpvw_previewHandler.doZoom("increase");
evt.preventDefault();
}else{
if(evt.altKey&&evt.charCode==45){
cpvw_previewHandler.doZoom("decrease");
evt.preventDefault();
}else{
if(((evt.metaKey||evt.ctrlKey)&&evt.keyCode==8)||(evt.altKey&&evt.keyCode==37)){
cpvw_previewHandler.goBack(evt);
evt.preventDefault();
}else{
if((evt.metaKey||evt.ctrlKey)&&evt.charCode==100){
cpvw_previewHandler.addBookmark();
evt.preventDefault();
}else{
if((evt.metaKey||evt.ctrlKey)&&evt.charCode==103){
cpvw_previewHandler.highlight();
evt.preventDefault();
}
}
}
}
}
}
}
}
},hidePreview:function(_1a){
conDump("hide preview = "+_1a+", "+cpvw_previewHandler.dragActive);
if((cpvw_previewHandler.pushpin||cpvw_previewHandler.sticky||cpvw_previewHandler.dragActive||cpvw_previewHandler.resizeActive)&&_1a!=true){
return false;
}
conDump("in hidepreview ");
cpvw_previewHandler.removeDragResizeEventHandlers();
var _1b=document.getElementById("cooliris-preview-frame");
_1b.setAttribute("src","chrome://cooliris/content/coolirisBlank.htm");
if(cpvw_docHandler){
var _1c=((new Date()).getTime()-this.startTime)/1000;
cpvw_objStats.incrementDuration(Math.ceil(_1c));
conDump("time elapsed = "+_1c);
var _1b=this.getPreviewFrame();
var _1d=_1b.webNavigation.sessionHistory;
var _1e=0;
if(_1d!=null){
_1e=_1d.count;
}
if(_1e!=0){
cpvw_objStats.incrementPageCounter(_1e);
}
}
var _1f=document.getElementById("cooliris-preview-overlay");
_1f.hidden=true;
_1f.setAttribute("style","display:none");
if(cpvw_docHandler){
cpvw_docHandler.isShowingPreview=false;
if(cpvw_docHandler.parentDoc!=null){
cpvw_docHandler.parentDoc.removeEventListener("click",cpvw_previewHandler.hidePreview,true);
}
CoolirisFramePanel.closeSendToOptions();
}
window.removeEventListener("keypress",cpvw_previewHandler.handleKeyPress,false);
return true;
},showPreview:function(_20,_21,_22,_23){
conDump("show previews ==== "+_20);
if(_20==null){
return;
}
var _24=document.getElementById("cooliris-preview-overlay");
conDump("IN ACTUAL SHOW PREVIEW "+_24.hidden+", "+_23);
if(_24.hidden==false&&!_23){
return;
}
var _25=document.getElementById("cooliris-preview-frame");
_24.hidden=false;
cpvw_previewHandler.dimPreview=_20;
cpvw_previewHandler.setThemeToolbar();
cpvw_objStats.incrementCounter();
this.startTime=(new Date()).getTime();
conDump("IN ACTUAL SHOW PREVIEW1 "+_20.left+", "+_20.top+", "+_20.width+", "+_20.height);
if(_20.width!=0&&!_22){
cpvw_previewHandler.changeDimensions(_20.left,_20.top,_20.width,1);
var _26=new cooliris_wc_clsWebControl(_24,new cooliris_wc_Point(_20.left,_20.top),new cooliris_wc_Point(_20.left,_20.top),"expand");
_26.setDim(new cooliris_wc_Dim(_20.width,20),new cooliris_wc_Dim(_20.width,_20.height));
_26.callback=cpvw_previewHandler.changeDimensions;
_26.maxTimes=5;
setTimeout(function(){
_26.expand();
},0);
}else{
_25.style.display="block";
cpvw_previewHandler.changeDimensions(_20.left,_20.top,_20.width,_20.height);
}
window.addEventListener("keypress",cpvw_previewHandler.handleKeyPress,false);
cpvw_objOverlay.createBrowser();
cpvw_previewHandler.updatePushpinIcon();
},setThemeToolbar:function(){
var _27=cpvw_prefHandler.getPref(cpvw_Prefs.prefTheme);
var url="chrome://cooliris/skin/new/";
switch(_27){
case "ice":
url+="fill-ice.png";
break;
case "grape":
url+="fill-grape-blue.png";
break;
case "forest":
url+="fill-forest.png";
break;
case "black":
url+="fill-black.png";
break;
case "orange":
url+="fill-orange.png";
break;
case "mint":
url+="fill-mint.png";
break;
case "gray":
url+="fill-gray.png";
break;
case "rust":
url+="fill-rust.png";
break;
case "xp":
url+="fill-xp.png";
break;
case "default":
url+="fill-blue.png";
break;
}
if(cpvw_get("cooliris-preview-toolbar")){
cpvw_get("cooliris-preview-toolbar").style.backgroundImage="url("+url+")";
cpvw_get("cooliris-preview-toolbar").style.backgroundRepeat="repeat-x";
}
},getPreviewFrame:function(){
return document.getElementById("cooliris-preview-frame");
},mouseOver:function(evt){
if(this.isContextMenu){
cpvw_objContextMenu.clearTimer(cpvw_objContextMenu.hideTimer);
}else{
var _2a=evt.relatedTarget;
var _2b=cpvw_previewHandler.getPreviewFrame();
var _2c=cpvw_get("cooliris-preview-overlay");
conDump("mouseOver = "+evt.screenX+", "+evt.screenY+" == "+_2c.boxObject.screenX+", "+_2c.boxObject.screenY+", "+_2c.boxObject.width+", "+_2c.boxObject.height+" ;; "+(evt.screenX>=_2c.boxObject.screenX&&evt.screenX<(_2c.boxObject.screenX+_2c.boxObject.width))+" ;; "+((evt.screenY)>=_2c.boxObject.screenY)+";; "+(evt.screenY<=(_2c.boxObject.screenY+_2c.boxObject.height+1)));
if(!(evt.screenX>=_2c.boxObject.screenX&&evt.screenX<(_2c.boxObject.screenX+_2c.boxObject.width)&&(evt.screenY)>=_2c.boxObject.screenY&&evt.screenY<=(_2c.boxObject.screenY+_2c.boxObject.height+1))){
return;
}
if(cpvw_docHandler){
if(cpvw_stackManager.tabStackCount>0){
cpvw_stackManager.previewMouseOver=true;
}
cpvw_docHandler.clearTimer(cpvw_docHandler.hideTimer);
}
if(cpvw_imageDocHandler){
cpvw_imageDocHandler.clearTimer(cpvw_imageDocHandler.hideTimer);
}
}
},mouseOut:function(evt){
if(document.getElementById("contentAreaContextMenu").state=="open"){
return;
}
if(this.isContextMenu){
cpvw_objContextMenu.initPreviewHide(evt);
}else{
var _2e=evt.relatedTarget;
var _2f=cpvw_previewHandler.getPreviewFrame();
var _30=cpvw_get("cooliris-preview-overlay");
conDump("mouseOut123 = "+evt.screenX+", "+evt.screenY+", "+" == "+cpvw_get("cooliris-preview-overlay").boxObject.screenX+", "+cpvw_get("cooliris-preview-overlay").boxObject.screenY);
if(evt.screenX>_30.boxObject.screenX&&evt.screenX<(_30.boxObject.screenX+_30.boxObject.width)&&evt.screenY>_30.boxObject.screenY&&evt.screenY<=(_30.boxObject.screenY+_30.boxObject.height)){
return;
}
if(cpvw_docHandler){
cpvw_docHandler.clearHideTimer();
cpvw_docHandler.initPreviewHide(evt);
}
if(cpvw_imageDocHandler){
cpvw_imageDocHandler.initPreviewHide(evt);
}
}
},previewFrameKeyPress:function(evt){
},pageLoad:function(evt){
conDump("Page LOAD");
var _33=document.getElementById("cooliris-preview-overlay");
if(_33.hidden){
return;
}
var _34=cpvw_previewHandler.getPreviewFrame();
_34.style.display="block";
var _35=_34.contentDocument;
if(_35.isPageLoad){
return;
}
if(cpvw_previewHandler.isContextMenu){
cpvw_objContextMenu.previewOnLoad(evt);
}else{
if(cpvw_docHandler){
cpvw_docHandler.previewOnLoad(evt);
_35.isPageLoad=true;
}
}
},gotoNextLink:function(){
cpvw_docHandler.displayNextLink();
},goBack:function(evt){
var _37=cpvw_previewHandler.getPreviewFrame();
if(_37.webNavigation.canGoBack){
_37.webNavigation.goBack();
}
},openLink:function(evt){
try{
var _39=cpvw_objOverlay.getContentDocument();
var url="",_3b;
if(cpvw_previewHandler.isContextMenu){
url=cpvw_objContextMenu.linkUrl;
}else{
if(cpvw_docHandler){
_3b=cpvw_previewHandler.getPreviewFrame();
var _3c=_3b.contentDocument;
url=_3c.URL;
if(url=="chrome://cooliris/content/coolirisPreviewImages.htm"){
var doc=_3b.contentDocument;
if(doc.getElementById("imgPreview").style.visibility=="visible"){
url=doc.getElementById("imgPreview").getAttribute("src");
}else{
url=doc.getElementById("tmpImgPreview").getAttribute("src");
}
}
var _3e=_3b.webNavigation.sessionHistory;
}
}
if(url==""){
return;
}
cpvw_previewHandler.hidePreview(true);
if(_3e){
var _3f=_3e.SHistoryEnumerator;
}
getBrowser().selectedTab=getBrowser().addTab(url);
if(_3b!=null&&_3e!=null){
getBrowser().selectedBrowser.swapDocShells(_3b);
}
evt.stopPropagation();
}
catch(e){
throw e;
}
},doZoom:function(how){
if(cpvw_docHandler){
frmPreview=cpvw_previewHandler.getPreviewFrame();
try{
var _41=frmPreview.markupDocumentViewer.textZoom;
if(how=="increase"){
_41+=0.1;
}else{
if(how=="decrease"){
_41-=0.1;
}else{
_41=1;
}
}
if(_41<0.2||_41>5){
return;
}
frmPreview.markupDocumentViewer.textZoom=_41;
cpvw_prefHandler.setPref(cpvw_Prefs.prefTextZoom,_41,"char");
conDump("zoom = "+frmPreview.markupDocumentViewer.textZoom);
cpvw_docHandler.clearHideTimer();
}
catch(ex){
alert(ex);
}
}
},addToStack:function(how){
try{
if(how=="link"){
var url;
var _44=new cpvw_nsNodeType();
_44.getNodeType();
if(_44.onImage){
url=_44.linkURL;
if(url==""){
url=_44.imageURL;
}
}else{
if(_44.onLink){
url=_44.linkURL;
}else{
url=document.popupNode.ownerDocument.location.href;
}
}
if(url!=""){
cpvw_stackManager.addToStack(null,url);
}
}else{
var _45;
if(cpvw_docHandler){
frmPreview=cpvw_previewHandler.getPreviewFrame();
var _46=frmPreview.contentDocument;
var url=_46.URL;
if(url.indexOf("chrome://cooliris/content/coolirisPreviewImages.htm")!=-1){
var doc=frmPreview.contentDocument;
url=doc.getElementById("imgPreview").getAttribute("src");
}
var _48=_46.title;
_45=frmPreview.contentWindow;
if(!cpvw_previewHandler.isLoaded){
cpvw_stackManager.addToStack(null,url);
}else{
cpvw_stackManager.addToStack(_45,url);
}
}
}
}
catch(e){
alert(e);
}
},highlight:function(how){
if(cpvw_previewHandler.isContextMenu){
if(!cpvw_objContextMenu.doneHighlight){
cpvw_objContextMenu.highlightText("show");
}else{
cpvw_objContextMenu.highlightText("hide");
}
}else{
if(cpvw_docHandler){
if(!cpvw_docHandler.doneHighlight){
cpvw_docHandler.highlightText("show",cpvw_previewHandler.isContextMenu);
}else{
cpvw_docHandler.highlightText("hide",cpvw_previewHandler.isContextMenu);
}
}
}
},openCoolirisWebsite:function(evt){
cpvw_previewHandler.hidePreview(true);
getBrowser().selectedTab=getBrowser().addTab("http://www.coolpreviews.com/client/links/support.html");
evt.preventDefault();
evt.stopPropagation();
},toggleLocation:function(){
var _4b=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
if(_4b=="yes"){
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewFixedLoc,"no","char");
}else{
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewFixedLoc,"yes","char");
cpvw_Prefs.setPreviewLoc(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top);
}
},togglePushPin:function(){
if(cpvw_previewHandler.pushpin){
cpvw_previewHandler.pushpin=false;
}else{
cpvw_previewHandler.pushpin=true;
}
cpvw_previewHandler.updatePushpinIcon();
},updateLocationIcon:function(){
var _4c=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
if(_4c=="yes"){
document.getElementById("cooliris_fixedLoc").setAttribute("src","chrome://cooliris/skin/new/lock.gif");
}else{
document.getElementById("cooliris_fixedLoc").setAttribute("src","chrome://cooliris/skin/new/unlock.gif");
}
},updatePushpinIcon:function(){
if(cpvw_previewHandler.pushpin){
document.getElementById("cooliris_pushPin").setAttribute("locked","yes");
}else{
document.getElementById("cooliris_pushPin").removeAttribute("locked");
}
},stickPreview:function(how){
cpvw_previewHandler.sticky=how;
},startFrameDrag:function(evt){
if(cpvw_previewHandler.dragActive){
return;
}
cpvw_previewHandler.curMouseLocX=evt.screenX;
cpvw_previewHandler.curMouseLocY=evt.screenY;
document.getElementById("cooliris-toolbar").style.cursor="-moz-grabbing";
document.getElementById("cooliris_statusbar").style.cursor="-moz-grabbing";
window.addEventListener("mouseup",cpvw_previewHandler.stopFrameDrag,true);
window.addEventListener("mousemove",cpvw_previewHandler.moveFrame,true);
cpvw_previewHandler.dragActive=true;
},stopFrameDrag:function(evt){
if(!cpvw_previewHandler.dragActive){
return;
}
window.removeEventListener("mouseup",cpvw_previewHandler.stopFrameDrag,true);
window.removeEventListener("mousemove",cpvw_previewHandler.moveFrame,true);
cpvw_previewHandler.changeDimensions(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top,cpvw_previewHandler.dimPreview.width,cpvw_previewHandler.dimPreview.height,true);
document.getElementById("cooliris-toolbar").style.cursor="";
document.getElementById("cooliris_statusbar").style.cursor="";
cpvw_Prefs.setPreviewLoc(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top);
cpvw_previewHandler.dragActive=false;
},moveFrame:function(evt){
if(!cpvw_previewHandler.dragActive){
return;
}
cpvw_previewHandler.dimPreview.left+=evt.screenX-cpvw_previewHandler.curMouseLocX;
cpvw_previewHandler.dimPreview.top+=evt.screenY-cpvw_previewHandler.curMouseLocY;
cpvw_previewHandler.curMouseLocX=evt.screenX;
cpvw_previewHandler.curMouseLocY=evt.screenY;
cpvw_previewHandler.changeDimensions(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top,cpvw_previewHandler.dimPreview.width,cpvw_previewHandler.dimPreview.height,true);
},startResize:function(evt){
if(cpvw_previewHandler.resizeActive){
return;
}
cpvw_previewHandler.curMouseLocX=evt.screenX;
cpvw_previewHandler.curMouseLocY=evt.screenY;
document.getElementById("main-window").addEventListener("mouseup",cpvw_previewHandler.stopResize,true);
document.getElementById("main-window").addEventListener("mousemove",cpvw_previewHandler.doResize,true);
cpvw_previewHandler.resizeActive=true;
},stopResize:function(evt){
if(!cpvw_previewHandler.resizeActive){
return;
}
cpvw_previewHandler.dimPreview.width+=evt.screenX-cpvw_previewHandler.curMouseLocX;
cpvw_previewHandler.dimPreview.height+=evt.screenY-cpvw_previewHandler.curMouseLocY;
if(cpvw_previewHandler.dimPreview.width<500){
cpvw_previewHandler.dimPreview.width=500;
}else{
if(cpvw_previewHandler.dimPreview.width>window.outerWidth-40){
cpvw_previewHandler.dimPreview.width=window.outerWidth-40;
}
}
if(cpvw_previewHandler.dimPreview.height<100){
cpvw_previewHandler.dimPreview.height=100;
}else{
if(cpvw_previewHandler.dimPreview.height>window.outerHeight-20){
cpvw_previewHandler.dimPreview.height=window.outerHeight-20;
}
}
document.getElementById("main-window").removeEventListener("mouseup",cpvw_previewHandler.stopResize,true);
document.getElementById("main-window").removeEventListener("mousemove",cpvw_previewHandler.doResize,true);
cpvw_previewHandler.changeDimensions(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top,cpvw_previewHandler.dimPreview.width,cpvw_previewHandler.dimPreview.height,true);
cpvw_previewHandler.saveTipSize();
cpvw_previewHandler.resizeActive=false;
},removeDragResizeEventHandlers:function(){
document.getElementById("main-window").removeEventListener("mouseup",cpvw_previewHandler.stopResize,true);
document.getElementById("main-window").removeEventListener("mousemove",cpvw_previewHandler.doResize,true);
document.getElementById("main-window").removeEventListener("mouseup",cpvw_previewHandler.stopResizeLeft,true);
document.getElementById("main-window").removeEventListener("mousemove",cpvw_previewHandler.doResizeLeft,true);
window.removeEventListener("mouseup",cpvw_previewHandler.stopFrameDrag,true);
window.removeEventListener("mousemove",cpvw_previewHandler.moveFrame,true);
},doResize:function(evt){
if(!cpvw_previewHandler.resizeActive){
return;
}
var _54=cpvw_previewHandler.dimPreview.width+evt.screenX-cpvw_previewHandler.curMouseLocX;
var _55=cpvw_previewHandler.dimPreview.height+evt.screenY-cpvw_previewHandler.curMouseLocY;
if(_54<500||_54>window.outerWidth-20||_55<100||_55>window.outerHeight-10){
return;
}
conDump("resize = "+_54);
cpvw_previewHandler.changeDimensions(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top,_54,_55,true);
},startResizeLeft:function(evt){
if(cpvw_previewHandler.resizeActive){
return;
}
cpvw_previewHandler.curMouseLocX=evt.screenX;
cpvw_previewHandler.curMouseLocY=evt.screenY;
document.getElementById("main-window").addEventListener("mouseup",cpvw_previewHandler.stopResizeLeft,true);
document.getElementById("main-window").addEventListener("mousemove",cpvw_previewHandler.doResizeLeft,true);
cpvw_previewHandler.resizeActive=true;
},stopResizeLeft:function(evt){
if(!cpvw_previewHandler.resizeActive){
return;
}
cpvw_previewHandler.dimPreview.width=cpvw_previewHandler.dimPreview.width-(evt.screenX-cpvw_previewHandler.curMouseLocX);
cpvw_previewHandler.dimPreview.height+=evt.screenY-cpvw_previewHandler.curMouseLocY;
cpvw_previewHandler.dimPreview.left+=(evt.screenX-cpvw_previewHandler.curMouseLocX);
if(cpvw_previewHandler.dimPreview.width<500){
cpvw_previewHandler.dimPreview.width=500;
}else{
if(cpvw_previewHandler.dimPreview.width>window.outerWidth-40){
cpvw_previewHandler.dimPreview.width=window.outerWidth-40;
}
}
if(cpvw_previewHandler.dimPreview.height<100){
cpvw_previewHandler.dimPreview.height=100;
}else{
if(cpvw_previewHandler.dimPreview.height>window.outerHeight-20){
cpvw_previewHandler.dimPreview.height=window.outerHeight-20;
}
}
document.getElementById("main-window").removeEventListener("mouseup",cpvw_previewHandler.stopResizeLeft,true);
document.getElementById("main-window").removeEventListener("mousemove",cpvw_previewHandler.doResizeLeft,true);
cpvw_previewHandler.changeDimensions(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top,cpvw_previewHandler.dimPreview.width,cpvw_previewHandler.dimPreview.height,true);
cpvw_previewHandler.saveTipSize();
cpvw_Prefs.setPreviewLoc(cpvw_previewHandler.dimPreview.left,cpvw_previewHandler.dimPreview.top);
cpvw_previewHandler.resizeActive=false;
},doResizeLeft:function(evt){
if(!cpvw_previewHandler.resizeActive){
return;
}
var _59=cpvw_previewHandler.dimPreview.height+evt.screenY-cpvw_previewHandler.curMouseLocY;
var _5a=cpvw_previewHandler.dimPreview.left+(evt.screenX-cpvw_previewHandler.curMouseLocX);
var _5b=cpvw_previewHandler.dimPreview.width-(_5a-cpvw_previewHandler.dimPreview.left);
if(_5b<500||_5b>window.outerWidth-20||_59<100||_59>window.outerHeight-10){
return;
}
cpvw_previewHandler.changeDimensions(_5a,cpvw_previewHandler.dimPreview.top,_5b,_59,true);
},saveTipSize:function(){
cpvw_Prefs.setPreviewSize(cpvw_previewHandler.dimPreview.width,cpvw_previewHandler.dimPreview.height);
},changeDimensions:function(_5c,top,_5e,_5f,_60){
conDump("CHANGE DIMENSIONS SCREEN WDITH = "+_5c+", "+top+", "+_5e+", "+_5f);
var _61=getBrowser().selectedTab.getAttribute("coolirispreviews_dispStack");
if(top<0){
top=2;
}
if(top>(cpvw_get("appcontent").boxObject.y+cpvw_get("appcontent").boxObject.height)-60){
top=(cpvw_get("appcontent").boxObject.y+cpvw_get("appcontent").boxObject.height)-60;
}
if(top+_5f>cpvw_get("appcontent").boxObject.y+cpvw_get("appcontent").boxObject.height){
_5f=(cpvw_get("appcontent").boxObject.y+cpvw_get("appcontent").boxObject.height)-top-5;
}
if(_5c+_5e>cpvw_get("appcontent").boxObject.x+cpvw_get("appcontent").boxObject.width){
_5e=(cpvw_get("appcontent").boxObject.x+cpvw_get("appcontent").boxObject.width)-_5c-15;
}
if(_61=="show"){
var _62=cpvw_get("appcontent").boxObject.x+cpvw_get("appcontent").boxObject.width-118-30;
if(_5c+_5e>_62){
_5e=_62-_5c-10;
}
}
if(_5e<0){
_5e=2;
}
cpvw_jsUtils.setPosition("cooliris-toolbar",null,null,_5e-2,null,_60);
cpvw_jsUtils.setPosition("cooliris-preview-overlay",_5c,top,_5e,_5f,_60);
cpvw_jsUtils.setPosition("cooliris-border-frame",_5c+1,top+1,_5e-2,_5f-6,true);
conDump("FINAL DIMENSIONS = "+_5c+", "+top+", "+_5e+", "+_5f);
cpvw_jsUtils.setPosition("cooliris-preview-frame",0,0,_5e-2,_5f-42,true);
if(CoolirisFramePanel.isSendToOpen&&CoolirisFramePanel.fromPreview){
sendToFrameLeft=_5c+90;
sendToFrameTop=top+27;
if(cpvw_get("cooliris_sendToBox")){
sendToFrameWidth=cpvw_get("cooliris_sendToBox").style.width;
sendToFrameHeight=cpvw_get("cooliris_sendToBox").style.height;
cpvw_jsUtils.setPosition(cpvw_get("cooliris_sendToBox"),sendToFrameLeft,sendToFrameTop,sendToFrameWidth,sendToFrameHeight,true);
}
}
},addBookmark:function(){
if(typeof addBookmarkAs=="function"){
addBookmarkAs(cpvw_previewHandler.getPreviewFrame(),false);
}
},openPiclensLite:function(evt){
if(cpvw_previewHandler.customSite=="google_images"||cpvw_previewHandler.customSite=="yahoo_images"){
cpvw_objStats.incrementPiclensLiteCounter();
cpvw_imageDocHandler.customSite=cpvw_previewHandler.customSite;
cpvw_imageDocHandler.startPiclensLite();
}else{
getBrowser().selectedTab=getBrowser().addTab("http://www.piclens.com/welcome/welcome_cp_lite_pre.php");
}
}};
var cpvw_urlListener={QueryInterface:function(_64){
if(_64.equals(Components.interfaces.nsIWebProgressListener)||_64.equals(Components.interfaces.nsISupportsWeakReference)||_64.equals(Components.interfaces.nsISupports)){
return this;
}
throw Components.results.NS_NOINTERFACE;
},onLocationChange:function(_65,_66,_67){
var _68=cpvw_objOverlay.getContentDocument();
if(_68.fromCache!=null){
if(_68.enablePreview){
cpvw_docHandler.parentDoc=_68;
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-on.png";
}
}
},onStateChange:function(){
},onProgressChange:function(){
},onStatusChange:function(){
},onSecurityChange:function(){
},onLinkIconAvailable:function(){
}};
function cpvw_previewSize(_69,top,_6b,_6c){
this.left=_69;
this.top=top;
this.width=_6b;
this.height=_6c;
this.conDump=function(){
conDump("Left: "+this.left+", Top: "+this.top+", Width = "+this.width+", Height: "+this.height);
};
}
window.addEventListener("load",cpvw_objOverlay.addEventHandlers,false);
window.addEventListener("unload",cpvw_objOverlay.removeEventHandlers,false);
window.addEventListener("resize",function(evt){
if(evt.target==window){
if(!(evt.target instanceof HTMLDocument)){
cpvw_stackManager.displayStack();
}
}
},false);

