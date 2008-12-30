function cpvw_nsNodeType(){
this.target=null;
this.menu=null;
this.onTextInput=false;
this.onKeywordField=false;
this.onImage=false;
this.onLoadedImage=false;
this.onLink=false;
this.onMailtoLink=false;
this.onSaveableLink=false;
this.onMetaDataItem=false;
this.onMathML=false;
this.link=false;
this.linkURL="";
this.linkURI=null;
this.linkProtocol=null;
this.inFrame=false;
this.hasBGImage=false;
this.isTextSelected=false;
this.isContentSelected=false;
this.inDirList=false;
this.shouldDisplay=true;
}
cpvw_nsNodeType.prototype={getNodeType:function(){
this.setTarget(document.popupNode);
this.isTextSelected=this.isTextSelection();
this.isContentSelected=this.isContentSelection();
},setTarget:function(_1){
var _2="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
if(_1.namespaceURI==_2){
this.shouldDisplay=false;
return;
}
this.onImage=false;
this.onLoadedImage=false;
this.onStandaloneImage=false;
this.onMetaDataItem=false;
this.onTextInput=false;
this.onKeywordField=false;
this.imageURL="";
this.onLink=false;
this.linkURL="";
this.linkURI=null;
this.linkProtocol="";
this.onMathML=false;
this.inFrame=false;
this.hasBGImage=false;
this.bgImageURL="";
this.target=_1;
this.docURL=_1.ownerDocument.location.href;
if(this.target.nodeType==Node.ELEMENT_NODE){
if(this.target instanceof Components.interfaces.nsIImageLoadingContent&&this.target.currentURI){
this.onImage=true;
this.onMetaDataItem=true;
var _3=this.target.getRequest(Components.interfaces.nsIImageLoadingContent.CURRENT_REQUEST);
if(_3&&(_3.imageStatus&_3.STATUS_SIZE_AVAILABLE)){
this.onLoadedImage=true;
}
this.imageURL=this.target.currentURI.spec;
if(this.target.ownerDocument instanceof ImageDocument){
this.onStandaloneImage=true;
}
}else{
if(this.target instanceof HTMLInputElement){
this.onTextInput=this.isTargetATextBox(this.target);
this.onKeywordField=this.isTargetAKeywordField(this.target);
}else{
if(this.target instanceof HTMLTextAreaElement){
this.onTextInput=true;
}else{
if(this.target instanceof HTMLHtmlElement){
var _4=this.target.ownerDocument.getElementsByTagName("body")[0];
if(_4){
var _5=this.getComputedURL(_4,"background-image");
if(_5){
this.hasBGImage=true;
this.bgImageURL=makeURLAbsolute(_4.baseURI,_5);
}
}
}else{
if("HTTPIndex" in content&&content.HTTPIndex instanceof Components.interfaces.nsIHTTPIndex){
this.inDirList=true;
var _6=this.target;
while(_6&&!this.link){
if(_6.tagName=="tree"){
break;
}
if(_6.getAttribute("URL")){
this.onLink=true;
this.link={href:_6.getAttribute("URL"),getAttribute:function(_7){
if(_7=="title"){
return _6.firstChild.firstChild.getAttribute("label");
}else{
return "";
}
}};
if(_6.getAttribute("container")=="true"){
this.onSaveableLink=false;
}else{
this.onSaveableLink=true;
}
}else{
_6=_6.parentNode;
}
}
}
}
}
}
}
}
var _8="http://www.w3.org/XML/1998/namespace";
var _9=this.target;
while(_9){
if(_9.nodeType==Node.ELEMENT_NODE){
if(!this.onLink&&((_9 instanceof HTMLAnchorElement&&_9.href)||_9 instanceof HTMLAreaElement||_9 instanceof HTMLLinkElement||_9.getAttributeNS("http://www.w3.org/1999/xlink","type")=="simple")){
this.onLink=true;
this.onMetaDataItem=true;
this.link=_9;
this.linkURL=this.getLinkURL();
this.linkURI=this.getLinkURI();
this.linkProtocol=this.getLinkProtocol();
this.onMailtoLink=(this.linkProtocol=="mailto");
this.onSaveableLink=this.isLinkSaveable(this.link);
}
if(!this.onMetaDataItem){
if((_9 instanceof HTMLQuoteElement&&_9.cite)||(_9 instanceof HTMLTableElement&&_9.summary)||(_9 instanceof HTMLModElement&&(_9.cite||_9.dateTime))||(_9 instanceof HTMLElement&&(_9.title||_9.lang))||_9.getAttributeNS(_8,"lang")){
this.onMetaDataItem=true;
}
}
if(!this.hasBGImage){
var _a=this.getComputedURL(_9,"background-image");
if(_a){
this.hasBGImage=true;
this.bgImageURL=makeURLAbsolute(_9.baseURI,_a);
}
}
}
_9=_9.parentNode;
}
var _b="http://www.w3.org/1998/Math/MathML";
if((this.target.nodeType==Node.TEXT_NODE&&this.target.parentNode.namespaceURI==_b)||(this.target.namespaceURI==_b)){
this.onMathML=true;
}
if(this.target.ownerDocument!=window.content.document){
this.inFrame=true;
}
},isTextSelection:function(){
var _c=false;
var _d=this.searchSelected(16);
var _e;
if(_d){
_e=_d.toString();
if(_e.length>15){
_e=_e.substr(0,15)+"...";
}
_c=true;
}
return _c;
},isContentSelection:function(){
return !document.commandDispatcher.focusedWindow.getSelection().isCollapsed;
},getLinkURL:function(){
var _f=this.link.href;
if(_f){
return _f;
}
var _f=this.link.getAttributeNS("http://www.w3.org/1999/xlink","href");
if(!_f||!_f.match(/\S/)){
throw "Empty href";
}
_f=makeURLAbsolute(this.link.baseURI,_f);
return _f;
},getLinkURI:function(){
var _10=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
try{
return _10.newURI(this.linkURL,null,null);
}
catch(ex){
return null;
}
},getLinkProtocol:function(){
if(this.linkURI){
return this.linkURI.scheme;
}else{
return null;
}
},linkText:function(){
var _11=gatherTextUnder(this.link);
if(!_11||!_11.match(/\S/)){
_11=this.link.getAttribute("title");
if(!_11||!_11.match(/\S/)){
_11=this.link.getAttribute("alt");
if(!_11||!_11.match(/\S/)){
_11=this.linkURL;
}
}
}
return _11;
},toString:function(){
return "contextMenu.target     = "+this.target+"\n"+"contextMenu.onImage    = "+this.onImage+"\n"+"contextMenu.onLink     = "+this.onLink+"\n"+"contextMenu.link       = "+this.link+"\n"+"contextMenu.inFrame    = "+this.inFrame+"\n"+"contextMenu.hasBGImage = "+this.hasBGImage+"\n";
},isTargetATextBox:function(_12){
if(_12 instanceof HTMLInputElement){
return (_12.type=="text"||_12.type=="password");
}
return (_12 instanceof HTMLTextAreaElement);
},isTargetAKeywordField:function(_13){
var _14=_13.form;
if(!_14){
return false;
}
var _15=_14.method.toUpperCase();
return (_15=="GET"||_15=="")||(_14.enctype!="text/plain")&&(_14.enctype!="multipart/form-data");
},getComputedURL:function(_16,_17){
var url=_16.ownerDocument.defaultView.getComputedStyle(_16,"").getPropertyCSSValue(_17);
return (url.primitiveType==CSSPrimitiveValue.CSS_URI)?url.getStringValue():null;
},isLinkSaveable:function(_19){
return this.linkProtocol&&!(this.linkProtocol=="mailto"||this.linkProtocol=="javascript"||this.linkProtocol=="news"||this.linkProtocol=="snews");
},cloneNode:function(_1a){
var _1b=document.createElement(_1a.tagName);
var _1c=_1a.attributes;
for(var i=0;i<_1c.length;i++){
var _1e=_1c.item(i);
_1b.setAttribute(_1e.nodeName,_1e.nodeValue);
}
return _1b;
},searchSelected:function(_1f){
var _20=document.commandDispatcher.focusedWindow;
var _21=_20.getSelection();
_21=_21.toString();
if(!_1f){
_1f=150;
}
if(_1f<_21.length){
var _22=new RegExp("^(?:\\s*.){0,"+_1f+"}");
_22.test(_21);
_21=RegExp.lastMatch;
}
_21=_21.replace(/^\s+/,"");
_21=_21.replace(/\s+$/,"");
_21=_21.replace(/\s+/g," ");
return _21;
}};

