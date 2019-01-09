var express = require('express');
var router = express.Router();
// var admin = require("firebase-admin");
// var fireData = require('../service/firedata');
// var defaultAuth = firebase.auth();
/* GET home page. */
router.get('/', function (req, res, next) {
    // fireData.ref('/').once('value', function (snapshot){
    //     console.log(snapshot.val());
    // })
    res.render('index');
});

module.exports = router;