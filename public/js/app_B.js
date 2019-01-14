const container = document.querySelector('.container')
const user = document.querySelector('.welcome').textContent
// creatBoard();
var xhr = new XMLHttpRequest();
console.log("/API/elearning/annoucement?id="+user.toUpperCase())
xhr.open("GET", "/API/elearning/annoucement?id="+user.toUpperCase());
xhr.send();
let os;
xhr.onload = () => {
    console.log(xhr.responseText)
    os = JSON.parse(xhr.responseText)
    let DB = JSON.parse(xhr.responseText).sort((a,b)=>{
        // console.log(a.title.split(' ')[0],b.title.split(' ')[0])
        let diffA = a.title.slice(0,10)
        let diffB = b.title.slice(0,10)
        console.log(diffA,diffB)
        return a.title.slice(0,10) > b.title.slice(0,10)?-1:1;
    });
    console.log(DB)
    creatBoard(DB)
    let tags = document.querySelectorAll('#TAG');
    for(let i of tags){
        i.addEventListener('click',(e)=>{
            document.querySelector('.mask').classList.remove('hide')
        })
    }
}
function clk(){
    // document.querySelector('.mask').classList.add('ultraMask')
    document.querySelector('.mask').classList.remove('hide')
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
