CREATE DATABASE myBookshop;
USE myBookshop;
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myBookshop.* TO 'appuser'@'localhost';

CREATE TABLE users (id INT AUTO_INCREMENT,first VARCHAR(50),last VARCHAR(50),userN VARCHAR(50),password VARCHAR(200),email VARCHAR(50),PRIMARY KEY(id));

CREATE TABLE hotels (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2),booked VARCHAR(50), PRIMARY KEY(id));
INSERT INTO hotels (name, price,booked)VALUES('Seaview Cottage',65.20,"Vacant"),('Spring Manor',168.98,"Vacant"),('Treeline House',60.55,"Vacant")
,('City Penthouse',120.00,"Vacant"),('Lake Basement',55.99,"Vacant"),('Cosy Loft',33.20,"Vacant");

CREATE TABLE bookings (id INT AUTO_INCREMENT,name VARCHAR(50), userN VARCHAR(50),PRIMARY KEY(id));