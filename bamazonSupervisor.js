var mysql = require("mysql");
var inquirer = require("inquirer")
var CFonts = require('cfonts');
var Table = require('cli-table3');

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
var prevTotal=0;
var priceTotal=0;
var totalSales=0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
    CFonts.say("superstore\nsupervisor\naccess", {
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
            choices: ["View Product Sales by Department","Create New Department","Exit"],
            name: "function"
        },   
    ])
    .then(function(inquirerResponse) {
        switch (inquirerResponse.function) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Exit":
                closeApp();
                break;
        }
    }).catch(function(err){
        console.log(err)
    });
};

function viewSales(){
    connection.query(`SELECT a.department_id,a.department_name,a.overhead_costs,SUM(b.product_sales) AS "sales_total" FROM departments= a INNER JOIN products= b ON b.department_name = a.department_name GROUP BY department_id`, function(err, res) {
        if (err) throw err;
        console.log("\nSales by Dept\n-----------------------")
        console.log(res[0].sales_total)
      console.log("End of Table\n-----------------------") 
      init()
      });
}

function createDepartment(){
    console.log("\nCREATE a new department for superstore.\n");
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to create a new department?",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            inquirer.prompt([
            {
                type: "input",
                message: "Please provide the name for the new department:",
                name: "dept"
            },
            {
                type: "input",
                message: "Please provide the overhead price for running the new department (format: 00000.00):",
                name: "overhead"
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
                connection.query("INSERT INTO departments SET ?",
                {
                department_name: inquirerResponse.dept,
                overhead_costs: parseFloat(inquirerResponse.overhead),
                },
        function(err, res) {
          console.log("\n"+res.affectedRows + " new department added to superstore!\n");
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
};