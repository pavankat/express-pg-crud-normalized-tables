// Loading all our Node Package Modules
var express        = require('express');
var logger         = require('morgan');
var path           = require('path');
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var pg             = require('pg');

var app = express();

// Setting up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: 'handlebars'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Allows us to use req.body
app.use(bodyParser.urlencoded({extended: true}));
// Loads static files
app.use(express.static('public'));
app.use(logger('dev'));

// Allows us to use methods PUT and DELETE for forms
app.use(methodOverride(function(req, res) {
 if (req.body && typeof req.body === 'object' && '_method' in req.body) {
   // look in urlencoded POST bodies and delete it
   var method = req.body._method
   delete req.body._method
   return method
 }
}));

app.listen(3000);

// Connection string to connect to our database
var connectionString = "pg://localhost/sauce_db";

//main get routes
	app.get('/', function (req, res) {
		res.render('home');
	});

	app.get('/manufacturers', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			client.query('SELECT * FROM manufacturers', function (err, result) {
				done();
				var data = {
					manufacturers: result.rows
				};
				res.render('manufacturers', data);
			});
		});
	});

	app.get('/manufacturers/:id', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			var query = "SELECT m.id, m.name, s.name as sauce_name, sp.price FROM manufacturers m left join sauces s on s.manufacturer_id = m.id left join sauce_prices sp on sp.sauce_id = s.id where m.id = $1"
			client.query(query, [req.params.id], function (err, result) {
				done();
				var data = {
					sauces: result.rows
				};
				res.render('manufacturer', data);
			});
		});
	});

	app.get('/sauces', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			var query = "select s.id, s.name, sp.price, m.name as manufacturer_name from sauces s left join sauce_prices sp on sp.sauce_id = s.id left join manufacturers m on m.id = s.manufacturer_id"

			client.query(query, function (err, result) {
				done();
				var data = {
					sauces: result.rows
				};
				console.log(data);
				res.render('sauces', data);
			});
		});
	});

	app.get('/customers', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			var query = "select c.id, c.name, ce.email from customers c left join customer_emails ce on ce.customer_id = c.id"

			client.query(query, function (err, result) {
				done();
				var data = {
					customers: result.rows
				};
				console.log(data);
				res.render('customers', data);
			});
		});
	});

	app.get('/customers/:id', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			var query = "select c.id, c.name, ce.email, s.name as sauce_name, sp.price, cp.quantity, cp.id as customer_id from customers c left join customer_emails ce on ce.customer_id = c.id left join customer_purchases cp on cp.customer_id = c.id left join sauces s on cp.sauce_id = s.id left join sauce_prices sp on sp.sauce_id = s.id where c.id = $1"
			client.query(query, [req.params.id],function (err, result) {
				done();
				var data = {
					purchases: result.rows
				};
				console.log(data);
				res.render('customer', data);
			});
		});
	});

//new routes
	app.get('/new-manufacturer', function (req, res) {
		res.render('new-manufacturer'); //don't need anything
	});

	app.get('/new-sauce', function (req, res) {	
		pg.connect(connectionString, function (err, client, done) {
			client.query('SELECT * FROM manufacturers', function (err, result) {
				done();
				var data = {
					manufacturers: result.rows
				};
				res.render('new-sauce', data);
			});
		});
	});

	app.get('/new-customer', function (req, res) {
		res.render('new-customer');
	});

	app.get('/new-customer-purchase', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {

			client.query('SELECT s.id, s.name, sp.price FROM sauces s left join sauce_prices sp on sp.sauce_id = s.id', function (err, result) {

				client.query('SELECT c.id, c.name, ce.email from customers c left join customer_emails ce on ce.customer_id = c.id', function(errr, resultt){

					var data = {
						sauces: result.rows,
						customers: resultt.rows
					};

					done();
					res.render('new-customer-purchase', data);		

				});

				
			});
		});	
	});

