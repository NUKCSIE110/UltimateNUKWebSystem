var express = require('express')
var router = express.Router()

router.get('/course', function (req, res, next) {
   res.render('class', { title: '路徑為 : ' ,content:req.url});

});
router.get('/grades', function (req, res, next) {
   res.render('grade', { title: '路徑為 : ' ,content:req.url});

});
module.exports = router