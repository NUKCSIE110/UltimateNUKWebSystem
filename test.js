var admin = require("firebase-admin");
var fireData = require('./service/firedata');
studentID = "A1065514"
// console.log()
// fireData.ref('/').once('value').then(function(snapshot){
//     console.log(snapshot.val());
    
//   })
 var createStudent = fireData.ref('/'+studentID);
 createStudent.once('value', function(snapshot) {
    if (snapshot.hasChild('course')) {
        console.log('exists');
    }
  });
// console.log(createStudent.hasChild('course'))
//  console.log(createStudent.once())
//  createStudent.child("He").set(pushData)
//  console.log("success")