//create routes
	app.post('/create-manufacturer', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			client.query('INSERT INTO manufacturers (name) VALUES ($1)', [req.body.name], function (err, result) {
				console.log(err);

				done();
				res.redirect('/manufacturers');
			});
		});
	});

	app.post('/create-sauce', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			client.query('INSERT INTO sauces (name, manufacturer_id) VALUES ($1, $2) RETURNING id', [req.body.name, req.body.manufacturer_id], function (err, result) {
				client.query('INSERT INTO sauce_prices (sauce_id, price) VALUES ($1, $2)', [result.rows[0].id, req.body.price], function (errr, resultt) {
					console.log('error 2');
					console.log(errr);
					done();
					res.redirect('/sauces');
				});
			});
		});
	});

	app.post('/create-customer', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			client.query('INSERT INTO customers (name) VALUES ($1) RETURNING id', [req.body.name], function (err, result) {

				client.query('INSERT INTO customer_emails (customer_id, email) VALUES ($1, $2)', [result.rows[0].id, req.body.email], function (errr, resultt) {
					
					done();
					res.redirect('/customers');
				});
			});
		});
	});

	app.post('/create-customer-purchase', function (req, res) {
		pg.connect(connectionString, function (err, client, done) {
			client.query('INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES ($1, $2, $3)', [req.body.customer_id, req.body.sauce_id, req.body.quantity], function (err, result) {
				
				console.log('error:')
				console.log(err)

				done();
				res.redirect('/customers');
				
			});
		});
	});

//edit
	app.get('/edit-sauce/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {

			client.query('SELECT s.id, s.manufacturer_id, s.name, sp.price FROM sauces s left join sauce_prices sp on sp.sauce_id = s.id where s.id = $1', [req.params.id], function (err, result) {

				var manufacturer_id = result.rows[0].manufacturer_id

				client.query('SELECT * from manufacturers', function (errr, resultt) {

					var select = "<select name=\"manufacturer_id\">"

					for(var i=0; i < resultt.rows.length; i++ ){
						var man_id = resultt.rows[i].id;
						var man_name = resultt.rows[i].name;
						var selected = ""

						if (resultt.rows[i].id == manufacturer_id){
							selected = "selected"
						}

						select = select + "<option value='"  
						select = select + man_id 
						select = select + "'"
						select = select + " " + selected
						select = select + ">" + man_name 
						select = select + "</option>"
					}

					select = select + "</select>"
					
					var data = {
						id: result.rows[0].id,
						name: result.rows[0].name,
						price: result.rows[0].price,
						select: select
					};

					done();
					res.render('edit-sauce', data);
				});
				
			});
		});	
	});

	app.get('/edit-customer-purchase/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {

			client.query('SELECT * FROM customer_purchases where id = $1', [req.params.id], function (err, result) {

				var customer_id = result.rows[0].customer_id
				var sauce_id = result.rows[0].sauce_id

				client.query('SELECT * from customers', function (errr, resultt) {

					var selectOne = "<select name=\"customer_id\">"

					for(var i=0; i < resultt.rows.length; i++ ){
						var cus_id = resultt.rows[i].id;
						var cus_name = resultt.rows[i].name;
						var selected = ""

						if (resultt.rows[i].id == customer_id){
							selected = "selected"
						}

						selectOne = selectOne + "<option value='"  
						selectOne = selectOne + cus_id 
						selectOne = selectOne + "'"
						selectOne = selectOne + " " + selected
						selectOne = selectOne + ">" + cus_name 
						selectOne = selectOne + "</option>"
					}

					selectOne = selectOne + "</select>"

					client.query('SELECT * from sauces', function (errrr, resulttt) {

						var selectTwo = "<select name=\"sauce_id\">"

						for(var i=0; i < resulttt.rows.length; i++ ){
							var sau_id = resulttt.rows[i].id;
							var sau_name = resulttt.rows[i].name;
							var selected = ""

							if (resulttt.rows[i].id == sauce_id){
								selected = "selected"
							}

							selectTwo = selectTwo + "<option value='"  
							selectTwo = selectTwo + sau_id 
							selectTwo = selectTwo + "'"
							selectTwo = selectTwo + " " + selected
							selectTwo = selectTwo + ">" + sau_name 
							selectTwo = selectTwo + "</option>"
						}

						selectTwo = selectTwo + "</select>"

						var data = {
							id: result.rows[0].id,
							quantity: result.rows[0].quantity,
							selectOne: selectOne,
							selectTwo: selectTwo
						};

						done();
						res.render('edit-customer-purchase', data);

					});
					
				});
				
			});
		});	
		
	});

	app.get('/edit-customer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			var query = "select c.id, c.name, ce.email from customers c left join customer_emails ce on ce.customer_id = c.id where c.id = $1"
			client.query(query, [req.params.id],function (err, result) {
				done();
				
				res.render('edit-customer', result.rows[0]);
			});
		});
		
	});

	app.get('/edit-manufacturer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {

			client.query('SELECT * from manufacturers where id = $1', [req.params.id], function (err, result) {

				res.render('edit-manufacturer', result.rows[0]);

			});
		});
		
	});

