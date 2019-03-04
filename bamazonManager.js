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
var price=0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
    CFonts.say("superstore\nmanager\naccess", {
        font: 'chrome',   
        colors: ['white'],   
    });
    inquirer.prompt([
        {
            type: "list",
            message: "Menu options",
            choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"],
            name: "function"
        },
        
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.function==="View Products for Sale"){
            readProducts();
        }
        if(inquirerResponse.function==="View Low Inventory"){
            lowInventory();
        }
        if(inquirerResponse.function==="Add to Inventory"){
            addInventory();
        }
        if(inquirerResponse.function==="Add New Product"){
            newInventory();
        }
        if(inquirerResponse.function==="Exit"){
            console.log("\n---Closing Application---\n");
            connection.end();
        }
    }).catch(function(err){
        console.log(err)
    });
});

function readProducts(){
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
      if (err) throw err;
      console.log("\nProducts Available\n-----------------------")
      for (i=0;i<res.length;i++){
        console.log("Product ID:"+res[i].item_id+"\nDepartment: "+res[i].department_name+"\n"+res[i].product_name+"\n$"+res[i].price+".00\nQuantity in stock:"+res[i].stock_quantity+"\n-----------------------");
        }
    console.log("End of Product Listings\n-----------------------") 
    });
    connection.end();
  };

function lowInventory(){
    console.log("Checking stock for your product...\n");
    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity<11",
    function(err, res) {
      console.log("Quantity remaining: "+res[0].stock_quantity);
      if(itemQuant<=res[0].stock_quantity){
          shoppingBasket()
      }
      else{
          console.log("Insufficient stock, please check in 24 hours for new stock.");
          connection.end();
      }
    })
}