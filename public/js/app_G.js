var choiceYear = document.querySelector('.choiceYear') //下拉選單
const container_g = document.querySelector('.container_g')
var gradeDiv = document.querySelector('.gradeDiv')

//建下拉選單
var optionYear = {} 
var str = '`<option value="0">請選擇</option>`';
for(var i = 0; i < dataGrade.length; i++){
    var content = dataGrade[i].Year;
    if(optionYear[content] == undefined){
        optionYear[content] = 1;
        str +=  `<option value="${content}">${content}</option>`;
    }
}
choiceYear.innerHTML = str
//理想：一進頁面為最新成績單 可改查其他。
//目前：改選單查成績
//bug：重拉選單 需清除舊資料時機
choiceYear.addEventListener('change',function(){
    creatGrade();
})

function creatGrade(){
    gradeDiv.innerHTML = ''
    var year = choiceYear.value
    for(let i in dataGrade){
        if( dataGrade[i].Year == year){
            var grade = document.createElement('div') //外框
            grade.classList.add('grade')
            gradeDiv.appendChild(grade)
            

            var int = document.createElement('div') //成績數字
            var int_p = document.createElement('p')
            int_p.textContent = dataGrade[i].grade
            int.classList.add('int')

            var course = document.createElement('p') //課程名稱
            course.textContent = dataGrade[i].course
            course.classList.add('course')

            var time = document.createElement('p') //學期
            time.textContent = year
            time.classList.add('time')

            grade.appendChild(int)
            int.appendChild(int_p)
            grade.appendChild(course)
            grade.appendChild(time)
            console.log(grade)
            //0~59紅色 60~100綠色
            if(dataGrade[i].grade < 60) int_p.style.backgroundColor='#f2746b'
        }
    }
}