var express = require('express')
var router = express.Router()
var admin = require("firebase-admin");
var fireData = require('../service/firedata');
router.get('/aca/grades', function (req, res, next) {
    if (req.signedCookies.account) {
        let currentID = req.signedCookies.account.toUpperCase();
        if (currentID == req.query.id.toUpperCase()) {
            console.log('CurrentID : ', currentID);
            fireData.ref('/'+currentID.toUpperCase()).once('value', function (snapshot){
                currentDB = snapshot.val();
                return res.json(currentDB['score']);
            })
            isLogin = true;
        }
       else {
            res.render('apiNoLoginErr')
       }
    }
    else {
        res.render('apiNoLoginErr')
    }
});
router.get('/aca/course', function (req, res, next) {
    if (req.signedCookies.account) {
        let currentID = req.signedCookies.account.toUpperCase();
        if (currentID == req.query.id.toUpperCase()) {
            console.log('CurrentID : ', currentID);
            fireData.ref('/'+currentID.toUpperCase()).once('value', function (snapshot){
                currentDB = snapshot.val();
                return res.json(currentDB['course']);
            })
            isLogin = true;

        }
       else {
            res.render('apiNoLoginErr')
       }
    }
    else {
        res.render('apiNoLoginErr')
    }
});
router.get('/elearning/homework', function (req, res, next) {
   if (req.signedCookies.account) {
        let currentID = req.signedCookies.account.toUpperCase();
        if (currentID == req.query.id.toUpperCase()) {
            console.log('CurrentID : ', currentID);
            fireData.ref('/'+currentID).once('value', function (snapshot){
                currentDB = snapshot.val();
                return res.json(currentDB[2]);
            })
            isLogin = true;

        }
       else {
            res.render('apiNoLoginErr')
       }
    }
    else {
        res.render('apiNoLoginErr')
    }
    // res.render('index_')
});
router.get('/elearning/annoucement', function (req, res, next) {
   if (req.signedCookies.account) {
        let currentID = req.signedCookies.account.toUpperCase();
        if (currentID == req.query.id.toUpperCase()) {
            console.log('CurrentID : ', currentID);
            fireData.ref('/'+currentID).once('value', function (snapshot){
                currentDB = snapshot.val();
                return res.json(currentDB[1]);
            })
            isLogin = true;

        }
        else {
            res.render('apiNoLoginErr')
       }
    }
    else {
        res.render('apiNoLoginErr')
    }
});
//TODO: API Design
module.exports = router