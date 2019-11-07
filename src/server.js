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
// const db = require(__dirname + '/db-connect');//家中沒有database "shop"

// Middlewire
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'ksdhkasjhfjs',
    cookie: {
        maxAge: 1200000
    }
}));
// Route 
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
        req.session.flashMsg='Incorrect email or password.'
        res.redirect('/login');
    };

});
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});
app.get('/forget-password', (req, res) => {
    res.render('forget-password');
});




// 404 要在 routes 的最後面
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 !!!!!!!!!!');
});
app.listen(3000, () => {
    console.log('proj server start');
});