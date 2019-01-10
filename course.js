var studentID = '帳號';
var password = '密碼';
var getList = "";
var classList=[[],[],[],[],[]];

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

logInStudentSystem();
async function logInStudentSystem() {
    driver.get("https://course.nuk.edu.tw/Sel/Login.asp");
    driver.getTitle().then(function (title) {
        console.log(title);
    })
    driver.findElement(webdriver.By.name('Account')).sendKeys(studentID);
    driver.findElement(webdriver.By.name('Password')).sendKeys(password);
    await driver.findElement(webdriver.By.name('B1')).click();
    await getClassList();
}
async function getClassList() {
    driver.get("https://course.nuk.edu.tw/Sel/roomlist1.asp");
    getList = await driver.findElement(webdriver.By.tagName('html')).getAttribute('innerHTML');
    await list();
    await show();
}
async function list(){
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
async function show() {
    await console.log(classList);
}