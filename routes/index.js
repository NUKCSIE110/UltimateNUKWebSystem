var fs = require('fs');
var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var fireData = require('../service/firedata');
var cheerio=require('cheerio')
var webdriver = require('selenium-webdriver'),
   chrome    = require('selenium-webdriver/chrome')
   // By        = webdriver.By,  //不會用到
   // until     = webdriver.until,
   options   = new chrome.Options();
   options.addArguments('headless'); 
   options.addArguments('disable-gpu')
// var path = require('chromedriver').path;
// var service = new chrome.ServiceBuilder(path).build();
//     chrome.setDefaultService(service);
var driver = new webdriver.Builder()
   .forBrowser('chrome')
   .withCapabilities(webdriver.Capabilities.chrome()) 
   .setChromeOptions(options)                         
   .build();
var linkList=[]//課程名及其連結
var boardINF=[]//布告欄資料
var hwINF=[]//上傳作業資料
var hwURL=''
var isLogin=false;
var account = ['','']
var currentDB = ''
var getScore = "";
var scoreList = { whichYear: [], course: [], yearScore_td: [] };
var getList = "";
var classList=[[],[],[],[],[]];
var studentID = '';
var password = '';
// var serviceAccount = require("../service/js-finalproj-firebase-adminsdk-44exn-348afa61bf.json");
// var defaultAuth = firebase.auth();
/* GET home page. */
router.get('/', function (req, res, next) {
   var name='guest';
   if(req.signedCookies.account){
       isLogin = true;
   }
   else{
       return res.redirect('/login');
   }
   res.render('index', { title: 'Express', member:req.signedCookies.account, logstatus:isLogin });
   // res.render('index');
});

router.get('/login', function (req, res, next) {
   var name='guest';
  if(req.signedCookies.account){
       isLogin = true;
   }
   res.clearCookie('account',{path:'/'});
   res.clearCookie('passwd',{path:'/'});
   res.render('login', { title: 'Express', member:req.signedCookies.account, logstatus:isLogin });
});
router.post('/login', async function (req, res, next) {
    if(req.body.account=="" || req.body.passwd=="")
    {
        res.render('login');
    }else{
        account[0] = await req.body.account.toUpperCase();
        account[1] = await req.body.passwd;
      //   if(await !hasData())
         await login()
        if(!linkList.length && !boardINF.length && !hwINF.length){
         await res.render('error');
        }
      //   await run();
      //   await logInStudentSystemCourse();
        await res.cookie('account', req.body.account.toUpperCase(), { path: '/', signed: true, maxAge:6000000});  //set cookie
        await res.cookie('passwd', req.body.passwd, { path: '/', signed: true, maxAge:6000000 }); //set cookie
        return await res.redirect('/');
    }
    res.render('login');
});
router.get('/logout', function(req, res) {
    // ...
    res.clearCookie('account',{path:'/'});
　　res.clearCookie('passwd',{path:'/'});
    return res.redirect('/');
});




//login()

async function run(){
    await logInStudentSystemCourse();
   //  await logInStudentSystem();
}
async function login() {
   studentID = account[0];
   password = account[1];
    linkList=[]//課程名及其連結
    boardINF=[]//布告欄資料
    hwINF=[]//上傳作業資料
    hwURL='http://elearning.nuk.edu.tw/m_stujobs/m_stujobs_stuupload.php?bStu_id='+studentID.toUpperCase()

   driver.get('http://elearning.nuk.edu.tw/login_page_2.php');
   await driver.executeScript(function(studentID,password){
      let stuid=document.querySelector('#stuid')
      let stupw=document.querySelector('#stupw')
      stuid.value=studentID
      stupw.value=password
      document.form1.submit();
   },studentID,password)
   currentURL = await driver.getCurrentUrl();
   console.log(currentURL)
   if(currentURL.includes('http://elearning.nuk.edu.tw/login_page_2.php')){
      return;
   }
   await driver.navigate().to('http://elearning.nuk.edu.tw/m_student/m_stu_index.php')//課程列表
   await driver.getPageSource().then(async function(html){
      getLink(html)
   })
   await getBoard()//爬布告欄
   await getHw()//爬上傳作業區
   console.log(linkList)
   console.log(boardINF)
   console.log(hwINF)
   // var createData = fireData.ref('/');
   // createData.child('classes').set(linkList)
   // run();
   let pushData = await JSON.parse(
      '[' + JSON.stringify(linkList)+
      ',' + JSON.stringify(boardINF)+
      ',' + JSON.stringify(hwINF) + ']'
  );
  var createStudent = fireData.ref('/');
  createStudent.child(studentID.toUpperCase()).set(pushData)
   // let pushData = await JSON.parse(
   //      '[' + JSON.stringify(linkList)+
   //      ',' + JSON.stringify(boardINF)+
   //      ',' + JSON.stringify(hwINF) + ']'
   //  );
   //  var createStudent = fireData.ref('/');
   //  createStudent.child(studentID).set(pushData)
   //  console.log(pushData)
}

async function getLink(value){//拿到課程列表及連結
   let $ = cheerio.load(value)
   $('.hurl_black_L').each(function(){
            let code = $(this).parent().prev().text()//上層才有背景色
            console.log("code => " + code)
            if(code.slice(7)=='1072'){
                let name=$(this).text()
                let link = $(this).attr('href')
                str='http://elearning.nuk.edu.tw/'
                str+=link.slice(3)
                linkList.push({'name':name,'link':str})
            }  
        })
}