//update routes
	app.put('/update-sauce/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {

			client.query('UPDATE sauces SET (name, manufacturer_id) = ($1, $2) where id = $3', [req.body.name, req.body.manufacturer_id, req.params.id], function (err, result) {
				client.query('UPDATE sauce_prices SET price = $1 where sauce_id = $2', [req.body.price, req.params.id], function (errr, resultt) {
					done();
					res.redirect('/sauces');
				});
			});
		});
	});

	app.put('/update-customer-purchase/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			client.query('UPDATE customer_purchases SET (customer_id, sauce_id, quantity) = ($1, $2, $3) where id = $4', [req.body.customer_id, req.body.sauce_id, req.body.quantity, req.params.id], function (err, result) {

				console.log(err)
				done();
				
				res.redirect('/customers/' + req.body.customer_id);
				
			});
		});
	});

	app.put('/update-customer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			console.log(req.body)
			client.query('UPDATE customers SET (name) = ($1) where id = $2', [req.body.name, req.params.id], function (err, result) {

				client.query('UPDATE customer_emails SET (email) = ($1) where customer_id = $2', [req.body.email, req.params.id], function (errr, resultt) {
					console.log(errr);
					done();
					res.redirect('/customers');
				});
			});
		});
	});

	app.put('/update-manufacturer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			client.query('UPDATE manufacturers SET (name) = ($1) where id = $2', [req.body.name, req.params.id], function (err, result) {
				done();
				res.redirect('/manufacturers');
			});
		});
	});

//delete routes
	app.delete('/delete-customer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			client.query('DELETE FROM customers WHERE id=$1', [req.params.id], function (err, result) {

				client.query('DELETE FROM customer_emails WHERE customer_id=$1', [req.params.id], function (err, result) {
					client.query('DELETE FROM customer_purchases WHERE customer_id=$1', [req.params.id], function (err, result) {
						done();
						res.redirect('/customers')
					});
				});
			});
		});
	});

	app.delete('/delete-manufacturer/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			client.query('DELETE FROM manufacturers WHERE id=$1', [req.params.id], function (err, result) {

				client.query('DELETE FROM sauces WHERE manufacturer_id=$1', [req.params.id], function (err, result) {

					//result.rows will look like this, so we need to make it look better for the sql query below
					//[ { id: 13 }, { id: 14 } ]
					var deleteTheseArr = [];

					for(var i=0; i < result.rows.length; i++){
						deleteTheseArr.push(result.rows[i].id);
					}

					var placeholders = deleteTheseArr.join(',');

					//need to include the stupid string in the stupid sql query like this - fuck express
					client.query('DELETE FROM sauce_prices WHERE sauce_id IN (' + placeholders + ')', function (err, result) {
						console.log(err)
						done();
						res.redirect('/manufacturers')
					});
					
				});
			});
		});
	});

	app.delete('/delete-sauce/:id', function(req, res){
		pg.connect(connectionString, function (err, client, done) {
			client.query('DELETE FROM sauces WHERE id=$1', [req.params.id], function (err, result) {

				client.query('DELETE FROM sauce_prices WHERE sauce_id=$1', [req.params.id], function (err, result) {
					
					done();
					res.redirect('/sauces')
					
				});
			});
		});
	});
