const mysql = require('mysql');
const bluebird = require('bluebird');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shop'
});
db.connect();

// promisifyAll must after db connect!!!
bluebird.promisifyAll(db);

module.exports= db;