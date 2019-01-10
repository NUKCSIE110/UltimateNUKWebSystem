var express = require('express');
var router = express.Router();
// var elearning = require('../elearning');
var name = 'guest'
/* GET home page. */
router.get('/homework', async function (req, res, next) {
   // let db = await login()
   // await console.log(db)
   if(req.signedCookies.account && req.signedCookies.passwd){
      isLogin = true;
  }
  else{
   res.redirect('/login');
}
   res.render('hw', { title: '路徑為 : ' ,member:req.signedCookies.account,content:req.url});
   
});
router.get('/annoucement', function (req, res, next) {
   if(req.signedCookies.account && req.signedCookies.passwd){
      isLogin = true;
  }
  else{
   res.redirect('/login');
   }
   res.render('index', { title: '路徑為 : ' ,member:req.signedCookies.account,content:req.url});

});

router.get('/', function (req, res, next) {
   if(req.signedCookies.account && req.signedCookies.passwd){
      isLogin = true;
  }
  else{
   res.redirect('/login');
   }
   res.render('index', { title: '路徑為 : ' ,member:req.signedCookies.account,content:req.url});

});
//functions

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
var account = require('../account.js')
var driver = new webdriver.Builder()
   .forBrowser('chrome')
   .withCapabilities(webdriver.Capabilities.chrome()) 
   .setChromeOptions(options)                         
   .build();

var studentID = account[0];
var password = account[1];
const linkList=[]//課程名及其連結
const boardINF=[]//布告欄資料
const hwINF=[]//上傳作業資料
const hwURL='http://elearning.nuk.edu.tw/m_stujobs/m_stujobs_stuupload.php?bStu_id='+studentID.toUpperCase()

//login()

async function login() {
   driver.get('http://elearning.nuk.edu.tw/login_page_2.php');
   await driver.executeScript(function(studentID,password){
      let stuid=document.querySelector('#stuid')
      let stupw=document.querySelector('#stupw')
      stuid.value=studentID
      stupw.value=password
      document.form1.submit();
   },studentID,password)
   await driver.navigate().to('http://elearning.nuk.edu.tw/m_student/m_stu_index.php')//課程列表
   await driver.getPageSource().then(async function(html){
      getLink(html)
   })
   //await getBoard()//爬布告欄
   //await getHw()//爬上傳作業區
   console.log(linkList)
   console.log(boardINF)
   console.log(hwINF)
   return boardINF
}

async function getLink(value){//拿到課程列表及連結
   let $ = cheerio.load(value)
   $('.hurl_black_L').each(function(){
      let color=$(this).parent().attr('bgcolor')//上層才有背景色
      if(color=='#FFDCD7'){
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
               const Text = datas.eq(i).find('.insidepage_contentdiv').text()  //取得內容
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

module.exports = router;


