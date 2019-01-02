// 輸入 database 網址
var admin = require("firebase-admin");
var serviceAccount = require("./js-finalproj-firebase-adminsdk-44exn-f9214820a7.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://js-finalproj.firebaseio.com/"
});
admin.database().ref('/Accounts').once('value', function (snapshop) {
    console.log(snapshop.val());
})
module.exports = admin.database();