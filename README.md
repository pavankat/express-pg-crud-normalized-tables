# Creating DB, Executing Schema file and Importing data in

1. get into postgreSQL console:

```psql ```

2. create the sauce_db database:

```CREATE DATABASE sauce_db;```

3. in psql while connected to the sauce_db database, import the schema.sql file:

```
\i <path to the file>/schema.sql
```

4. This needs to be done after step 3: in psql while connected to the sauce_db database, import the seed.sql file:

```
\i <path to the file>/seed.sql
```

# Summary

You will be making a basic Customer Relationship Management (CRM) System for a distributor of sauces. The distributor works with retailers that sell the sauces.

# Screencasts

The app will look like this when done: http://screencast.com/t/itLakSGF2JJ 

Solution Screencasts:
	how to do /manufacturers and /sauces get routes: http://screencast.com/t/WWLGKKpO

	how to do /manufacturers/:id route: http://screencast.com/t/skJrk9e44hEg

	how to do /new-manufacturer, /create-manufacturer, /new-sauce, /create-sauce  : http://screencast.com/t/SQm2VRTz

	how to do /create-sauce continued : http://screencast.com/t/KvEmq4CrPJ

	how to do /edit-sauce : http://screencast.com/t/BdHmK5V69QlX

	how to do /edit-sauce continued : http://screencast.com/t/HuuVZanQY

# Part 1

Make these get routes work
	* app.get('/')
	* app.get('/manufacturers') -> render the manufacturers.handlebars file
	* app.get('/manufacturers/:id') -> render the manufacturer.handlebars file
	* app.get('/sauces') -> render the sauces.handlebars file
	* app.get('/customers') -> render the customers.handlebars fie
	* app.get('/customers/:id') -> render the customer.handlebars file

Make these new routes work
	* app.get('/new-manufacturer') -> render the new-manufacturer.handlebars
	* app.get('/new-sauce') -> render the new-sauce.handlebars
		* use a select drop dwon for manufacturer_id
	* app.get('/new-customer')  -> render the new-customer.handlebars
	* app.get('/new-customer-purchase')  -> render the new-customer-purchase.handlebars
		* use a the select drop down for customer_id
		* use a the select drop down for sauce_id

Make the create routes work
	* app.post('/create-manufacturer')  -> redirect to /manufacturers route
	* app.post('/create-sauce') -> redirect to /sauces route
	* app.post('/create-customer') -> redirect to /customers route
	* app.post('/create-customer-purchase') -> redirect to customers/<the id of the customer that made that purchase>

Make these edit routes work
	* app.get('/edit-sauce/:id') -> render the edit-sauce.handlebars file
		* use an input for the manufacturer_id 
	* app.get('/edit-customer-purchase/:id') -> render the edit-customer-purchase.handlebars file
		* use an input for the customer_id
		* use an input for the sauce_id
	* app.get('/edit-customer/:id') -> render the edit-customer.handlebars file
	* app.get('/edit-manufacturer/:id') -> render the edit-manufacturer.handlebars


Make these update routes work
	* app.put('/update-sauce/:id')  -> redirect to /sauces route
	* app.put('/update-customer-purchase/:id') -> redirect to /customers/<the id of the customer that made that purchase>
	* app.put('/update-customer/:id') -> redirect to /customers/<the id of the customer that made that purchase>
	* app.put('/update-manufacturer/:id') -> redirect to /manufacturers/<the id of the manufacturer that was just updated>

Make these delete routes work
	* app.delete('/delete-customer/:id') -> redirect to /customers
	* app.delete('/delete-manufacturer/:id') -> redirect to /manufacturers
	* app.delete('/delete-sauce/:id') -> redirect to /sauces


Make it pretty

# Bonus


* in app.get('/edit-sauce/:id')
	* put in the select drop down for manufacturer_id

* in app.get('/edit-customer-purchase/:id')
	* put in the select drop down for customer_id
	* put in the select drop down for sauce_id

* when deleting a customer make sure you delete the related customer_email record and any customer_purchase records

* when deleting a manufacturer, delete the associated sauces and sauce_prices

* when deleting a sauce also delete the sauce's price

