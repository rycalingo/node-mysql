// bamazonCustomer.js

const inquire = require('inquire');
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
    read_DB(startUp);
});
function read_DB(_callback) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (let i in results) {
            productList.push(results[i]);
        }
        // console.log(productList);

        return _callback();
    });
}

function startUp() {

    let print = '\n';
    productList.forEach((obj) => {
        print += `${obj.item_id} : ${obj.product_name} – $${obj.price}\n`
    });
    console.log(`
    ***************************
    *   ◊◊◊   Bamazon   ◊◊◊   *
    ***************************

    ${print}`
    );

}