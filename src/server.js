//Require 模組
const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });
const fs = require('fs');
const session = require('express-session');
const moment = require('moment-timezone');
var favicon = require('serve-favicon');
const db = require(__dirname + '/db-connect');
var nodemailer = require('nodemailer');
const emailService = require(__dirname + '/email');

// ---------------Middlewire---------------
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'ksdhkasjhfjs',
    cookie: {
        maxAge: 1200000
    }
}));
// session帶著走.
app.use((req, res, next) => {
    if (req.session.loginUser) {
        res.locals.loginUser = req.session.loginUser;
    }
    next();
});

// ---------------Route Start Here---------------
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    let data = {
        loginUser: req.session.loginUser || "",
        flashMsg: req.session.flashMsg
    };
    delete req.session.flashMsg;
    res.render('login', data);
});
app.post('/login', (req, res) => {
    const list = {
        "aaa@gmail.com": "1234",
        "bbb@gmail.com": "1234"
    }
    if (req.body.email && list[req.body.email] === req.body.password) {
        req.session.loginUser = req.body.email.split("@")[0];
        res.redirect('/');
    } else {
        req.session.flashMsg = 'Incorrect email or password.'
        res.redirect('/login');
    };

});

app.get('/logout', (req, res) => {
    delete req.session.loginUser;
    delete res.locals.loginUser;
    res.render('index');
});

app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

//  TODO: 帳號是否有重複檢查.
app.post('/sign-up', (req, res) => {
    // TODO: 資料檢查
    const output = {
        success: false,
        code: 400,
        results: {},
        errorMsg: '',
        body: req.body
    };
    // console.log("req from sign up");
    if (!req.body.name || req.body.name.length < 2) {
        output.code = 410;
        output.errorMsg = '姓名請填兩個字以上';
        return res.json(output);
    }
    const sqlDuplicate = "SELECT * FROM `client_data` WHERE email=?";
    const sql = "INSERT INTO `client_data`(`email`, `password`, `client_name`, `birthday`, `address`, `fav_char`, `reg_time`, `class`) VALUES (?,?,?,?,?,'none', NOW(), 1)";
    req.body.completeAddress = req.body.address + req.body.address2 + req.body.city + req.body.zip;

    db.queryAsync(sqlDuplicate, [
        req.body.email,
    ])
        .then(results => {
            console.log("results.length is " + results.length)
            console.log(results)
            if (results.length < 1) {
                output.code = 411;
                output.errorMsg = 'Email duplicate!';
                console.log("duplicate emm")
                return res.json(output);
            } else {
                return db.queryAsync(sql, [
                    req.body.email,
                    req.body.password,
                    req.body.name,
                    req.body.birthday,
                    req.body.completeAddress,
                ]);
            }})
        .then(results => {
            // console.log(results);
            output.results = results;
            if (results.affectedRows === 1) {
                output.success = true;
                output.code = 200;
            } else {
                output.code = 420;
                output.errorMsg = '資料新增失敗';
            }
            res.json(output);
        })
        .catch(error => {
            //output
        });

});

app.get('/forget-password', (req, res) => {
    let data = {
        forgetmail: req.session.forgetmail || "",
        flashMsg: req.session.flashMsg
    };
    delete req.session.flashMsg;
    res.render('forget-password', data);
});
app.post('/forget-password', (req, res) => {
    const list = {
        "aaa@gmail.com": "1234",
        "bbb@gmail.com": "1234"
    }
    if (req.body.email && list[req.body.email]) {
        req.session.forgetmail = list[req.body.email];
        res.redirect('/forget-password');
    } else {
        req.session.flashMsg = 'Incorrect email.'
        res.redirect('/forget-password');
    };
});

app.get('/test', (req, res) => {
    res.render('test');
});

app.get('/main', (req,res)=> {
    res.render('main');
});

app.post('/test', (req, res) => {
    const sql = "SELECT * FROM `client_data` WHERE email=?";
    db.queryAsync(sql, [
        // req.body.name,
        req.body.text,
    ])
        .then(results => {
            res.json(results);
        })
});
// TODO: email function
// app.get('/emailTest', (req,res)=>{
//     emailService.send('dingnew01@gmail.com', 'aaaaa','bbbbb');
//     redirect('/');
// });

// 404 要在 routes 的最後面
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 !!!!!!!!!!');
});
app.listen(3000, () => {
    console.log('server start');
});
