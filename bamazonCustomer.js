// bamazonCustomer.js

const inquirer = require('inquirer');
const mysql = require('mysql');


const connection = mysql.createConnection({
    localhost: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

let productList = [];

connection.connect(function (err) {
    if (err) throw err;
    
    read_DB(printResults, takeOrder);
    // connection.end();
});

function read_DB(..._callback) {
   
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (let i in results) {
            productList.push(results[i]);
        }

        return  _callback ? _callback.forEach ( _cb => _cb() ) : '';
    });
    // Nothing shows up when console.log(productList) is outside of connection.query() ?!! 
    // console.log(productList);
}

function printResults(_callBack) {

    let print = '\n';
    productList.forEach( (obj) => {
        print += `${obj.item_id} : ${obj.product_name} – $${obj.price}\n`
    });
    console.log(`
    ***************************
    *   ◊◊◊   Bamazon   ◊◊◊   *
    ***************************

    ${print}`
    );

    // return _callback ? _callback() : '';
}

function takeOrder() {
    inquirer.prompt([
        {
            name: "item_num",
            type: "input",
            message: "Enter the id of the item you wish to buy?"
        },
        {
            name: "amount",
            type: "input",
            message: "How many?"
        }
    ]).then( (answer) => {
        console.log(answer);
    });
}