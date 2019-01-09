const container = document.querySelector('.container')
creatHW();

function creatHW(){
                //作業資料
    for(let i in dataHW){
        var homework = document.createElement('div')
        homework.classList.add('homework')
        container.appendChild(homework)

        var course = document.createElement('p')
        course.textContent = dataHW[i].course
        course.classList.add('course')
        
        var job = document.createElement('p')
        job.textContent = dataHW[i].job
        job.classList.add('job')

        var time = document.createElement('p')
        time.textContent = dataHW[i].time
        time.classList.add('time')

        homework.appendChild(course)
        homework.appendChild(job)
        homework.appendChild(time)
    }
}