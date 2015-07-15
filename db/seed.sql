INSERT INTO manufacturers (name) VALUES ('Huy Fong Foods, INC.');
INSERT INTO manufacturers (name) VALUES ('Kraft Foods');
INSERT INTO manufacturers (name) VALUES ('Jose Cuervo');

INSERT INTO sauces (manufacturer_id, name) VALUES (1, 'Sriracha Hot Chili Sauce, 17 Oz Bottle');
INSERT INTO sauces (manufacturer_id, name) VALUES (1, 'Chili Garlic Sauce, 8 Oz Jar');
INSERT INTO sauces (manufacturer_id, name) VALUES (2, 'A1 Steak Sauce, 10 Oz Bottle');    
INSERT INTO sauces (manufacturer_id, name) VALUES (3, 'Cholula Hot Sauce Original, 5 Oz Bottle');  

INSERT INTO sauce_prices (sauce_id, price) VALUES (1, 6);
INSERT INTO sauce_prices (sauce_id, price) VALUES (2, 6);
INSERT INTO sauce_prices (sauce_id, price) VALUES (3, 5);    
INSERT INTO sauce_prices (sauce_id, price) VALUES (4, 4);  

INSERT INTO customers (name) VALUES ('Pavan');  
INSERT INTO customers (name) VALUES ('Akira');  
INSERT INTO customers (name) VALUES ('David');  
INSERT INTO customers (name) VALUES ('Will');  

INSERT INTO customer_emails (customer_id, email) VALUES (1, 'cats_and_rabbit@gmail.com');  
INSERT INTO customer_emails (customer_id, email) VALUES (2, 'california_french_fries@gmail.com');  
INSERT INTO customer_emails (customer_id, email) VALUES (3, 'hockey_cigs@gmail.com');  
INSERT INTO customer_emails (customer_id, email) VALUES (4, 'crossfit_garlic@gmail.com');

INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (1, 1, 2);  
INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (1, 2, 1);  
INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (1, 3, 1);  

INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (2, 4, 4);  

INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (3, 3, 3);  

INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (4, 1, 1);
INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (4, 2, 1);
INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (4, 3, 1);
INSERT INTO customer_purchases (customer_id, sauce_id, quantity) VALUES (4, 4, 2);