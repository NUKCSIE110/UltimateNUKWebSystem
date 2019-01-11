const container = document.querySelector('.container')
const user = document.querySelector('.user').textContent
// creatBoard();
var xhr = new XMLHttpRequest();
console.log("/API/elearning/annoucement?id="+user)
xhr.open("GET", "/API/elearning/annoucement?id="+user);
xhr.send();
xhr.onload = () => {
    console.log(xhr.responseText)
    let DB = JSON.parse(xhr.responseText);
    creatBoard(DB)
}

function creatBoard(DB_){
                //佈告欄資料
    for(let i in DB_){
        var textBoard = document.createElement('div')
        textBoard.classList.add('textBoard')
        container.appendChild(textBoard)

        var T = document.createElement('p')
        T.textContent = DB_[i].title
        T.classList.add('T')

        var course = document.createElement('p')
        course.textContent = DB_[i].course
        course.classList.add('course')
        
        var t = document.createElement('p')
        t.innerHTML = DB_[i].text
        t.classList.add('t')

        textBoard.appendChild(T)
        textBoard.appendChild(course)
        textBoard.appendChild(t)
    }
}
