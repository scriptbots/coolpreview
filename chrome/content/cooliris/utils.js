function cpvw_WebResponse(_1,_2){
this.eId=_1;
this.eMesg=_2;
this.results=null;
this.auxObj=null;
this.headers=null;
function SetError(_3,_4){
this.eId=_3;
this.eMesg=_4;
}
}
if(typeof cpvw_Prefs=="undefined"){
var cpvw_Prefs={prefPreviewSize:"preview.size",prefPreviewEnable:"preview.enable",prefPreviewPrefetch:"preview.prefetch",prefPreviewEmailFrom:"preview.emailfrom",prefPreviewEmailTo:"preview.emailto",prefPreviewDefaultEnable:"preview.defaultenable",prefPreviewUserEmail:"preview.useremail",prefPreviewDebug:"preview.debug",prefPreviewIsNew:"preview.isnew",prefPreviewOpenMode:"preview.previewopenmode",prefPreviewOpenDelay:"preview.previewopendelay",prefMouseIconDelay:"preview.mouseIconDelay",prefPreviewOnIconDelay:"preview.previewOnIconDelay",prefHidePreviewDelay:"preview.hidePreviewDelay",prefPreviewLoc:"preview.location",prefPreviewFixedLoc:"preview.fixedlocation",prefFixedIcon:"preview.fixedMouseoverIcon",prefCMenuItems:"preview.contextMenuItems",prefTextZoom:"preview.textZoom",prefTheme:"preview.theme",applyBrowserZoom:"preview.applyBrowserZoom",prefGUID:"preview.GUID",prefTimestamp:"preview.timestamp",prefCount:"preview.previewcount",prefStackCount:"preview.stackcount",prefPiclensFilterSize:"preview.piclensFilterSize",prefPiclensCount:"preview.piclenscount",prefPreviewDuration:"preview.previewduration",prefPreviewPages:"preview.previewpages",populatePreviewBarDropDown:function(_5){
while(cpvw_get("cpvw_bar_sites",_5).length>0){
cpvw_get("cpvw_bar_sites",_5).remove(0);
}
var _6=cpvw_prefHandler.getPref(cpvw_Prefs.prefCMenuItems,"char");
var _7=_6.split(",");
if(cpvw_contextSitesTreeView.arrCMenuItems==null){
cpvw_contextSitesTreeView.loadContextSites();
}
var _8="";
for(var _9 in cpvw_contextSitesTreeView.arrCMenuItems){
_8+=_9+", ";
}
conDump("cmenu items length "+_8+":::"+_6);
for(var i=0;i<_7.length;i++){
if(cpvw_contextSitesTreeView.arrCMenuItems[_7[i]]!=null){
var _b=_5.createElement("option");
_b.text=cpvw_contextSitesTreeView.arrCMenuItems[_7[i]].label;
_b.value=i;
cpvw_get("cpvw_bar_sites",_5).add(_b,null);
}
}
},setCMenuItems:function(){
while(cpvw_get("coolirisSearchPopup").childNodes.length>0){
cpvw_get("coolirisSearchPopup").removeChild(cpvw_get("coolirisSearchPopup").firstChild);
}
var _c=cpvw_prefHandler.getPref(cpvw_Prefs.prefCMenuItems,"char");
var _d=_c.split(",");
if(cpvw_contextSitesTreeView.arrCMenuItems==null){
cpvw_contextSitesTreeView.loadContextSites();
}
var _e="";
for(var _f in cpvw_contextSitesTreeView.arrCMenuItems){
_e+=_f+", ";
}
conDump("cmenu items length "+_e+":::"+_c);
for(var i=0;i<_d.length;i++){
if(cpvw_contextSitesTreeView.arrCMenuItems[_d[i]]!=null){
var _11=document.createElement("menuitem");
_11.setAttribute("label",cpvw_contextSitesTreeView.arrCMenuItems[_d[i]].label);
_11.setAttribute("image",cpvw_contextSitesTreeView.arrCMenuItems[_d[i]].image);
_11.setAttribute("value",i);
_11.setAttribute("class","menuitem-iconic");
_11.addEventListener("click",function(evt){
cpvw_objContextMenu.initPreviewShow(this,"click",evt);
},false);
_11.addEventListener("mouseover",function(evt){
cpvw_objContextMenu.initPreviewShow(this);
},false);
_11.addEventListener("mouseout",function(evt){
cpvw_objContextMenu.initPreviewHide();
},false);
cpvw_get("coolirisSearchPopup").appendChild(_11);
}
}
},setSendToEmail:function(to){
cpvw_prefHandler.setPref(this.prefPreviewEmailTo,to,"char");
},defaultEnable:function(){
var _16=cpvw_prefHandler.getPref(this.prefPreviewDefaultEnable,"char");
var _17;
if(_16=="yes"){
cpvw_prefHandler.setPref(this.prefPreviewDefaultEnable,"no","char");
_17="Default Enable is now Off. This means that Cooliris Previews will now work only on the sites \n selected by Cooliris along with the ones that you have enabled explicitly";
}else{
cpvw_prefHandler.setPref(this.prefPreviewDefaultEnable,"yes","char");
_17="Default Enable is now On. This means that Cooliris Previews will now work for all sites \n on the world wide web except for the ones you have disabled explicitly.";
}
alert(_17);
},getSendToEmail:function(){
var to="";
if(cpvw_prefHandler.isExists(this.prefPreviewEmailTo)){
to=cpvw_prefHandler.getPref(this.prefPreviewEmailTo);
}
return to;
},togglePreviewSite:function(evt){
var _1a=cpvw_objOverlay.getContentDocument();
var url=_1a.location.href;
var _1c="yes";
var _1d=cpvw_siteManager.isIncludedSite(url);
if(_1d[0]){
_1c="no";
}
var _1e=cpvw_prefHandler.getPref(this.prefPreviewEnable,"char");
if(_1e=="no"){
_1c="yes";
}
cpvw_siteManager.editSite(url,_1c);
conDump(_1c+", "+_1e+", "+_1d[0]);
if(_1c=="yes"){
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-on.png";
var _1a=cpvw_objOverlay.getContentDocument();
cpvw_objOverlay.changeLinks(_1a);
if(cpvw_docHandler){
cpvw_docHandler.parentDoc.enablePreview=true;
}
if(cpvw_imageDocHandler){
cpvw_imageDocHandler.parentDoc.enablePreview=true;
}
}else{
if(cpvw_imageDocHandler){
cpvw_imageDocHandler.parentDoc.enablePreview=false;
}
if(cpvw_docHandler){
cpvw_docHandler.parentDoc.enablePreview=false;
}
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/previews-off.png";
}
cpvw_prefHandler.setPref(this.prefPreviewEnable,"yes","char");
},showPrefDialog:function(evt){
window.openDialog("chrome://cooliris/content/options.xul","Cooliris Options","chrome,centerscreen,modal");
cpvw_previewHandler.setThemeToolbar();
cpvw_contextSitesTreeView.arrCMenuItems=null;
cpvw_previewHandler.previewOpenMode=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewOpenMode,"char");
if(cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewEnable,"char")=="no"){
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/globaloff.jpg";
}else{
cpvw_objOverlay.changeLinks(cpvw_objOverlay.getContentDocument());
}
var _20=cpvw_prefHandler.getPref(this.prefPreviewOpenDelay,"char");
cpvw_Delays.DISPLAY_DELAY_TIME=_20;
if(_20-500<=100){
cpvw_Delays.OPEN_DELAY_TIME=100;
}else{
cpvw_Delays.OPEN_DELAY_TIME=_20-500;
}
cpvw_Delays.ICON_DELAY_TIME=cpvw_prefHandler.getPref(this.prefMouseIconDelay,"char");
cpvw_Delays.PREVIEW_ON_ICON_DELAY=_20;
cpvw_Delays.CLOSE_DELAY_TIME=cpvw_prefHandler.getPref(this.prefHidePreviewDelay,"char");
},togglePreviewTip:function(){
var _21=cpvw_prefHandler.getPref(this.prefPreviewEnable,"char");
if(_21=="yes"){
cpvw_prefHandler.setPref(this.prefPreviewEnable,"no","char");
}else{
cpvw_prefHandler.setPref(this.prefPreviewEnable,"yes","char");
var _22=cpvw_objOverlay.getContentDocument();
cpvw_objOverlay.changeLinks(_22);
}
this.getPreferences();
},setPreviewSize:function(_23,_24){
cpvw_prefHandler.setPref(this.prefPreviewSize,_23+","+_24,"char");
},setPreviewLoc:function(_25,top){
try{
top=parseInt(top);
if(top==0||top<0){
throw "less than zero";
}
}
catch(ex){
top=120;
}
cpvw_prefHandler.setPref(this.prefPreviewLoc,_25+","+top,"char");
},initPreferences:function(){
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewSize,"640,480","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewEnable,"yes","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewPrefetch,"no","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewDefaultEnable,"yes","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewDebug,"no","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewOpenMode,"icon","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewOpenDelay,"500","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefMouseIconDelay,"400","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewOnIconDelay,"500","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefHidePreviewDelay,"1000","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewFixedLoc,"yes","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPreviewLoc,"200,200","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefTextZoom,"1","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefFixedIcon,true,"bool");
cpvw_prefHandler.setPrefIfNotExists(this.prefTheme,"default","char");
cpvw_prefHandler.setPrefIfNotExists(this.prefPiclensFilterSize,"50,50","char");
cpvw_prefHandler.setPrefIfNotExists(this.applyBrowserZoom,"no","char");
var _27=cpvw_prefHandler.getPref(this.prefPreviewOpenDelay,"char");
cpvw_prefHandler.setPrefIfNotExists(this.prefCMenuItems,"tfd,googleimages,wiki,googlesearch","char");
cpvw_Delays.DISPLAY_DELAY_TIME=_27;
cpvw_Delays.OPEN_DELAY_TIME=_27-500;
cpvw_Delays.ICON_DELAY_TIME=cpvw_prefHandler.getPref(this.prefMouseIconDelay,"char");
cpvw_Delays.PREVIEW_ON_ICON_DELAY=_27;
cpvw_Delays.CLOSE_DELAY_TIME=cpvw_prefHandler.getPref(this.prefHidePreviewDelay,"char");
this.getPreferences();
},getPreferences:function(){
var _28=cpvw_prefHandler.getPref(this.prefPreviewPrefetch,"char");
var _29=cpvw_prefHandler.getPref(this.prefPreviewEnable,"char");
if(_29=="no"){
document.getElementById("preview-status-image").src="chrome://cooliris/skin/new/globaloff.jpg";
}
},getOptionsPreviewPrefs:function(){
var _2a=cpvw_prefHandler.getPref(this.prefPreviewPrefetch,"char");
var _2b=cpvw_prefHandler.getPref(this.prefPreviewEnable,"char");
var _2c=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewFixedLoc,"char");
var _2d=cpvw_prefHandler.getPref(this.prefPreviewDefaultEnable,"char");
var _2e=cpvw_prefHandler.getPref(this.applyBrowserZoom,"char");
var _2f=cpvw_prefHandler.getPref(cpvw_Prefs.prefFixedIcon,"bool");
document.getElementById("cooliris_applyBrowserZoom").setAttribute("checked",(_2e=="yes")?true:false);
document.getElementById("cooliris_globalDisable").setAttribute("checked",(_2b=="no")?true:false);
document.getElementById("cooliris_defaultEnable").setAttribute("checked",(_2d=="yes")?true:false);
document.getElementById("cooliris_prefetchWebsites").setAttribute("checked",(_2a=="yes")?true:false);
document.getElementById("cooliris_fixedLoc").setAttribute("checked",(_2c=="yes")?false:true);
document.getElementById("cooliris_fixedIcon").setAttribute("checked",(_2f)?true:false);
var _30=cpvw_prefHandler.getPref(this.prefPreviewOpenDelay,"char");
document.getElementById("cooliris_openDelay").value=_30;
document.getElementById("cooliris_smallDivDelay").value=cpvw_prefHandler.getPref(this.prefMouseIconDelay,"char");
document.getElementById("cooliris_hidePreviewDelay").value=cpvw_prefHandler.getPref(this.prefHidePreviewDelay,"char");
var _31=cpvw_prefHandler.getPref(this.prefPreviewOpenMode,"char");
document.getElementById("cooliris_previewOpenMode").value=_31;
var _32=cpvw_prefHandler.getPref(cpvw_Prefs.prefTheme);
cpvw_get("cooliris_previewTheme").value=_32;
var _33=cpvw_prefHandler.getPref(cpvw_Prefs.prefCMenuItems,"char");
_33=","+_33+",";
cpvw_contextSitesTreeView.loadContextSites();
cpvw_get("cooliris_contextSiteTree").view=cpvw_contextSitesTreeView;
cpvw_get("cooliris_contextSiteTreeSelected").view=cpvw_contextSitesTreeViewSelected;
for(var key in cpvw_contextSitesTreeView.arrCMenuItems){
if(_33.indexOf(","+key+",")!=-1){
cpvw_contextSitesTreeViewSelected.arrSites.push(key);
cpvw_contextSitesTreeView.arrCMenuItems[key].selected=true;
}else{
cpvw_contextSitesTreeView.arrSites.push(key);
cpvw_contextSitesTreeView.arrCMenuItems[key].selected=false;
}
}
cpvw_contextSitesTreeView.arrSites.sort();
cpvw_contextSitesTreeView.invalidateTree(0,cpvw_contextSitesTreeView.arrSites.length);
cpvw_contextSitesTreeViewSelected.invalidateTree(0,cpvw_contextSitesTreeViewSelected.arrSites.length);
},managePiclensFilter:function(){
if(cpvw_get("cooliris_piclensFilter").checked){
cpvw_get("cooliris_piclens_width").disabled=false;
cpvw_get("cooliris_piclens_height").disabled=false;
var _35=cpvw_prefHandler.getPref(cpvw_Prefs.prefPiclensFilterSize,"char");
if(_35!=""){
var _36=_35.split(",");
cpvw_get("cooliris_piclens_width").value=_36[0];
cpvw_get("cooliris_piclens_height").value=_36[1];
}else{
cpvw_get("cooliris_piclens_width").value=50;
cpvw_get("cooliris_piclens_height").value=50;
}
}else{
cpvw_get("cooliris_piclens_width").disabled=true;
cpvw_get("cooliris_piclens_height").disabled=true;
}
},doOK:function(){
var _37=document.getElementById("cooliris_prefetchWebsites").checked;
if(_37){
cpvw_prefHandler.setPref(this.prefPreviewPrefetch,"yes","char");
}else{
cpvw_prefHandler.setPref(this.prefPreviewPrefetch,"no","char");
}
var _38=document.getElementById("cooliris_globalDisable").checked;
if(_38){
cpvw_prefHandler.setPref(this.prefPreviewEnable,"no","char");
}else{
cpvw_prefHandler.setPref(this.prefPreviewEnable,"yes","char");
}
var _39=document.getElementById("cooliris_applyBrowserZoom").checked;
if(_39){
cpvw_prefHandler.setPref(this.applyBrowserZoom,"yes","char");
}else{
cpvw_prefHandler.setPref(this.applyBrowserZoom,"no","char");
}
var _3a=document.getElementById("cooliris_defaultEnable").checked;
if(_3a){
cpvw_prefHandler.setPref(this.prefPreviewDefaultEnable,"yes","char");
}else{
cpvw_prefHandler.setPref(this.prefPreviewDefaultEnable,"no","char");
}
var _3b=document.getElementById("cooliris_fixedLoc").checked;
if(_3b){
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewFixedLoc,"no","char");
}else{
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewFixedLoc,"yes","char");
}
var _3c=document.getElementById("cooliris_fixedIcon").checked;
if(_3c){
cpvw_prefHandler.setPref(cpvw_Prefs.prefFixedIcon,true,"bool");
}else{
cpvw_prefHandler.setPref(cpvw_Prefs.prefFixedIcon,false,"bool");
}
var _3d=document.getElementById("cooliris_openDelay").value;
if(isNaN(_3d)){
alert("Enter a valid number...");
return false;
}else{
cpvw_prefHandler.setPref(this.prefPreviewOpenDelay,_3d,"char");
}
var _3e=document.getElementById("cooliris_smallDivDelay").value;
if(isNaN(_3e)){
alert("Enter a valid number...");
return false;
}else{
cpvw_prefHandler.setPref(this.prefMouseIconDelay,_3e,"char");
}
var _3f=document.getElementById("cooliris_hidePreviewDelay").value;
if(isNaN(_3f)){
alert("Enter a valid number...");
return false;
}else{
cpvw_prefHandler.setPref(this.prefHidePreviewDelay,_3f,"char");
}
var _40=document.getElementById("cooliris_previewOpenMode").value;
cpvw_prefHandler.setPref(this.prefPreviewOpenMode,_40,"char");
var _41=cpvw_get("cooliris_previewTheme").value;
cpvw_prefHandler.setPref(this.prefTheme,_41,"char");
cpvw_contextSitesTreeView.saveContextSites();
var _42=new Array();
var _43=cpvw_contextSitesTreeView.arrSites.concat(cpvw_contextSitesTreeViewSelected.arrSites);
for(var i=0;i<_43.length;i++){
var key=_43[i];
if(cpvw_contextSitesTreeView.arrCMenuItems[key]==null){
continue;
}
if(cpvw_contextSitesTreeView.arrCMenuItems[key].selected.toString()=="true"){
_42.push(key);
}
}
cpvw_prefHandler.setPref(cpvw_Prefs.prefCMenuItems,_42.join(","),"char");
},doCancel:function(){
return true;
},getUserInfo:function(){
var _46=cpvw_prefHandler.getPref(this.prefPreviewUserEmail,"char");
if(_46!=""){
var _47="chrome://cooliris/";
var _48="Registration";
var pwd;
if("@mozilla.org/passwordmanager;1" in Components.classes){
var _4a=Components.classes["@mozilla.org/passwordmanager;1"].createInstance(Components.interfaces.nsIPasswordManagerInternal);
var _4b={value:""};
var _4c={value:""};
var _4d={value:""};
try{
_4a.findPasswordEntry(_47,_46,"",_4b,_4c,_4d);
}
catch(e){
}
if(_4d.value==""){
alert("Error pulling account information!");
return false;
}
return [_46,_4d.value];
}else{
if("@mozilla.org/login-manager;1" in Components.classes){
try{
var _4e=Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
var _4f=_4e.findLogins({},_47,null,_48);
for(var i=0;i<_4f.length;i++){
if(_4f[i].username==_46){
pwd=_4f[i].password;
break;
}
}
return [_46,pwd];
}
catch(ex){
}
}
}
}else{
return ["",""];
}
},setUserEmail:function(_51,_52){
var _53="chrome://cooliris/";
if("@mozilla.org/passwordmanager;1" in Components.classes){
var _54=Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
if(_54){
_54=_54.QueryInterface(Components.interfaces.nsIPasswordManager);
try{
_54.removeUser(_53,_51);
}
catch(ex){
}
_54.addUser(_53,_51,_52);
}
}else{
if("@mozilla.org/login-manager;1" in Components.classes){
var _55=Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
var _56=new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",Components.interfaces.nsILoginInfo,"init");
var _57=new _56(_53,null,realm,username,password,"","");
_55.addLogin(_57);
}
}
cpvw_prefHandler.setPref(this.prefPreviewUserEmail,_51,"char");
},};
}
if(typeof cpvw_prefHandler=="undefined"){
var cpvw_prefHandler={prefs:Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),isExists:function(_58,_59){
var _5a=this.prefs;
_59=(_59==null)?"char":_59;
if(_59=="char"){
try{
if(_5a.getPrefType(_58)==_5a.PREF_STRING&&cpvw_jsUtils.trimWhitespace(_5a.getCharPref(_58).toString())!=""){
return true;
}
}
catch(ex){
return false;
}
return false;
}else{
if(_59=="bool"){
try{
var _5b=_5a.getBoolPref(_58);
}
catch(ex){
return false;
}
return true;
}
}
return null;
},getPref:function(_5c,_5d){
var _5e=this.prefs;
try{
_5d=(_5d==null)?"char":_5d;
if(_5d=="char"){
return _5e.getCharPref(_5c).toString();
}else{
if(_5d=="bool"){
return _5e.getBoolPref(_5c);
}
}
}
catch(ex){
return "";
}
},setPref:function(_5f,_60,_61){
var _62=this.prefs;
_61=(_61==null)?"char":_61;
if(_61=="char"){
_62.setCharPref(_5f,_60);
}else{
if(_61=="bool"){
_62.setBoolPref(_5f,_60);
}
}
},setPrefIfNotExists:function(_63,_64,_65){
var _66=this.prefs;
_65=(_65==null)?"char":_65;
if(_65=="char"){
try{
if(_66.getPrefType(_63)!=_66.PREF_STRING||(_66.getPrefType(_63)==_66.PREF_STRING&&cpvw_jsUtils.trimWhitespace(_66.getCharPref(_63).toString())=="")){
_66.setCharPref(_63,_64);
}
}
catch(ex){
_66.setCharPref(_63,_64);
}
}else{
if(_65=="bool"){
try{
var _67=_66.getBoolPref(_63);
}
catch(ex){
_66.setBoolPref(_63,_64);
}
}
}
}};
}
if(typeof cpvw_jsUtils=="undefined"){
var cpvw_jsUtils={setPosition:function(obj,_69,top,_6b,_6c,_6d){
if(typeof obj=="string"){
obj=document.getElementById(obj);
}
var str="";
if(_69){
str+="left:"+_69+"px;";
}
if(top){
str+="top:"+top+"px;";
}
if(_6b){
str+="width:"+_6b+"px;";
}
if(_6c){
str+="height:"+_6c+"px;";
}
if(obj){
if(_6d){
if(_69){
obj.style.left=_69+"px";
}
if(top){
obj.style.top=top+"px";
}
if(_6b){
obj.style.width=_6b+"px";
}
if(_6c){
obj.style.height=_6c+"px";
}
}else{
obj.setAttribute("style",str);
}
}
},SetLocalSystemPath:function(_6f){
var _70=Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home",Components.interfaces.nsIFile);
_6f=(_70.path.search(/\\/)!=-1)?_6f.replace(/\//gi,"\\"):_6f.replace(/\\\\/gi,"/");
return _6f;
},getWorkingFolder:function(){
var _71;
try{
_71=Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD",Components.interfaces.nsIFile);
}
catch(ex){
alert(ex);
}
return _71;
},trimWhitespace:function(_72){
var _73="";
var _74="";
beginningFound=false;
for(var i=0;i<_72.length;i++){
if(_72.charAt(i)!=" "&&_72.charCodeAt(i)!=9){
if(_74!=""){
_73+=_74;
_74="";
}
_73+=_72.charAt(i);
if(beginningFound==false){
beginningFound=true;
}
}else{
if(beginningFound==true){
_74+=_72.charAt(i);
}
}
}
return _73;
},showPiclensLite:function(_76,_77,_78,_79,_7a){
var _7b="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"+"<rss version=\"2.0\" xmlns:media=\"http://search.yahoo.com/mrss\">"+"<channel>"+"<slideShowDefaults maxScale=\"2.0\" overlayToolBars=\"false\"/>"+"<generator>piclens previews 2.7</generator>"+"<title>"+_77+"</title>"+"<link>"+_78+"</link>"+"<description></description>";
var uri=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
for(var i=0;i<_79.length;i++){
uri.spec=_79[i].src;
_7b+="<item>"+"<title>"+"aaa"+"</title>"+"<link>"+escape(_79[i].src)+"</link>"+"<media:thumbnail url=\""+escape(_79[i].thumbnailSrc)+"\"/>"+"<media:content url=\""+escape(_79[i].src)+"\" type=\"image/jpeg\"/>"+"</item>";
}
_7b+=" </channel>"+"</rss>";
if(_76.wrappedJSObject.PicLensLite!=null){
if(_7a){
cpvw_imageDocHandler.hideTimer=1;
cpvw_imageDocHandler.hidePreview();
}else{
cpvw_docHandler.hideTimer=1;
cpvw_docHandler.hidePreview();
}
_76.wrappedJSObject.PicLensLite.start({feedData:_7b,homePageLabel:_77});
}
}};
}
var cpvw_contextSitesTreeView={treeBox:null,selection:null,isIconEdited:false,arrSites:new Array,arrCMenuItems:null,jsContextSiteFile:"CoolirisPreviewContextSites.js",getRowCount:function(){
this.rowCount=this.arrSites.length;
return this.arrSites.length;
},setTree:function(_7e){
this.treeBox=_7e;
},getCellText:function(idx,_80){
if(idx>=this.getRowCount()){
return "";
}
if(_80.id=="cooliris_contextSiteTree_name"){
return cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[idx]].label;
}
},getCellValue:function(idx,_82){
if(idx>=this.getRowCount()){
return "";
}
if(_82.id=="cooliris_contextSiteTree_selected"){
return cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[idx]].selected;
}
},setCellValue:function(idx,_84,_85){
conDump("label = "+_85);
if(idx>=this.getRowCount()){
return "";
}
if(_84.id=="cooliris_contextSiteTree_selected"){
cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[idx]].selected=_85;
}
},isEditable:function(idx,_87){
return true;
},isContainer:function(idx){
return false;
},isSeparator:function(idx){
return false;
},isSorted:function(){
return false;
},getImageSrc:function(idx,_8b){
if(_8b.id=="cooliris_contextSiteTree_name"){
return cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[idx]].image;
}
},getProgressMode:function(idx,_8d){
},cycleHeader:function(col){
},selectionChanged:function(){
},cycleCell:function(idx,_90){
},performAction:function(_91){
},performActionOnCell:function(_92,_93,_94){
},getRowProperties:function(idx,_96,_97){
},getCellProperties:function(idx,_99,_9a){
},getColumnProperties:function(_9b,_9c,_9d){
},getLevel:function(idx){
return 0;
},invalidateTree:function(_9f,_a0){
this.treeBox.rowCountChanged(_9f,_a0);
},getUrl:function(_a1,_a2){
var _a3="";
var _a4=cpvw_prefHandler.getPref(cpvw_Prefs.prefCMenuItems,"char");
var _a5=_a4.split(",");
if(cpvw_jsUtils.trimWhitespace(_a5[_a1].toString())=="wiki"){
_a2=_a2.replace(/\s/,"_");
}else{
_a2=_a2.replace(/\s/,"+");
}
conDump("slect str "+_a5[_a1]+", "+_a2);
_a3=cpvw_contextSitesTreeView.arrCMenuItems[_a5[_a1]].url;
_a3=_a3.replace(/\$/gi,_a2);
return _a3;
},selectWebsites:function(){
var _a6=new Object();
var end=new Object();
var _a8=cpvw_contextSitesTreeView.selection.getRangeCount();
var _a9=cpvw_contextSitesTreeView.getRowCount();
var _aa=cpvw_contextSitesTreeViewSelected.getRowCount();
var _ab=new Array;
for(var t=0;t<_a8;t++){
cpvw_contextSitesTreeView.selection.getRangeAt(t,_a6,end);
for(var v=_a6.value;v<=end.value;v++){
var _ae=cpvw_contextSitesTreeView.arrSites[v];
cpvw_contextSitesTreeViewSelected.arrSites.push(_ae);
cpvw_contextSitesTreeView.arrCMenuItems[_ae].selected=true;
_ab.push(v);
}
}
for(var i=0;i<_ab.length;i++){
cpvw_contextSitesTreeView.arrSites.splice(_ab[i]-i,1);
}
cpvw_contextSitesTreeView.treeBox.rowCountChanged(0,-_a9);
cpvw_contextSitesTreeView.treeBox.rowCountChanged(0,cpvw_contextSitesTreeView.getRowCount());
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,-_aa);
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,cpvw_contextSitesTreeViewSelected.getRowCount());
this.clearDetails();
},deselectWebsites:function(){
var _b0=new Object();
var end=new Object();
var _b2=cpvw_contextSitesTreeViewSelected.selection.getRangeCount();
var _b3=cpvw_contextSitesTreeView.getRowCount();
var _b4=cpvw_contextSitesTreeViewSelected.getRowCount();
var _b5=new Array;
for(var t=0;t<_b2;t++){
cpvw_contextSitesTreeViewSelected.selection.getRangeAt(t,_b0,end);
for(var v=_b0.value;v<=end.value;v++){
var _b8=cpvw_contextSitesTreeViewSelected.arrSites[v];
cpvw_contextSitesTreeView.arrCMenuItems[_b8].selected=false;
cpvw_contextSitesTreeView.arrSites.push(_b8);
_b5.push(v);
}
}
for(var i=0;i<_b5.length;i++){
cpvw_contextSitesTreeViewSelected.arrSites.splice(_b5[i]-i,1);
}
cpvw_contextSitesTreeView.arrSites.sort();
cpvw_contextSitesTreeView.treeBox.rowCountChanged(0,-_b3);
cpvw_contextSitesTreeView.treeBox.rowCountChanged(0,cpvw_contextSitesTreeView.getRowCount());
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,-_b4);
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,cpvw_contextSitesTreeViewSelected.getRowCount());
this.clearDetails();
},addWebsite:function(){
var _ba=cpvw_get("siteName").value;
var _bb=_ba.replace(/[\s|\'|\"]/gim,"");
_ba=_ba.replace(/[\'|\"]/gim,"");
var _bc=cpvw_get("siteUrl").value;
_bc=_bc.replace(/[\'|\"]/gim,"");
var _bd=cpvw_get("siteIcon").value;
_bd=_bd.replace(/[\'|\"]/gim,"");
_ba=cpvw_jsUtils.trimWhitespace(_ba);
if(cpvw_jsUtils.trimWhitespace(_ba)==""){
alert("Please enter a site name!");
return;
}
var _be=cpvw_contextSitesTreeView.arrSites.concat(cpvw_contextSitesTreeViewSelected.arrSites);
var _bf=new Array;
for(var i=0;i<_be.length;i++){
_bf.push(cpvw_contextSitesTreeView.arrCMenuItems[_be[i]].label);
}
if(_bf.indexOf(_ba)!=-1){
alert("Same name already exists!");
return;
}
var _c1=cpvw_jsUtils.trimWhitespace(cpvw_get("searchPhrase").value);
if(_c1!=""){
_bc=_bc.replace(new RegExp(_c1,"gim"),"$");
}
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,-cpvw_contextSitesTreeViewSelected.getRowCount());
cpvw_contextSitesTreeViewSelected.arrSites.unshift(_bb);
cpvw_contextSitesTreeView.arrCMenuItems[_bb]=new Array;
cpvw_contextSitesTreeView.arrCMenuItems[_bb].label=_ba;
cpvw_contextSitesTreeView.arrCMenuItems[_bb].url=_bc;
cpvw_contextSitesTreeView.arrCMenuItems[_bb].image=_bd;
cpvw_contextSitesTreeView.arrCMenuItems[_bb].selected=true;
cpvw_contextSitesTreeViewSelected.treeBox.rowCountChanged(0,cpvw_contextSitesTreeViewSelected.getRowCount());
this.clearDetails();
},editWebsite:function(){
cpvw_contextSitesTreeView.isIconEdited=false;
var _c2=this.selection.currentIndex;
if(_c2==-1){
return;
}
if(cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[_c2]]==null){
return;
}
cpvw_get("siteName").value=cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[_c2]].label;
cpvw_get("siteUrl").value=cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[_c2]].url;
cpvw_get("siteIcon").value=cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[_c2]].image;
},removeWebsite:function(){
var _c3=this.selection.currentIndex;
if(_c3==-1){
return;
}
var _c4=this.getRowCount();
this.treeBox.rowCountChanged(0,-_c4);
cpvw_contextSitesTreeView.arrCMenuItems[this.arrSites[_c3]]=null;
this.arrSites.splice(_c3,1);
this.treeBox.rowCountChanged(0,this.getRowCount());
this.clearDetails();
},updateImageUrl:function(){
if(cpvw_contextSitesTreeView.isIconEdited){
return;
}
var _c5=cpvw_get("siteUrl").value;
try{
var uri=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
uri.spec=_c5;
var _c7=uri.scheme+"://"+uri.host+"/favicon.ico";
}
catch(ex){
return;
}
cpvw_get("siteIcon").value=_c7;
},clearDetails:function(){
cpvw_contextSitesTreeView.isIconEdited=false;
cpvw_get("siteName").value="";
cpvw_get("siteUrl").value="http://";
cpvw_get("siteIcon").value="";
},loadContextSites:function(){
try{
var _c8=cpvw_jsUtils.getWorkingFolder();
_c8.append(this.jsContextSiteFile);
var _c9;
if(!_c8.exists()){
_c9="chrome://cooliris/content/CoolirisPreviewContextSites.js";
}else{
_c9="file:///"+_c8.path;
}
var req=new XMLHttpRequest();
req.open("GET",_c9,false);
req.send(null);
var _cb=req.responseText;
try{
this.arrCMenuItems=eval("("+_cb+")");
}
catch(ex){
conDump("Error loading context sites : "+ex);
}
}
catch(ex){
alert(ex);
}
},serializeJS:function(){
var _cc="";
var i=0;
var _ce=cpvw_contextSitesTreeView.arrSites.concat(cpvw_contextSitesTreeViewSelected.arrSites);
for(var i=0;i<_ce.length;i++){
var key=_ce[i];
if(cpvw_contextSitesTreeView.arrCMenuItems[key]==null){
continue;
}
if(i!=0){
_cc+=",";
}
_cc+="\""+key+"\":"+"{label:\""+cpvw_contextSitesTreeView.arrCMenuItems[key].label+"\",url:\""+cpvw_contextSitesTreeView.arrCMenuItems[key].url+"\",image:\""+cpvw_contextSitesTreeView.arrCMenuItems[key].image+"\"}";
}
_cc="{"+_cc+"}";
return _cc;
},saveContextSites:function(){
try{
var _d0=this.serializeJS();
var _d1=Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
var _d2=cpvw_jsUtils.getWorkingFolder();
_d2.append(this.jsContextSiteFile);
_d1.init(_d2,2|8|32,436,0);
_d1.write(_d0,_d0.length);
_d1.close();
return true;
}
catch(ex){
alert(ex);
return false;
}
},openHelp:function(){
var wm=Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win=wm.getMostRecentWindow("navigator:browser");
if(win!=null){
win.getBrowser().selectedTab=win.getBrowser().addTab("http://www.coolpreviews.com/client/links/rightclicksearch.html");
}
}};
var cpvw_contextSitesTreeViewSelected={treeBox:null,selection:null,isIconEdited:false,arrSites:new Array,arrCMenuItems:null,jsContextSiteFile:"CoolirisPreviewContextSites.js",getRowCount:function(){
this.rowCount=this.arrSites.length;
return this.arrSites.length;
},setTree:function(_d5){
this.treeBox=_d5;
},getCellText:function(idx,_d7){
if(idx>=this.getRowCount()){
return "";
}
if(_d7.id=="cooliris_contextSiteTree_name"){
return cpvw_contextSitesTreeView.arrCMenuItems[cpvw_contextSitesTreeViewSelected.arrSites[idx]].label;
}
},getCellValue:function(idx,_d9){
if(idx>=this.getRowCount()){
return "";
}
},setCellValue:function(idx,_db,_dc){
conDump("label = "+_dc);
if(idx>=this.getRowCount()){
return "";
}
},isEditable:function(idx,_de){
return true;
},isContainer:function(idx){
return false;
},isSeparator:function(idx){
return false;
},isSorted:function(){
return false;
},getImageSrc:function(idx,_e2){
if(_e2.id=="cooliris_contextSiteTree_name"){
return cpvw_contextSitesTreeView.arrCMenuItems[cpvw_contextSitesTreeViewSelected.arrSites[idx]].image;
}
},getProgressMode:function(idx,_e4){
},cycleHeader:function(col){
},selectionChanged:function(){
},cycleCell:function(idx,_e7){
},performAction:function(_e8){
},performActionOnCell:function(_e9,_ea,_eb){
},getRowProperties:function(idx,_ed,_ee){
},getCellProperties:function(idx,_f0,_f1){
},getColumnProperties:function(_f2,_f3,_f4){
},getLevel:function(idx){
return 0;
},invalidateTree:function(_f6,_f7){
this.treeBox.rowCountChanged(_f6,_f7);
}};
var cpvw_objStats={isCheckedTimer:false,generateGUID:function(){
var _f8=Components.classes["@mozilla.org/uuid-generator;1"].getService(Components.interfaces.nsIUUIDGenerator);
var _f9=_f8.generateUUID().toString();
_f9=_f9.replace(/{|}/gi,"");
return _f9.toString();
},setInitPreferences:function(){
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefGUID,cpvw_objStats.generateGUID(),"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefTimestamp,(new Date()).valueOf(),"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefCount,0,"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefStackCount,0,"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefPiclensCount,0,"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefPreviewDuration,0,"char");
cpvw_prefHandler.setPrefIfNotExists(cpvw_Prefs.prefPreviewPages,0,"char");
},incrementCounter:function(){
var _fa=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefCount,"char"))+1;
cpvw_prefHandler.setPref(cpvw_Prefs.prefCount,_fa,"char");
this.checkTimerAndUpdateWeb();
},incrementStackCounter:function(){
var _fb=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefStackCount,"char"))+1;
cpvw_prefHandler.setPref(cpvw_Prefs.prefStackCount,_fb,"char");
this.checkTimerAndUpdateWeb();
},incrementPiclensLiteCounter:function(){
var _fc=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefPiclensCount,"char"))+1;
cpvw_prefHandler.setPref(cpvw_Prefs.prefPiclensCount,_fc,"char");
this.checkTimerAndUpdateWeb();
},incrementDuration:function(_fd){
var _fe=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewDuration,"char"))+_fd;
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewDuration,_fe,"char");
this.checkTimerAndUpdateWeb();
},incrementPageCounter:function(_ff){
var _100=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewPages,"char"))+_ff;
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewPages,_100,"char");
this.checkTimerAndUpdateWeb();
},isInstalledOrUpdated:function(act){
this.setInitPreferences();
var guid=cpvw_prefHandler.getPref(cpvw_Prefs.prefGUID,"char");
var _103="data="+guid+":"+act;
cooliris_xhttp.doAsyncPost(_103,"",function(){
},"http://www.coolpreviews.com/client/scripts/welcome.php");
},checkTimerAndUpdateWeb:function(){
if(!cpvw_prefHandler.isExists(cpvw_Prefs.prefGUID,"char")||!cpvw_prefHandler.isExists(cpvw_Prefs.prefTimestamp,"char")){
this.setInitPreferences();
}
var _104=(new Date()).valueOf();
var _105=parseInt(cpvw_prefHandler.getPref(cpvw_Prefs.prefTimestamp,"char"));
var _106=604800000;
if(_104-_105>_106){
var guid=cpvw_prefHandler.getPref(cpvw_Prefs.prefGUID,"char");
var _108=cpvw_prefHandler.getPref(cpvw_Prefs.prefCount,"char");
var _109=cpvw_prefHandler.getPref(cpvw_Prefs.prefStackCount,"char");
var _10a=cpvw_prefHandler.getPref(cpvw_Prefs.prefPiclensCount,"char");
var _10b=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewDuration,"char");
var _10c=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewPages,"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefTimestamp,(new Date()).valueOf(),"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefCount,0,"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefStackCount,0,"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefPiclensCount,0,"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewDuration,0,"char");
cpvw_prefHandler.setPref(cpvw_Prefs.prefPreviewPages,0,"char");
var _10d="data="+guid+":"+_108+":"+_109+":"+_10a+":"+_10b+":"+_10c;
cooliris_xhttp.doAsyncPost(_10d,"",function(){
},"http://www.coolpreviews.com/client/scripts/update.php");
}
}};
function cpvw_get(_10e,doc){
if(doc==null){
return document.getElementById(_10e);
}else{
return doc.getElementById(_10e);
}
}
function conDump(_110){
if(cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewDebug,"char")=="no"){
return;
}
var _111=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
_111.logStringMessage("cooliris: "+_110);
}

