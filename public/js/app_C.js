var date = document.querySelector('.date')
var week = document.querySelector('.week')
var dateNew = new Date()
var str = dateNew.getFullYear() + '-' + dateNew.getMonth()+1 + '-' + dateNew.getDate()
var dayWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const user = document.querySelector('.user').textContent
// creatBoard();
var xhr = new XMLHttpRequest();
console.log("/API/aca/course?id="+user)
xhr.open("GET", "/API/aca/course?id="+user);
xhr.send();
xhr.onload = () => {
    console.log(xhr.responseText)
    let DB = JSON.parse(xhr.responseText);
    creatBoard(DB)
}

date.textContent = str

week.textContent = dayWeek[dateNew.getDay()-1] 

const container = document.querySelector('.container')
var choiceYear = document.querySelector('.choiceYear')
console.log(choiceYear.value)

var course = document.querySelectorAll('.course')
var place = document.querySelectorAll('.place')
function creatClass(){
    console.log(choiceYear.value)
    var now = choiceYear.value-1
    if(now == -1) now = dateNew.getDay()-1
    console.log(now)
    for(let i = 1; i < 15; i++){
        if(dataClass[now][i-1].course != '　'){
            var title = course[i].parentElement
            title.style.color = '#161616'
            console.log(i-1)
            course[i].textContent = dataClass[now][i-1].course  
            console.log(dataClass[now][i].course) 
            place[i].textContent = dataClass[now][i-1].place
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