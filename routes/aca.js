var express = require('express')
var router = express.Router()
var admin = require("firebase-admin");
var fireData = require('../service/firedata');

var classList=[[],[],[],[],[]];
var getScore = "";
var scoreList = { whichYear: [], course: [], yearScore_td: [] };
var getList = "";
var studentID;
var passwd;

router.get('/course', async function (req, res, next) {
   if(req.signedCookies.account && req.signedCookies.passwd){
      studentID = req.signedCookies.account;
      passwd = req.signedCookies.passwd;
      classList=[[],[],[],[],[]];
      getScore = "";
      scoreList = { whichYear: [], course: [], yearScore_td: [] };
      getList = "";
      // if(!hasCourseData())
         await logInStudentSystemCourse()
      isLogin = true;
  }
  else{
   res.redirect('/login');
   }
   await res.render('class', { title: '路徑為 : ',member:req.signedCookies.account ,content:req.url});

});
router.get('/grades', async function (req, res, next) {
   if(req.signedCookies.account && req.signedCookies.passwd){
      studentID = req.signedCookies.account;
      passwd = req.signedCookies.passwd;
      classList=[[],[],[],[],[]];
      getScore = "";
      scoreList = { whichYear: [], course: [], yearScore_td: [] };
      getList = "";
       isLogin = true;
      //  if(!hasGradeData())
         await logInStudentSystem();
       
       await res.render('grade', { title: '路徑為 : ',member:req.signedCookies.account ,content:req.url});
  }
  else{
   res.redirect('/login');
   }
   

});

// const account = require("../account.js")
var webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome')
const cheerio = require("cheerio");
By = webdriver.By,
    until = webdriver.until,
    options = new chrome.Options();
options.addArguments('headless'); 
options.addArguments('disable-gpu');//no longer necessary on Linux or Mac OSX 
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();
// studentID = account[0];
// password = account[1];
async function logInStudentSystemCourse() {
   await driver.get("https://course.nuk.edu.tw/Sel/Login.asp");
   driver.getTitle().then(function (title) {
       console.log(title);
   })
   // await setTimeout(async function logIn() {
      await driver.findElement(webdriver.By.name('Account')).sendKeys(studentID);
      await driver.findElement(webdriver.By.name('Password')).sendKeys(passwd);
      await driver.findElement(webdriver.By.name('B1')).click();
      await getClassListCourse();
   // },200)
   
}
async function getClassListCourse() {
   driver.get("https://course.nuk.edu.tw/Sel/roomlist1.asp");
   getList = await driver.findElement(webdriver.By.tagName('html')).getAttribute('innerHTML');
   await listCourse();
   await showCourse();
}
async function listCourse(){
   const $ = cheerio.load(getList);
   const table_tr =await $("tbody tr");
   for (let i = 1; i < table_tr.length; i++) { // 走訪 tr
       const table_td = table_tr.eq(i).find('td'); // 擷取每個欄位(td)
       const mon = table_td.eq(2).text();
       const tue = table_td.eq(3).text();
       const wed = table_td.eq(4).text();
       const thu = table_td.eq(5).text();
       const fri = table_td.eq(6).text();
       classList[0].push(mon);
       classList[1].push(tue);
       classList[2].push(wed);
       classList[3].push(thu);
       classList[4].push(fri);
     }
}
async function showCourse() {
   await console.log(classList);
   //TODO:
   var courseCheck = fireData.ref('/'+studentID.toUpperCase());
   await courseCheck.once('value').then((snapshot)=>{
      if(!snapshot.hasChild('course')){
         var createStudent = fireData.ref('/'+studentID.toUpperCase());
         createStudent.child("course").set(classList)
      }
   })
   // var createStudent = fireData.ref('/'+studentID);
   // createStudent.child("course").set(classList)
   // var isCourseExist = fireData.ref('/'+studentID);
   // isCourseExist.once('value', function(snapshot) {
   //    if (!snapshot.hasChild('course')) {
   //       var createStudent = fireData.ref('/'+studentID);
   //       createStudent.child("course").set(classList)
   //    }
   //  });
   
   
}

