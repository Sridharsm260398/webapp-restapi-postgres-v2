select * from useraddress where user_id ='280ece5e-e62e-4dd0-b783-d076eb5749c4';
SELECT * FROM savedcards WHERE user_id ='280ece5e-e62e-4dd0-b783-d076eb5749c4';
select * from products where title ilike '%mens%';
Select * from products where( title ILIKE '%mens%' or category ILIKE 'men''s clothing%') ORDER BY id LIMIT 100 OFFSET 0;
CREATE TABLE users (
id	serial  NOT NULL ,
email	VARCHAR (255) unique NOT NULL,
password	VARCHAR (255)  NOT NULL,
forget_password	VARCHAR (255) ,
phone_number	varchar(10)unique check (phone_number ~ '^[0-9]{10}$') NOT NULL,
first_name	VARCHAR (100)  NOT NULL,
last_name	VARCHAR (100)  NOT NULL,
user_id	VARCHAR (255) unique PRIMARY KEY,
column profile_photo TEXT
);
--drop table if exists cart,order_items,orders,products,products_1,useraddress,users;select * from products;
CREATE TABLE products (
   id INT NOT NULL,  
   title text,
   price DECIMAL(10, 2) NOT NULL,
   description TEXT,
   category text,
   image text,
   rate DECIMAL(3, 2),
    count VARCHAR(255)
);
CREATE TABLE messages (
 id SERIAL PRIMARY KEY,
 sender_id  Varchar REFERENCES users(user_id),
 receiver_id Varchar REFERENCES users(user_id),
 content TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
  CREATE TABLE products_1(
	 id int NOT NULL,
     title  text,
     description text,
     price VARCHAR(255),
     discount_percentage VARCHAR(255),
     rating VARCHAR(255),
     stock VARCHAR(255),
     brand VARCHAR(255),
     category text,
     thumbnail text,
     image text
	 );
CREATE TABLE useraddress (
addressid	serial   NOT NULL ,
first_name	VARCHAR (255)  NOT NULL,
last_name	VARCHAR (255) NOT NULL,
locality	VARCHAR (255) NOT NULL,
address_optional	VARCHAR (255),
town_city	VARCHAR (255) NOT NULL,
country	VARCHAR (255) NOT NULL,
state	VARCHAR (255) NOT NULL,
postcode_zip	varchar(6) check (postcode_zip ~ '^[0-9]{6}$')NOT NULL,
email_address	VARCHAR (255) NOT NULL,
mobile	varchar(10) check (mobile ~ '^[0-9]{10}$')NOT NULL,
user_id varchar(255)NOT NULL,
FOREIGN KEY (user_id)
REFERENCES users (user_id)
ON DELETE CASCADE
ON UPDATE CASCADE
);
CREATE TABLE cart (
  user_id varchar(255) NOT NULL,
   FOREIGN KEY (user_id ) REFERENCES Users(user_id ),
   cart_id varchar(255) primary key NOT NULL,  
   title VARCHAR(255),
   price DECIMAL(10, 2)NOT NULL,
   description TEXT,
   category VARCHAR(255),
   image VARCHAR(255),
   rate DECIMAL(3, 2),
    count VARCHAR(255)
);
CREATE TABLE orders (
user_id varchar(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   On Update CASCADE,
   order_id VARCHAR(50) UNIQUE NOT NULL
  PRIMARY KEY ,
   invoice_no VARCHAR(50) UNIQUE NOT NULL,
   order_date TIMESTAMP NOT NULL,
   invoice_date TIMESTAMP NOT NULL,
   sold_by_name VARCHAR(255) NOT NULL,
   sold_by_address TEXT NOT NULL,
   sold_by_registered_address TEXT NOT NULL,
   shipping_address TEXT NOT NULL,
   billing_address TEXT NOT NULL,
   total_qty INT NOT NULL,
   total_price DECIMAL(10, 2) NOT NULL,
   declaration TEXT
);
CREATE TABLE order_items (
user_id varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   On Update CASCADE,
   id SERIAL PRIMARY KEY,
     order_id VARCHAR(50)  NOT NULL,
   FOREIGN KEY (order_id)  REFERENCES orders(order_id) ON DELETE 
   CASCADE ON update CASCADE,
   product VARCHAR(255) NOT NULL,
   description TEXT,
   qty INT NOT NULL,
   gross_amount DECIMAL(10, 2) NOT NULL,
   discount DECIMAL(10, 2) NOT NULL,
   taxable_value DECIMAL(10, 2) NOT NULL,
   igst DECIMAL(10, 2) NOT NULL,
   total DECIMAL(10, 2) NOT NULL
);
CREATE TABLE savedcards (
  user_id VARCHAR(255) NOT NULL,
   FOREIGN KEY (user_id ) REFERENCES Users(user_id )ON DELETE CASCADE
   ON UPDATE CASCADE,
   card_id	serial primary key,
   card_holder_name	VARCHAR (255)not null,
   card_number	VARCHAR(12)unique check (card_number ~ '^[0-9]{12}$') NOT NULL,
   cvv varchar(3) check (cvv ~ '^[0-9]{3}$') NOT NULL,
expiry_date varchar(5) check (expiry_date ~ '^[0-9/]{5}$') NOT NULL
);
drop table if exists savedcards;
select * from users;
select * from order_items;



SELECT * from users;

ALTER TABLE users
ADD COLUMN passwordChangedAt TIMESTAMP,
ADD COLUMN passwordResetToken TEXT,
ADD COLUMN passwordResetExpires TIMESTAMP,
ADD COLUMN confirmPassword TEXT;