var express = require('express')
var router = express.Router()

router.get('/course', function (req, res, next) {
   if(req.signedCookies.account){
      isLogin = true;
  }
  else{
   res.redirect('/login');
   }
   res.render('class', { title: '路徑為 : ' ,content:req.url});

});
router.get('/grades', function (req, res, next) {
   if(req.signedCookies.account){
       isLogin = true;
       res.render('grade', { title: '路徑為 : ' ,content:req.url});
  }
  else{
   res.redirect('/login');
   }
   

});
module.exports = router