async function logInStudentSystem() {
   await driver.get("https://aca.nuk.edu.tw/Student2/login.asp");
   await setTimeout(async function logIn() {
       await driver.findElement(webdriver.By.name('Account')).sendKeys(studentID);
       await driver.findElement(webdriver.By.name('Password')).sendKeys(passwd);
       await driver.findElement(webdriver.By.name('B1')).click();
       await getGradeData();
   }, 200);
}

async function getGradeData() {
   driver.get("https://aca.nuk.edu.tw/Student2/SO/ScoreQuery.asp");
   getScore = await driver.findElement(webdriver.By.tagName('html')).getAttribute('innerHTML');
   await list();
   await show();
}

async function list() {
   const $ = cheerio.load(getScore);
   const year = await $("body");
   const listYear = await year.find('p font b');
   const yearScore_tr = await year.find('p table tbody tr');
   const block = await year.find('table');
   var counter = 0;
   for (let i = 0; i < listYear.length; i++) {
       scoreList.whichYear.push(listYear.eq(i).text().slice(0,3)+"_"+listYear.eq(i).text().slice(7,-2));
   }
   for (let i = 1; i < block.length-1; i++) { // 走訪 tr
       const table_tr = block.eq(i).find('tbody tr'); // 擷取每個欄位(td)
       for (let j = 1; j < table_tr.length; j++) {
           const table_td = table_tr.eq(j).find('td');
           const courseNum = table_td.eq(0).text();
           const courseName = table_td.eq(1).text();
           const courseCredit = table_td.eq(2).text();
           const courseElective = table_td.eq(3).text();
           const courseScore = table_td.eq(5).text();
           var path = [scoreList.whichYear[counter].slice(0,3),scoreList.whichYear[counter].slice(4,-1),courseNum, courseName, courseCredit, courseElective, courseScore];
           scoreList.course.push(path);
           if(j==table_tr.length-1){
               counter++;
           }
       }
   }
   for(let j = 0;j<yearScore_tr.length-1;j++){
       const yearScore_td = yearScore_tr.eq(j).find('td');
       const yearCreditShouldGet = yearScore_td.eq(0).text();
       const yearCreditWhichGet = yearScore_td.eq(1).text();
       const everageScore = yearScore_td.eq(2).text();
       const rank = yearScore_td.eq(3).text();
       var path = [yearCreditShouldGet,yearCreditWhichGet, everageScore,rank];
       scoreList.yearScore_td.push(path);
   }
}
async function show() {
   
   await console.log(scoreList);
   var scoreCheck = fireData.ref('/'+studentID.toUpperCase());
   await scoreCheck.once('value').then((snapshot)=>{
      if(!snapshot.hasChild('score')){
         var createStudent = fireData.ref('/'+studentID.toUpperCase());
         createStudent.child("score").set(scoreList)
      }
   })

   // var scoreCheck = fireData.ref('/'+studentID+'/score/whichYear');
   // await scoreCheck.once('value').then((snapshot)=>{
   //    console.log(snapshot.val().length, scoreList['whichYear'].length)
   //    if(snapshot.val().length != scoreList['whichYear'].length){
   //       var createStudent = fireData.ref('/'+studentID);
   //       createStudent.child("score").set(scoreList)
   //    }
   // })
   // var createStudent = fireData.ref('/'+studentID);
   // createStudent.child("score").set(scoreList)
}
async function hasCourseData(){
   var db = fireData.ref('/'+studentID);
   await db.once('value').then((snapshot)=>{
      if(!snapshot.hasChild('course')){
         return true;
      }
      else{
         return false;
      }
   })
}
async function hasGradeData(){
   var db = fireData.ref('/'+studentID);
   await db.once('value').then((snapshot)=>{
      if(!snapshot.hasChild('score')){
         return true;
      }
      else{
         return false;
      }
   })
}
module.exports = router