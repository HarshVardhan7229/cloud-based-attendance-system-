window.onload=function(){
showLogin();
}

function hideAll(){
document.getElementById("login").style.display="none";
document.getElementById("teacherLogin").style.display="none";
document.getElementById("register").style.display="none";
document.getElementById("forgot").style.display="none";
document.getElementById("dashboard").style.display="none";
document.getElementById("teacherDashboard").style.display="none";
document.getElementById("studentForm").style.display="none";
}

function showLogin(){
hideAll();
document.getElementById("login").style.display="block";
}

function showTeacherLogin(){
hideAll();
document.getElementById("teacherLogin").style.display="block";
}

function showRegister(){
hideAll();
document.getElementById("register").style.display="block";
}

function showForgot(){
hideAll();
document.getElementById("forgot").style.display="block";
}

function showStudentForm(){
document.getElementById("studentForm").style.display="block";
}

/* REGISTER */
function registerUser(){

let email=document.getElementById("r_email").value.trim();
let pass=document.getElementById("r_pass").value.trim();
let mail=document.getElementById("r_student_email").value.trim();

if(email=="" || pass=="" || mail==""){
alert("Please fill all fields");
return;
}

if(localStorage.getItem(email)){
alert("User already exists");
return;
}

localStorage.setItem(email,pass);
localStorage.setItem(email+"_mail",mail);

alert("Registration Successful");
showLogin();
}

/* STUDENT LOGIN */
function login(){

let email=document.getElementById("email").value.trim();
let pass=document.getElementById("pass").value.trim();

if(localStorage.getItem(email)==pass){
hideAll();
document.getElementById("dashboard").style.display="block";
loadData();
}else{
alert("Invalid Email or Password");
}
}

/* TEACHER LOGIN */
function teacherLogin(){

let id=document.getElementById("t_email").value.trim();
let pass=document.getElementById("t_pass").value.trim();

if(id=="teacher" && pass=="12345"){
hideAll();
document.getElementById("teacherDashboard").style.display="block";
loadTeacherData();
}else{
alert("Invalid Teacher Login");
}
}

/* FORGOT PASSWORD */
function resetPassword(){

let email=document.getElementById("f_email").value.trim();
let newPass=document.getElementById("new_pass").value.trim();

if(localStorage.getItem(email)==null){
alert("Email not registered");
return;
}

localStorage.setItem(email,newPass);

alert("Password Changed Successfully");
showLogin();
}

/* MARK ATTENDANCE */
function markAttendance(){

let data=JSON.parse(localStorage.getItem("att")) || [];

data.push({
name:document.getElementById("name").value,
subject:document.getElementById("subject").value,
status:document.getElementById("status").value,
date:new Date().toLocaleDateString()
});

localStorage.setItem("att",JSON.stringify(data));

loadData();
checkAttendanceAndSendMail();
}

/* QR SUBMIT */
function submitQRAttendance(){

let data=JSON.parse(localStorage.getItem("att")) || [];

data.push({
name:document.getElementById("scanName").value,
date:document.getElementById("scanDate").value,
subject:document.getElementById("scanSubject").value,
course:document.getElementById("scanCourse").value,
slot:document.getElementById("scanSlot").value,
status:"Present"
});

localStorage.setItem("att",JSON.stringify(data));

alert("Attendance Saved Successfully");

loadData();
checkAttendanceAndSendMail();
}

/* STUDENT DATA */
function loadData(){

let list=document.getElementById("list");
list.innerHTML="";

let data=JSON.parse(localStorage.getItem("att")) || [];

data.forEach(function(d){

let li=document.createElement("li");
li.innerHTML=
(d.name||"")+" | "+
(d.date||"")+" | "+
(d.subject||"")+" | "+
(d.course||"")+" | "+
(d.slot||"")+" | "+
(d.status||"");

list.appendChild(li);

});
}

/* TEACHER DATA */
function loadTeacherData(){

let list=document.getElementById("teacherList");
list.innerHTML="";

let data=JSON.parse(localStorage.getItem("att")) || [];

data.forEach(function(d){

let li=document.createElement("li");
li.innerHTML=
(d.name||"")+" | "+
(d.date||"")+" | "+
(d.subject||"")+" | "+
(d.course||"")+" | "+
(d.slot||"")+" | "+
(d.status||"");

list.appendChild(li);

});
}

/* EXPORT */
function exportExcel(){

let data=JSON.parse(localStorage.getItem("att")) || [];

let ws=XLSX.utils.json_to_sheet(data);
let wb=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"Attendance");
XLSX.writeFile(wb,"attendance.xlsx");
}

/* QR */
function generateQR(){

let qr=document.getElementById("qrcode");
qr.innerHTML="";

QRCode.toCanvas("Scan QR and fill attendance",{width:180},function(error,canvas){
if(error)return;
qr.appendChild(canvas);
});
}

/* MAIL ALERT */
function checkAttendanceAndSendMail(){

let data=JSON.parse(localStorage.getItem("att")) || [];
let total=data.length;

if(total==0)return;

let absent=data.filter(x=>x.status=="Absent").length;
let percent=((total-absent)/total)*100;

if(percent<75){

for(let i=0;i<localStorage.length;i++){

let key=localStorage.key(i);

if(key.endsWith("_mail")){

let mail=localStorage.getItem(key);

window.location.href=
"mailto:"+mail+
"?subject=Low Attendance Warning"+
"&body=Your attendance is "+percent.toFixed(2)+"%. Please improve above 75%.";

break;
}
}
}
}

function logout(){
showLogin();
}
