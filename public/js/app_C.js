var date = document.querySelector('.date')
var week = document.querySelector('.week')
var dateNew = new Date()
var str = dateNew.getFullYear() + '-' + dateNew.getMonth()+1 + '-' + dateNew.getDate()
var dayWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat','Sun']
const user = document.querySelector('.user').textContent
// creatBoard();
var DB;
var xhr = new XMLHttpRequest();
// console.log("/API/aca/course?id="+user.toUpperCase())
var intervalID = setInterval(()=>{
    xhr.open("GET", "/API/aca/course?id="+user.toUpperCase());
    xhr.send();
    xhr.onload = () => {
        console.log(xhr.responseText)
        DB = JSON.parse(xhr.responseText);
        creatClass(DB)
        if(document.querySelectorAll('.choiceYear option').length > 0){
            clearInterval(intervalID);
        }
    }
},1000)
date.textContent = str

week.textContent = dayWeek[dateNew.getDay()-1] 

const container = document.querySelector('.container')
var choiceYear = document.querySelector('.choiceYear')
console.log(dateNew.getDay()-1)
choiceYear.value = dateNew.getDay()-1
console.log(choiceYear.value)

var course = document.querySelectorAll('.course')
var place = document.querySelectorAll('.place')
function creatClass(){
    // console
    // console.log(dateNew.getDay())
    var now = choiceYear.value
    if(now == -1) now = dateNew.getDay()
    if(now>5) now = 2
    console.log(now,choiceYear.value)
    console.log(DB)
    // console.log(DB[now])
    for(let i = 1; i < 15; i++){
        if(now == 5 || now == 6 || choiceYear.value==5 ||choiceYear.value==6){
            var title = course[i].parentElement
            title.style.color = '#868686'
            course[i].textContent = '養肝'
            place[i].textContent = '溫暖小被窩'
            continue;
        }
        if(DB[now][i-1] != '　'){
            var title = course[i].parentElement
            title.style.color = '#161616'
            // console.log(DB[now][i+1], i)
            course[i].textContent = DB[now][i-1]
            // place[i+1].textContent = ''
            // console.log(course[i+1],place[i+1])
            // // console.log(DB[now][i].course) 
            if(DB[now][i-1].includes('B01-B')){
                course[i].textContent = DB[now][i-1].slice(0,-8)
                place[i].textContent = DB[now][i-1].slice(-8,)
            }
            else if(!DB[now][i-1].includes('體育') && !DB[now][i-1].includes('服務學習培養')){
                // console.log(DB[now][i-1].slice(0,-7),DB[now][i-1].slice(-7,))
                course[i].textContent = DB[now][i-1].slice(0,-7)
                place[i].textContent = DB[now][i-1].slice(-7,)
            }
            else{
                course[i].textContent = DB[now][i-1]
                place[i].textContent = '我也不知道'
            }

        }
        else{
            var title = course[i].parentElement
            title.style.color = '#868686'
            course[i].textContent = '養肝'
            place[i].textContent = '溫暖小被窩'
        }
    }
}
choiceYear.addEventListener('change',creatClass)
creatClass()