// bamazonCustomer.js

var inquire = require('inquire');
var mysql = require('mysql');


var connection = mysql.createConnection({
    localhost: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});