async function getBoard(){
   for(var i in linkList){
      let course=linkList[i]
      let url=course['link']
      await driver.navigate().to(url)
      await driver.getPageSource().then(async function(html){
            const $ = cheerio.load(html)
            const datas = $(".clearFrom tbody div")   //布告欄外層 div(可走訪)
            for(let i = 0; i < datas.length; i++){
               const Title = datas.eq(i).find('.txt_black_ON').parent().text()  //取得時間和標題
               const title = Title.replace(/ /g,'')
               const Text = datas.eq(i).find('.insidepage_contentdiv').toString()  //取得內容
               const Text_space = Text.replace(/ /g,'') //去掉所有空白
               const Text_n = Text_space.replace(/\n/g,'') //去掉所有\n
               const Text_t = Text_n.replace(/\t/,'') //去掉開頭\t
               const Text_tt = Text_t.replace(/\t\t/g,'。 ') //取代\t\t為 。
               const text = Text_tt.replace(/\t/g,' ') //去掉所有\t
               if(title == '')continue //若為空則不存入陣列
               else{
                  boardINF.push( {"course":course['name'],"title":title,"text":text})
               }
            }
      }) 
}
}

async function getHw(){
   for(var i in linkList){
      let course=linkList[i]
      let url=course['link']
      await driver.navigate().to(url)//布告欄
      await driver.navigate().to(hwURL)//上傳作業區
      await driver.getPageSource().then(async function(html){
            let $=cheerio.load(html)
            $('#gstujobs_cy').children().each(function(){
               let option = $(this).text()
               if(option!=='心得'&&option!=='作業'){
                  let hw=option.substr(0,option.length-17)
                  let deadLine=option.substr(-11,10)
                  hwINF.push({'name':course['name'],'hw':hw,'deadLine':deadLine})
               }  
            })
      })
   }
}

// TODO:
async function logInStudentSystem() {
   driver.get("https://aca.nuk.edu.tw/Student2/login.asp");
   await setTimeout(async function logIn() {
       await driver.findElement(webdriver.By.name('Account')).sendKeys(studentID);
       await driver.findElement(webdriver.By.name('Password')).sendKeys(password);
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
       await scoreList.whichYear.push(listYear.eq(i).text().slice(0,3)+"_"+listYear.eq(i).text().slice(7,-2));
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
           await scoreList.course.push(path);
           if(j==table_tr.length-1){
               counter++;
           }
       }
   }
   for(let j = 0;j<yearScore_tr.length-1;j++){
       const yearScore_td = await yearScore_tr.eq(j).find('td');
       const yearCreditShouldGet = await yearScore_td.eq(0).text();
       const yearCreditWhichGet = await yearScore_td.eq(1).text();
       const everageScore = await yearScore_td.eq(2).text();
       const rank = yearScore_td.eq(3).text();
       var path = [yearCreditShouldGet,yearCreditWhichGet, everageScore,rank];
       await scoreList.yearScore_td.push(path);
   }
}
async function show() {
   await console.log(scoreList);
   await logInStudentSystem()
   await driver.get("https://aca.nuk.edu.tw/Student2/Logout.asp");
}
//TODO:
async function logInStudentSystemCourse() {
   await driver.get("https://course.nuk.edu.tw/Sel/Login.asp");
      await driver.findElement(webdriver.By.name('Account')).sendKeys(studentID);
   await driver.findElement(webdriver.By.name('Password')).sendKeys(password);
   await driver.findElement(webdriver.By.name('B1')).click();
   await getClassListCourse();
  //}, 200);
   
}
async function getClassListCourse() {
   await driver.get("https://course.nuk.edu.tw/Sel/roomlist1.asp");
   getList = await driver.findElement(webdriver.By.tagName('html')).getAttribute('innerHTML');
   await listCourse();
   await showCourse();
}
async function listCourse(){
   const $ = cheerio.load(getList);
   const table_tr =await $("tbody tr");
   for (let i = 1; i < table_tr.length; i++) { // 走訪 tr
       const table_td = table_tr.eq(i).find('td'); // 擷取每個欄位(td)
       const monPath = table_td.eq(2).text();
       const tuePath = table_td.eq(3).text();
       const wedPath = table_td.eq(4).text();
       const thuPath = table_td.eq(5).text();
       const friPath = table_td.eq(6).text();
       const mon=[monPath.slice(6,-7),monPath.slice(-7,)];
       const tue=[monPath.slice(6,-7),monPath.slice(-7,)];
       const wed=[monPath.slice(6,-7),monPath.slice(-7,)];
       const thu=[monPath.slice(6,-7),monPath.slice(-7,)];
       const fri=[monPath.slice(6,-7),monPath.slice(-7,)];
       classList[0].push(mon);
       classList[1].push(tue);
       classList[2].push(wed);
       classList[3].push(thu);
       classList[4].push(fri);
     }
}
async function showCourse() {
   await driver.get("https://course.nuk.edu.tw/Sel/Logout.asp");
   await console.log(classList);
   let pushData = await JSON.parse(
      '[' + JSON.stringify(linkList)+
      ',' + JSON.stringify(boardINF)+
      ',' + JSON.stringify(hwINF) + 
      ',' + JSON.stringify(scoreList) + 
      ',' + JSON.stringify(classList) + ']'
  );
  var createStudent = fireData.ref('/');
  createStudent.child(studentID.toUpperCase()).set(pushData)
  console.log(pushData)
}
async function hasData(){
   var db = fireData.ref('/');
   await db.once('value').then((snapshot)=>{
      if(snapshot.hasChild(account[0].toUpperCase())){
         console.log(true)
         return true;
      }
      else{
         console.log(false)
         return false;
      }
   })
}
module.exports = router;