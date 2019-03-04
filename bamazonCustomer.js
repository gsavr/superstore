var mysql = require("mysql");
var inquirer = require("inquirer")
var CFonts = require('cfonts');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

var itemID=0;
var itemQuant=0;
var stockQuant=0;
var itemName="";
var priceTotal=0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  readProducts();
});

function readProducts(){
    CFonts.say("Online\nSuperstore", {
        font: 'block',   
        colors: ['cyanBright'], 
    });
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
      if (err) throw err;
      console.log("\nProducts Available\n-----------------")
      for (i=0;i<res.length;i++){
      console.log(res[i].product_name+"\n$"+res[i].price+".00\nProduct ID:"+res[i].item_id+"\n-----------------");
    }buyProduct();
    });
  };

  function buyProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please provide the ID of the product you like to purchase today:",
            name: "id"
        },
        {
            type: "input",
            message: "Please provide the quantity you would like to purchase for this item:",
            name: "quantity"
        },
        {
            type: "confirm",
            message: "Plese make sure the item ID and quantity are correct",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            itemID=parseInt(inquirerResponse.id);
            itemQuant=parseInt(inquirerResponse.quantity);
            //console.log(itemID)
            checkStock(itemID,itemQuant)
        }
        else{
            console.log("\nCome back anytime!\n");
            connection.end();
        }
    }).catch(function(err){
        console.log(err)
    });
  };

function checkStock(itemID,itemQuant){
    console.log("Checking stock for your product...\n");
    connection.query("SELECT * FROM bamazon.products WHERE ?",
    [
      {
        item_id: itemID
      },
    ],
    function(err, res) {
      itemName=res[0].product_name;
      priceTotal=res[0].price*itemQuant;
      stockQuant=res[0].stock_quantity;
      console.log("Quantity remaining: "+res[0].stock_quantity);
      if(itemQuant<=res[0].stock_quantity){
          shoppingBasket()
      }
      else{
          console.log("Insufficient stock, please check in 24 hours for new stock.");
          connection.end();
      }
    })
};

function shoppingBasket(){
    console.log(`Your total for the purchase of ${itemQuant} "${itemName}s" is $${priceTotal}.00`);
    inquirer.prompt([
        {
            type: "confirm",
            message: "Continue to checkout?",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            checkout()
        }
        else{
            console.log("\nCome back anytime!\n");
            connection.end();
        }
    }).catch(function(err){
        console.log(err)
    });
};

function checkout(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please provide your 16-digit credit card number",
            name: "cc",
        },
        {
            type: "input",
            message: "Please provide your expiration date",
            name: "cc",
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.cc){
            console.log("Completing your purchase...\n");
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                    stock_quantity: stockQuant-itemQuant
                },
                {
                    item_id: itemID
                }
              ],
              function(err, res) {
                //console.log(res.affectedRows + " products updated!\n");
                console.log(`Your purchase is now complete.\n\nThank you for vising Online Superstore\n\nYour purchase total was $${priceTotal}.00`);
                connection.end();
              }
            );
        }
        else{
            console.log("\nCome back anytime!\n");
            connection.end();
        }
    }).catch(function(err){
        console.log(err)
    });
}