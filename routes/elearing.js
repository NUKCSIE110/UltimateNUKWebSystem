var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/homework', function (req, res, next) {
   res.render('index', { title: '路徑為 : ' ,content:req.url});
    
});
router.get('/annoucement', function (req, res, next) {
   res.render('index', { title: '路徑為 : ' ,content:req.url});

});
router.get('/files', function (req, res, next) {
   res.render('index', { title: '路徑為 : ' ,content:req.url});

});

module.exports = router;
