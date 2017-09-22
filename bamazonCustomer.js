var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "groot", 
    password: "", 
    database: "bamazon"
})

	connection.query('SELECT * FROM products', function displayTable (err, res) {
    if (err) throw err;

    var t = "\t";

    console.log("ItemID\tProduct\t\tDept.\tPrice\t# In Stock");
    console.log("=======================================================");

	for (var i = 0; i < res.length; i++) {
	  console.log(res[i].item_id + t + res[i].product_name + t +
	    res[i].department_name + t + res[i].price + t + res[i].stock_quantity);
	}
    console.log("=======================================================");

    function Shop(res){
    	inquirer.prompt([{
		    type: "input",
		    name: "purchase",
		    message: "What is the ID of the item you would like to purchase?\n"
		}]).then(function(val) {

				var id = (val.purchase) - 1;
				
				console.log("We have " + res[id].stock_quantity + " " + res[id].product_name + " in stock.");

					inquirer.prompt([{
					    type: "input",
					    name: "quantity",
					    message: "How many " + res[id].product_name + " would you like to purchase?"
					}]).then(function(val) {

						var numPurchased = (val.quantity);

						if(res[id].stock_quantity == 0){
							Console.log("Sorry, all out of " + id + ". Choose an item we have in stock.\n")
							Shop();
						}

						if (numPurchased <= res[id].stock_quantity) {
						 	inquirer.prompt([{
							    type: "input",
							    name: "quantity",
							    message: "You have successfully ordered " + numPurchased + " "  + res[id].product_name + "s.\n"
							}])
							 connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - numPurchased) +
					              "' WHERE item_id='" + res[id].item_id + "'",
					              function(err, res2) {
					                if (err) {
					                  throw err;
					                }

					              });

								} else {
									console.log("That is too many " + res[id].product_name + ". Have less please.");
									inquirer.prompt([{
									    type: "input",
									    name: "quantity",
									    message: "How many " + res[id].product_name + " would you like to purchase? (Choose a number less than " + res[id].stock_quantity + ")"
								 	}]).then(function(val) {
								 		if (numPurchased > res[id].stock_quantity) {
								 			console.log("Cmd + double-click https://www.khanacademy.org/math/arithmetic for assistance");
								 			Shop(res);
								 		}
								 	})
								
								// ;
						};//end if invalid number
					});//end quantity then		
		});
			    
	};
			
			Shop(res);
});


