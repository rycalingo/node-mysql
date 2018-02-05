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
   // Read data from database and save it to 'productList'
    connection.query("SELECT * FROM products", (err, results) => {
        if (err) throw err;
        productList = [];
        for (let i in results) {
            productList.push(results[i]);
        }
        // console.log(productList);
        return  _callback ? _callback.forEach ( _cb => _cb() ) : '';
    });
}

function printResults(_callBack) {
    // Show each product of the 'productList'
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
}

function takeOrder() {
    // Take customer order
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
            console.log(`\nSorry Insufficient quantity!\n`);

            return buyMore();
            // connection.end();
        } else {
            return processOrder(product, qty);
        }
    });
}

function processOrder(product, qty) {

    connection.query("SELECT * FROM products", (err, results) => {
        if (err) throw err;
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                stock_quantity: qty
                },
                {
                item_id: product.item_id
                }
            ], (err) => {
                if (err) throw err;
                let total = product.price * qty;
                console.log(`\nThe total is: $${total}\n`);

                return buyMore();
                // console.log(productList);
        });
    });

}

function buyMore() {
    inquirer.prompt([
        {
            name: "wantsToBuy",
            type: "list",
            message: "Would you like to make another purchase?",
            choices: ["YES", "NO"]
        }
    ]).then( (answer) => {
        if (answer.wantsToBuy === "YES") return init();

        connection.end();
    });
}