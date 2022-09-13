import mysql.connector
import pandas as pd

# db = mysql.connector.connect(
#     host="sql6.freesqldatabase.com",
#     user="sql6510904",
#     password="HE7SwbFPZT"
# )

db = mysql.connector.connect(
    host="localhost",
    user="admin",
    password="admin"
)


cur = db.cursor()


cur.execute('DROP DATABASE IF EXISTS CBE_STOCKS')
# database creation
cur.execute("CREATE DATABASE IF NOT EXISTS CBE_STOCKS")
# cur.execute("USE sql6510904")
cur.execute("USE CBE_STOCKS")


# table creation


s = ['''CREATE TABLE receivedvouchers (
	ID INT NOT NULL AUTO_INCREMENT,
	RVNo INT NOT NULL,
	RVYear INT NOT NULL,
	Supplier varchar(255) NOT NULL,
	SNo INT NOT NULL,
	Scheme INT NOT NULL,
	DateOfReceival DATE NOT NULL,
	Approval INT NOT NULL DEFAULT 0,
	ApprovedBy INT NOT NULL DEFAULT 1,
	ApprovalDate DATETIME DEFAULT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE ivitems (
	ivID INT NOT NULL,
	ivItemID INT NOT NULL,
	ivQtyReq INT NOT NULL,
	ivQtyPassed INT NOT NULL,
	PRIMARY KEY (ivID, ivItemID)
);
''',
     '''
CREATE TABLE items (
	ID INT NOT NULL AUTO_INCREMENT,
	CategoryID INT NOT NULL,
	Name varchar(255) NOT NULL,
	Quantity INT NOT NULL,
	Life INT NOT NULL DEFAULT 0,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE categories (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE users (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	Email varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	AuthType INT NOT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE issuedvouchers (
	ID INT NOT NULL AUTO_INCREMENT,
	IVNo INT NOT NULL,
	IVYear INT NOT NULL,
	Receiver INT NOT NULL,
	SNo INT NOT NULL,
	Scheme INT NOT NULL,
	DateOfReceival DATE NOT NULL,
	Approval INT NOT NULL DEFAULT 0,
	ApprovedBy INT NOT NULL DEFAULT 1,
	ApprovalDate DATETIME DEFAULT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE rvitems (
	rvID INT NOT NULL,
	rvItemID INT NOT NULL,
	rvItemQty INT NOT NULL,
	rvItemRef varchar(255) NOT NULL,
	PRIMARY KEY (rvID, rvItemID)
);''',
     '''
CREATE TABLE stations (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE schemes (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
ALTER TABLE receivedvouchers ADD FOREIGN KEY (ApprovedBy) REFERENCES users(ID);''',
     '''
ALTER TABLE ivitems ADD FOREIGN KEY (ivID) REFERENCES issuedvouchers(ID);''',
     '''
ALTER TABLE ivitems ADD FOREIGN KEY (ivItemID) REFERENCES items(ID);''',
     '''
ALTER TABLE items ADD FOREIGN KEY (CategoryID) REFERENCES categories(ID);''',
     '''
ALTER TABLE issuedvouchers ADD FOREIGN KEY (Receiver) REFERENCES stations(ID);''',
     '''
ALTER TABLE issuedvouchers ADD FOREIGN KEY (Scheme) REFERENCES schemes(ID);''',
     '''
ALTER TABLE issuedvouchers ADD FOREIGN KEY (ApprovedBy) REFERENCES users(ID);''',
     '''
ALTER TABLE rvitems ADD FOREIGN KEY (rvID) REFERENCES receivedvouchers(ID);''',
     '''
ALTER TABLE rvitems ADD FOREIGN KEY (rvItemID) REFERENCES items(ID);'''

     ]


for i in s:
    cur.execute(i)
