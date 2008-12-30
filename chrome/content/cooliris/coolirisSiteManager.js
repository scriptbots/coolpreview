if(typeof cpvw_siteManager=="undefined"){
var cpvw_siteManager={arrSiteList:null,siteDom:null,xmlSiteFile:"CoolirisPreviewSites.xml",isCustomSite:function(_1){
var _2=[false,""];
if(_1.match(/^http:\/\/\w{3}.google.[a-z.]+\/search/i)||_1.match(/^http:\/\/\w{3}.google.[a-z.]+\/custom/i)){
_2=[true,"google_search"];
}
if(_1.match(/^http:\/\/[a-z.]+ebay.[a-z.]+/i)){
_2=[true,"ebay"];
}
if(_1.match(/^http:\/\/w{3}.tagworld.[a-z.]+/i)){
_2=[true,"tagworld"];
}
if(_1.match(/^http:\/\/[a-z.]+craigslist.[a-z.]+/i)){
_2=[true,"craigslist"];
}
if(_1.match(/^http:\/\/[a-z.]+myspace.[a-z.]+/i)){
_2=[true,"myspace"];
}
if(_1.match(/^http:\/\/[a-z.]+cooliris.[a-z.]+/i)){
_2=[true,"cooliris"];
}
if(_1.match(/^http:\/\/[a-z.]+rediff.[a-z.]+/i)){
_2=[true,"rediff"];
}
if(_1.match(/^http:\/\/video.google.[a-z.]+/i)){
_2=[true,"google_video"];
}
if(_1.match(/^http:\/\/w{3}.gravee.[a-z.]+\/search/i)){
_2=[true,"gravee"];
}
if(_1.match(/^http:\/\/w{3}.technorati.[a-z.]+\/search/i)){
_2=[true,"technorati"];
}
if(_1.match(/^http:\/\/news.google.[a-z.]+\//i)){
_2=[true,"google_news"];
}
if(_1.match(/^http:\/\/scholar.google.[a-z.]+\/scholar/i)){
_2=[true,"google_scholar"];
}
if(_1.match(/^http:\/\/del.icio.us/i)){
_2=[true,"delicious"];
}
if(_1.match(/^http:\/\/search.yahoo.[a-z.]+\/search/i)){
_2=[true,"yahoo_search"];
}
if(_1.match(/^http:\/\/www.newsvine.[a-z.]+/i)){
_2=[true,"newsvine"];
}
if(_1.match(/^http:\/\/www.youtube.[a-z.]+/i)||_1.match(/^http:\/\/youtube.[a-z.]+/i)){
_2=[true,"youtube_video"];
}
if(!_2[0]){
_2=this.isIncludedSite(_1);
}
return _2;
},isIncludedSite:function(_3){
var _4=[false,""];
if(this.siteDom==null){
this.loadSites();
}
if(this.siteDom!=null){
var _5=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
_5.spec=_3;
var _6;
var _7;
if(_5.host!=null){
_7=escape(_5.host);
_6=this.getResultFromXPath("//SITE-URL[@DOMAIN='"+_7+"']",this.siteDom);
}
if(_6!=null){
if(_6.snapshotLength==1&&_6.snapshotItem(0).getAttribute("ENABLED")=="yes"){
_4=[true,"general"];
if(_3.match(/^http:\/\/images.google.[a-z.]+\/images/i)){
_4=[true,"google_images"];
}else{
if(_3.match(/^http:\/\/images.search.yahoo.[a-z.]+\/search\/images/i)){
_4=[true,"yahoo_images"];
}
}
}else{
if(_6.snapshotLength==0){
if(_3.match(/^http:\/\/images.google.[a-z.]+\/images/i)){
_4=[true,"google_images"];
}else{
if(_3.match(/^http:\/\/images.search.yahoo.[a-z.]+\/search\/images/i)){
_4=[true,"yahoo_images"];
}else{
if(_7=="www.msn.com"||_7=="www.aol.com"||_7=="www.ask.com"||_7=="www.a9.com"||_7=="www.baidu.com"||_7=="www.naver.com"||_7=="www.bebo.com"||_7=="www.amazon.com"||_7=="www.flock.com"||_7=="www.maxthon.com"||_7=="www.cnn.com"||_7=="www.bbc.co.uk"||_7=="www.newsvine.com"||_7=="www.digg.com"||_7=="www.sphere.com"||_7=="www.nytimes.com"||_7=="www.espn.com"||_7=="www.rollyo.com"){
_4=[true,"general"];
}else{
var _8=cpvw_prefHandler.getPref(cpvw_Prefs.prefPreviewDefaultEnable,"char");
if(_8=="yes"){
_4=[true,"general"];
}else{
_4=[false,""];
}
}
}
}
}
}
}
}
return _4;
},loadSites:function(){
try{
var _9=cpvw_jsUtils.getWorkingFolder();
_9.append(this.xmlSiteFile);
var _a;
if(!_9.exists()){
_a="chrome://cooliris/content/CoolirisPreviewSitesTemplate.xml";
}else{
_a="file:///"+_9.path;
}
var _b=new XMLHttpRequest();
_b.open("GET",_a,false);
_b.send(null);
this.siteDom=_b.responseXML;
if(this.siteDom.documentElement.nodeName=="parsererror"){
throw "Error retrieving site list";
}
}
catch(ex){
alert(ex);
}
},editSite:function(_c,_d){
var _e=Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
_e.spec=_c;
var _f,_10;
if(_e.host!=null){
_10=escape(_e.host);
_f=this.getResultFromXPath("//SITE-URL[@DOMAIN='"+_10+"']",this.siteDom);
}
if(_f!=null){
if(_f.snapshotLength==0){
var _11=this.siteDom.createElement("SITE-URL");
_11.setAttribute("ENABLED",_d);
_11.setAttribute("TYPE","domain");
_11.setAttribute("DOMAIN",_10);
_11.appendChild(this.siteDom.createCDATASection(_c));
this.siteDom.firstChild.appendChild(_11);
}else{
_f.snapshotItem(0).setAttribute("ENABLED",_d);
}
this.saveSite();
}
},saveSite:function(){
try{
var _12=new XMLSerializer();
var _13=Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
var _14=cpvw_jsUtils.getWorkingFolder();
_14.append(this.xmlSiteFile);
_13.init(_14,2|8|32,436,0);
_12.serializeToStream(this.siteDom,_13,"");
_13.close();
return true;
}
catch(ex){
alert(ex);
return false;
}
},getResultFromXPath:function(_15,_16){
try{
var _17=XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
var _18=document.createNSResolver(_16.ownerDocument==null?_16.documentElement:_16.ownerDocument.documentElement);
var _19=_16.evaluate(_15,_16,_18,_17,null);
}
catch(ex){
return null;
}
return _19;
}};
}

