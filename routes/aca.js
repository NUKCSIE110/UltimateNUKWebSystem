var express = require('express')
var router = express.Router()

router.get('/courseTable', function (req, res, next) {
   res.render('index', { title: '路徑為 : ' ,content:req.url});

});
router.get('/grades', function (req, res, next) {
   res.render('index', { title: '路徑為 : ' ,content:req.url});

});
module.exports = router