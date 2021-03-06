const container = document.querySelector('.container')
// creatHW();
const user = document.querySelector('.welcome').textContent
var xhr = new XMLHttpRequest();
console.log("/API/elearning/homework?id="+user.toUpperCase())
xhr.open("GET", "/API/elearning/homework?id="+user.toUpperCase());
xhr.send();
xhr.onload = () => {
    console.log(xhr.responseText)
    let DB = JSON.parse(xhr.responseText);
    creatHW(DB)
    let tags = document.querySelectorAll('#TAG');
    for(let i of tags){
        i.addEventListener('click',(e)=>{
            document.querySelector('.mask').classList.remove('hide')
        })
    }
}

function creatHW(DB_){
                //作業資料
    for(let i in DB_){
        var homework = document.createElement('div')
        homework.classList.add('homework')
        container.appendChild(homework)

        var course = document.createElement('p')
        course.textContent = DB_[i].name
        course.classList.add('course')
        
        var job = document.createElement('p')
        job.textContent = DB_[i].hw
        job.classList.add('job')

        var time = document.createElement('p')
        time.innerHTML = "Deadline:<br>" + DB_[i].deadLine
        time.classList.add('time')
        console.log(time)
        homework.appendChild(course)
        homework.appendChild(job)
        homework.appendChild(time)
    }
}