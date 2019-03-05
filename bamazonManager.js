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
var addQuant=0;
var stockQuant=0;
var newQuant=0;
var itemName="";
var price=0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
    CFonts.say("superstore\nmanager\naccess", {
        font: 'chrome',   
        colors: ['white'],   
    });
    init()
});

function init(){
    inquirer.prompt([
        {
            type: "list",
            message: "\n\nMenu options",
            choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"],
            name: "function"
        },
    ])
    .then(function(inquirerResponse) {
        switch (inquirerResponse.function) {
            case "View Products for Sale":
                readProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newInventory();
                break;
            case "Exit":
                closeApp();
                break;
        }
    }).catch(function(err){
        console.log(err)
    });
};

function readProducts(){
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
      if (err) throw err;
      console.log("\nProducts Available\n-----------------------")
      for (i=0;i<res.length;i++){
        console.log("Product ID:"+res[i].item_id+"\nDepartment: "+res[i].department_name+"\n"+res[i].product_name+"\n$"+res[i].price+".00\nQuantity in stock:"+res[i].stock_quantity+"\n-----------------------");
        }
    console.log("End of Product Listings\n-----------------------") 
    init()
    });
  };

function lowInventory(){
    console.log("Checking low stock...\n");
    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity<11",
    function(err, res) {
        for (i=0;i<res.length;i++){
            console.log("Product ID:"+res[i].item_id+"\n"+res[i].product_name+"\nDepartment: "+res[i].department_name+"\nQuantity in stock: "+res[i].stock_quantity+"\n-----------------------");
            }
    console.log("End of Low Stock\n-----------------------") 
    init()
    })
}

function addInventory(){
    console.log("\nADD / CHANGE stock for sale.\n");
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to add inventory",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            inquirer.prompt([
            {
                type: "input",
                message: "Please provide the ID of the product for which you will add inventory:",
                name: "id"
            },
            {
                type: "input",
                message: "Please provide the quantity for this item you are adding:",
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
                addQuant=parseInt(inquirerResponse.quantity);
                connection.query(`SELECT * FROM bamazon.products WHERE item_id=${itemID}`,
                    function(err, res) {
                    stockQuant=res[0].stock_quantity;
                    console.log("Initial quantity remaining: "+stockQuant);
                    newQuant=stockQuant+addQuant;
                    productUpdate(itemID,newQuant)
                });
            }
            else{
                init()
            }
        }).catch(function(err){
            console.log(err)
        });
        }
        else{
            init()
        }
    }).catch(function(err){
        console.log(err)
    });
};

function productUpdate(itemID,newQuant){
    connection.query(`UPDATE products SET ? WHERE ?`,
    [{
        stock_quantity: newQuant
      },
      {
        item_id: itemID
      }],
    function(err, res) {
      console.log(`${res.affectedRows} products updated!\n\nNew stock for item ID: ${itemID} is ${newQuant}`);
      init()
    });
}

function newInventory(){
    console.log("\nADD a new product for sale.\n");
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to add inventory",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            inquirer.prompt([
            {
                type: "input",
                message: "Please provide the name of the product:",
                name: "name"
            },
            {
                type: "input",
                message: "Please provide the department for the product:",
                name: "dept"
            },
            {
                type: "input",
                message: "Please provide the price for the product (format: 000.00):",
                name: "price"
            },
            {
                type: "input",
                message: "Please provide the quantity for the product:",
                name: "quant"
            },
            {
                type: "confirm",
                message: "Plese make sure all fields are correct",
                name: "confirm",
                default: true
            },
        ])
        .then(function(inquirerResponse) {
            if(inquirerResponse.confirm){
                connection.query("INSERT INTO products SET ?",
                {
                product_name: inquirerResponse.name,
                department_name: inquirerResponse.dept,
                price: parseFloat(inquirerResponse.price),
                stock_quantity: inquirerResponse.quant
                },
        function(err, res) {
          console.log("\n"+res.affectedRows + " new product added to inventory!\n");
          init();
        });
            }
            else{
                init()
            }
        }).catch(function(err){
            console.log(err)
        });
        }
        else{
            init()
        }
    }).catch(function(err){
        console.log(err)
    });    
};

function closeApp(){
    console.log("\n---Closing Application---\n");
    connection.end();
}