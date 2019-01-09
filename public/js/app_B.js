const container = document.querySelector('.container')
creatBoard();

function creatBoard(){
                //佈告欄資料
    for(let i in dataBoard){
        var textBoard = document.createElement('div')
        textBoard.classList.add('textBoard')
        container.appendChild(textBoard)

        var T = document.createElement('p')
        T.textContent = dataBoard[i].title
        T.classList.add('T')

        var course = document.createElement('p')
        course.textContent = dataBoard[i].course
        course.classList.add('course')
        
        var t = document.createElement('p')
        t.textContent = dataBoard[i].text
        t.classList.add('t')

        textBoard.appendChild(T)
        textBoard.appendChild(course)
        textBoard.appendChild(t)
    }
}
