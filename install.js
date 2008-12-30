var XpiInstaller={extFullName:"Cooliris Previews",extShortName:"cooliris",extVersion:"2.7",extAuthor:"Cooliris Inc, www.coolpreviews.com",extLocaleNames:["en-US"],extSkinNames:["classic"],extPostInstallMessage:"Success! Please restart your browser to finish the installation.",profileInstall:true,silentInstall:true,install:function(){
var _1=this.extShortName+".jar";
var _2=getFolder("Profile","extensions/"+"{CE6E6E3B-84DD-4cac-9F63-8D2AE4F30A4B}");
var _3=Install.getFolder(_2,"chrome");
this.parseArguments();
if(File.exists(Install.getFolder(_3,_1))){
if(!this.silentInstall){
Install.alert("Updating existing Profile install of "+this.extFullName+" to version "+this.extVersion+".");
}
this.profileInstall=true;
}else{
if(!this.silentInstall){
this.profileInstall=Install.confirm("Install "+this.extFullName+" "+this.extVersion+" to your Profile directory (OK) or your Browser directory (Cancel)?");
}
}
var _4=this.extFullName+" "+this.extVersion;
var _5="/"+this.extAuthor+"/"+this.extShortName;
Install.initInstall(_4,_5,this.extVersion);
var _6;
if(this.profileInstall){
_6=_3;
}else{
_6=Install.getFolder("chrome");
}
Install.addFile(null,"chrome/"+_1,_6,null);
var _7=Install.getFolder(_6,_1);
var _8=this.profileInstall?Install.PROFILE_CHROME:Install.DELAYED_CHROME;
Install.registerChrome(Install.CONTENT|_8,_7,"content/"+this.extShortName+"/");
for(var _9 in this.extLocaleNames){
var _a="locale/"+this.extShortName+"/"+this.extLocaleNames[_9]+"/";
Install.registerChrome(Install.LOCALE|_8,_7,_a);
}
for(var _b in this.extSkinNames){
var _a="skin/"+this.extSkinNames[_b]+"/"+this.extShortName+"/";
Install.registerChrome(Install.SKIN|_8,_7,_a);
}
var _c=Install.performInstall();
if(_c==Install.SUCCESS||_c==Install.REBOOT_NEEDED){
if(!this.silentInstall&&this.extPostInstallMessage){
Install.alert(this.extPostInstallMessage);
}
}else{
this.handleError(_c);
return;
}
},parseArguments:function(){
var _d=Install.arguments;
if(_d=="p=0"){
this.profileInstall=false;
this.silentInstall=true;
}else{
if(_d=="p=1"){
this.profileInstall=true;
this.silentInstall=true;
}
}
},handleError:function(_e){
if(!this.silentInstall){
Install.alert("Error: Could not install "+this.extFullName+" "+this.extVersion+" (Error code: "+_e+")");
}
Install.cancelInstall(_e);
}};
XpiInstaller.install();

