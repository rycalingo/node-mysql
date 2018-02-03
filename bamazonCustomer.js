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

connection.connect(function(err) {
    if (err) throw err;
    initSetup();
});
function read_DB() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log(res);
    });
}

function initSetup() {
    read_DB();
      
}