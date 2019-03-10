
const express = require('express');
const router = express.Router();
const routeCommon = require('./routeCommon');


/* GET home page. */
router.get('/', function (req, res, next) {
    var vm = {};
    routeCommon.seoInfo(vm, {
        title: '首页'
    });
    res.render('home/index', vm);

    // res.render('index', {
    //     title  : '首页',
    //     message: 'hello world',
    //     layout: 'shared-templates',
    //     helpers: {
    //         yell: function (msg) {
    //             return (msg + '!!!');
    //         }
    //     }
    // });
});

router.get('/index', function (req, res, next) {
    res.redirect('/');
});

router.get('/about', function (req, res, next) {
    res.send('Webpack Express project');
});


module.exports = router;