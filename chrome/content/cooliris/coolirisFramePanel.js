var CoolirisFramePanel={sendLink:"",isSendToOpen:false,sendToBoxLink:"http://www.coolpreviews.com/client/scripts/sendto.php?version=2.7",fromPreview:true,subject:"",notes:"",link:"",sendDirectly:function(_1){
CoolirisFramePanel.fromPreview=false;
var _2=new cpvw_nsNodeType();
_2.getNodeType();
CoolirisFramePanel.link="";
CoolirisFramePanel.notes="";
CoolirisFramePanel.subject="";
if(_2.onImage){
CoolirisFramePanel.link=_2.imageURL;
}else{
if(_2.onLink){
CoolirisFramePanel.link=_2.linkURL;
}else{
if(_2.isTextSelected){
var _3=document.commandDispatcher.focusedWindow;
var _4=_3.getSelection();
CoolirisFramePanel.notes=_4;
}else{
CoolirisFramePanel.link=document.popupNode.ownerDocument.location.href;
CoolirisFramePanel.subject=document.popupNode.ownerDocument.title;
}
}
}
CoolirisFramePanel.showSendTo(_1,false);
},showSendTo:function(_5,_6){
this.fromPreview=_6;
if(this.isSendToOpen){
this.closeSendToOptions();
return;
}
this.isSendToOpen=true;
this.sendToBox=document.createElement("vbox");
this.sendToBox.setAttribute("id","cooliris_sendToBox");
this.sendToFrame=document.createElement("browser");
this.sendToFrame.setAttribute("src",CoolirisFramePanel.sendToBoxLink);
this.sendToFrame.setAttribute("disablehistory",true);
this.sendToFrame.setAttribute("id","cooliris_sendToFrame");
this.sendToFrame.setAttribute("style","width:100%;height:100%;background-color:black;");
this.sendToFrame.addEventListener("load",function(_7){
CoolirisFramePanel.onIframeLoad(_7);
},true);
this.sendToBox.appendChild(this.sendToFrame);
this.sendToFrame.addEventListener("coolpreviewsClosePopupEvent",function(_8){
CoolirisFramePanel.closeSendToOptions();
},false,true);
cpvw_previewHandler.stickPreview(true);
document.getElementById("main-window").appendChild(this.sendToBox);
this.sendToBox.hidden=false;
cpvw_jsUtils.setPosition(this.sendToBox,1,1,1,1);
this.sendToBox.setAttribute("class","cooliris-innerframe");
},onIframeLoad:function(_9){
var _a=document.getElementById("cooliris_sendToFrame").contentDocument;
var _b,_c;
if(_a.URL.indexOf("login.php")!=-1){
_a.getElementById("cooliris_Register").removeEventListener("click",CoolirisFramePanel.saveUserInfo,false);
_a.getElementById("cooliris_Login").removeEventListener("click",CoolirisFramePanel.saveUserInfo,false);
_a.getElementById("cooliris_Register").addEventListener("click",CoolirisFramePanel.saveUserInfo,false);
_a.getElementById("cooliris_Login").addEventListener("click",CoolirisFramePanel.saveUserInfo,false);
var _d=cpvw_Prefs.getUserInfo();
_a.getElementById("cooliris_UserEmail").value=_d[0];
_b=parseInt(_a.getElementById("width").value);
_c=parseInt(_a.getElementById("height").value);
}else{
if(_a.URL.indexOf("sendto.php")!=-1){
var _e=cpvw_Prefs.getSendToEmail();
if(_a.getElementById("cooliris_sendToLink")==null){
return;
}
if(CoolirisFramePanel.fromPreview){
var _f=document.getElementById("cooliris-preview-frame");
var _10=_f.contentDocument.URL;
if(_f.contentDocument.URL=="chrome://cooliris/content/coolirisPreviewImages.htm"){
var doc=_f.contentDocument;
if(doc.getElementById("imgPreview").style.visibility=="visible"){
_10=doc.getElementById("imgPreview").getAttribute("src");
}else{
_10=doc.getElementById("tmpImgPreview").getAttribute("src");
}
}
CoolirisFramePanel.link=_10;
CoolirisFramePanel.subject=_f.contentDocument.title;
CoolirisFramePanel.notes="";
}
_a.getElementById("cooliris_sendToLink").value=CoolirisFramePanel.link;
_a.getElementById("cooliris_sendToEmail").value=_e;
_a.getElementById("cooliris_sendToSubject").value=CoolirisFramePanel.subject;
_a.getElementById("cooliris_sendToNotes").value=CoolirisFramePanel.notes;
_a.getElementById("cooliris_sendToSend").removeEventListener("click",CoolirisFramePanel.saveToEmailAddress,false);
_a.getElementById("cooliris_sendToSend").addEventListener("click",CoolirisFramePanel.saveToEmailAddress,false);
_b=parseInt(_a.getElementById("width").value);
_c=parseInt(_a.getElementById("height").value);
}
}
var _12=document.getElementById("cooliris_sendToBox");
if(_12.style.height!=_c){
var _13=(screen.width/2)-(_b/2);
var top=(screen.height/2)-(_c/2);
if(CoolirisFramePanel.fromPreview){
var _15=cpvw_previewHandler.dimPreview;
_13=_15.left+90;
top=_15.top+27;
}
cpvw_jsUtils.setPosition(cpvw_get("closeCoolirisFramePanel"),_13+_b-18,top+1,18,18,true);
cpvw_jsUtils.setPosition(_12,_13,top,_b,1);
var _16=new cooliris_wc_clsWebControl(_12,new cooliris_wc_Point(_13,top),new cooliris_wc_Point(_13,top),"expand");
_16.setDim(new cooliris_wc_Dim(_b,20),new cooliris_wc_Dim(_b,_c));
_16.maxTimes=10;
setTimeout(function(){
_16.expand();
},0);
}
},saveToEmailAddress:function(){
var _17=document.getElementById("cooliris_sendToFrame").contentDocument;
var _18=_17.getElementById("cooliris_sendToEmail").value;
cpvw_Prefs.setSendToEmail(_18);
setTimeout(function(){
CoolirisFramePanel.checkEmailSent();
},500);
},checkEmailSent:function(){
var _19=document.getElementById("cooliris_sendToFrame").contentDocument;
if(_19.getElementById("cooliris_sendToStatus").value=="-1"){
setTimeout(function(){
CoolirisFramePanel.checkEmailSent();
},500);
}
if(_19.getElementById("cooliris_sendToStatus").value=="1"){
setTimeout(function(){
CoolirisFramePanel.closeSendToOptions();
},3000);
}
},closeSendToOptions:function(){
if(this.sendToBox!=null){
document.getElementById("main-window").removeChild(this.sendToBox);
}
delete this.sendToBox;
this.sendToBox=null;
this.isSendToOpen=false;
cpvw_previewHandler.stickPreview(false);
},saveUserInfo:function(){
var _1a=document.getElementById("cooliris_sendToFrame").contentDocument;
var _1b=_1a.getElementById("cooliris_UserEmail").value;
var _1c=_1a.getElementById("cooliris_UserPwd").value;
if(cpvw_jsUtils.trimWhitespace(_1b)==""||cpvw_jsUtils.trimWhitespace(_1c)==""){
alert("Username/Password empty");
}else{
cpvw_Prefs.setUserEmail(_1b,_1c);
}
}};

