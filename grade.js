var studentID = '帳號';
var password = '密碼';
var getScore = "";
var scoreList = { whichYear: [], course: [], yearScore_td: [] };

var webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome')
const cheerio = require("cheerio");
const account = require("./account.js")
By = webdriver.By,
    until = webdriver.until,
    options = new chrome.Options();
options.addArguments('headless'); // note: without dashes
// options.addArguments('disable-gpu'); //no longer necessary on Linux or Mac OSX 
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();
logInStudentSystem();
async function logInStudentSystem() {
    driver.get("https://aca.nuk.edu.tw/Student2/login.asp");
    await setTimeout(async function logIn() {
        await driver.findElement(webdriver.By.name('Account')).sendKeys(account[0]);
        await driver.findElement(webdriver.By.name('Password')).sendKeys(account[1]);
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
    console.log(scoreList);
}