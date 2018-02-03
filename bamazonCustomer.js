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

connection.connect( (err) => {
    if (err) throw err;
    
    init();
});
function init() {
    read_DB(printResults, takeOrder);
}

function read_DB(..._callback) {
   
    connection.query("SELECT * FROM products", (err, results) => {
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
            name: "qty",
            type: "input",
            message: "How many?"
        }
    ]).then( (answer) => {
        // item_id:, product_name:, department_name:, price:, stock_quantity:

        let product = productList.find( (item) => {
            // note: typeof number == typeof string
            return item.item_id == answer.item_num;
        });
        console.log(product.stock_quantity);
        let qty = product.stock_quantity - answer.qty;
        // console.log(qty);

        if ( product.stock_quantity <= 0 || qty < 0) {
            console.log(`\nSorry Insufficient quantity!`);

            init();
            // connection.end();
        } else {
            processOrder(product, qty);
        }
    });
}

function processOrder(product, qty) {
    connection.query("SELECT * FROM products", (err, results) => {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                item_id: product.item_id
                },
                {
                stock_quantity: qty
                }
            ], (error) => {
                if (err) throw err;

                console.log(`\nThe total is: $${product.price}\n`);

                // console.log(productList);

            }
        );
    });
    // connection.end();
    init();

}