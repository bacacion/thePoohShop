const mysql = require('mysql');
const bluebird = require('bluebird');
const db = mysql.createConnection({
    host: '192.168.10.114',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'shop'
});
db.connect();

// promisifyAll must after db connect!!!
bluebird.promisifyAll(db);

module.exports= db;