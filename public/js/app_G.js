var choiceYear = document.querySelector('.choiceYear') //下拉選單
const container_g = document.querySelector('.container_g')
var gradeDiv = document.querySelector('.gradeDiv')
const user = document.querySelector('.user').textContent
//AJAX
var DB = ''
var xhr = new XMLHttpRequest();
// console.log("/API/aca/grades?id="+user.toUpperCase())
// while(document.querySelectorAll('.choiceYear option').length == 0){
    // if(document.querySelectorAll('.choiceYear option').length >0) break;
var intervalID = setInterval(()=>{
    // console.log('excute')
    xhr.open("GET", "/API/aca/grades?id="+user.toUpperCase());
    xhr.send();
    xhr.onload = () => {
        // console.log(xhr.responseText)
        DB = JSON.parse(xhr.responseText);
        //建下拉選單
        var optionYear = {} 
        var str = '`<option value="0">請選擇</option>`';
        for(var i = 0; i < DB['whichYear'].length; i++){
            var content = DB['whichYear'][i].replace(' ', '');
            if(optionYear[content] == undefined){
                optionYear[content] = 1;
                str +=  `<option value="${content}">${content}</option>`;
            }
        }
        choiceYear.innerHTML = str
        creatGrade()
        if(document.querySelectorAll('.choiceYear option').length > 0){
            clearInterval(intervalID);
            let tags = document.querySelectorAll('#TAG');
            for(let i of tags){
                i.addEventListener('click',(e)=>{
                    document.querySelector('.mask').classList.remove('hide')
                })
            }
        }
    }

},1000)

    
// }


//理想：一進頁面為最新成績單 可改查其他。
//目前：改選單查成績
//bug：重拉選單 需清除舊資料時機
choiceYear.addEventListener('change',function(){
    creatGrade();
})

function creatGrade(){
    gradeDiv.innerHTML = ''
    var year = choiceYear.value.replace(' ','')
    for(let i in DB['course']){
        // console.log(DB['course'][i][0]+DB['course'][i][1].replace(' ','_'), year)
        if( DB['course'][i][0]+DB['course'][i][1].replace(' ','_') == year){
            console.log('1')
            var grade = document.createElement('div') //外框
            grade.classList.add('grade')
            gradeDiv.appendChild(grade)
            var int = document.createElement('div') //成績數字
            var int_p = document.createElement('p')
            if(DB['course'][i][6] == '未送')
                int_p.textContent = "X"
            else if(DB['course'][i][6] == '棄選')
                int_p.textContent = "棄"
            else
                int_p.textContent = DB['course'][i][6]
            int.classList.add('int')

            var course = document.createElement('p') //課程名稱
            course.textContent = DB['course'][i][2] + DB['course'][i][3]
            course.classList.add('course')
            console.log(DB['course'][i][3])
            var time = document.createElement('p') //學期
            time.textContent = year
            time.classList.add('time')

            grade.appendChild(int)
            int.appendChild(int_p)
            grade.appendChild(course)
            grade.appendChild(time)
            console.log(grade)
            //0~59紅色 60~100綠色
            if(DB['course'][i][6] < 60) int_p.style.backgroundColor='#f2746b'
        }
    }
}