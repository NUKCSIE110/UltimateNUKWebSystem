var express = require('express');
var router = express.Router();
var isLogin=false;
// var admin = require("firebase-admin");
// var fireData = require('../service/firedata');
// var defaultAuth = firebase.auth();
/* GET home page. */
router.get('/', function (req, res, next) {
    // fireData.ref('/').once('value', function (snapshot){
    //     console.log(snapshot.val());
    // })
    var name='guest';
    if(req.signedCookies.account && req.signedCookies.passwd){
        name=req.signedCookies.account+ ' '+req.signedCookies.passwd;
        isLogin = true;
    }
    res.render('index', { title: 'Express', member:name, logstatus:isLogin });
    // res.render('index');
});

router.get('/login', function (req, res, next) {
    var name='guest';
    isLogin=false;
	if(req.signedCookies.account && req.signedCookies.passwd){
        name=req.signedCookies.account+ ' '+req.signedCookies.passwd;
        isLogin = true;
    }
    res.render('login', { title: 'Express', member:name, logstatus:isLogin });
});
router.post('/login', function (req, res, next) {
    if(req.body.account=="" || req.body.passwd=="")
    {
        res.render('login');
            //  return res.redirect('login.html');
    }else{
        res.cookie('account', req.body.account, { path: '/', signed: true, maxAge:600000});  //set cookie
        res.cookie('passwd', req.body.passwd, { path: '/', signed: true, maxAge:600000 }); //set cookie
        return res.redirect('/');
    }
    res.render('login');
});
router.get('/logout', function(req, res) {
    // ...
    res.clearCookie('account',{path:'/'});
　　　res.clearCookie('passwd',{path:'/'});
    return res.redirect('/');
});
module.exports = router;