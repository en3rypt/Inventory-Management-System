import mysql.connector
import pandas as pd

db = mysql.connector.connect(
    host="localhost",
    user="admin",
    password="admin"
)
cur = db.cursor()


cur.execute('DROP DATABASE IF EXISTS CBE_STOCKS')
# database creation
cur.execute("CREATE DATABASE IF NOT EXISTS CBE_STOCKS")
cur.execute("USE CBE_STOCKS")


# table creation


s = ['''CREATE TABLE RECEIVEDVOUCHERS (
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
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE IVITEMS (
	ivID INT NOT NULL,
	ivItemID INT NOT NULL,
	ivQtyReq INT NOT NULL,
	ivQtyPassed INT NOT NULL,
	PRIMARY KEY (ivID, ivItemID)
);
''',
     '''
CREATE TABLE ITEMS (
	ID INT NOT NULL AUTO_INCREMENT,
	CategoryID INT NOT NULL,
	Name varchar(255) NOT NULL,
	Quantity INT NOT NULL,
	Life INT NOT NULL DEFAULT 0,
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE CATEGORIES (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE USERS (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	Email varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	AuthType INT NOT NULL,
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE ISSUEDVOUCHERS (
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
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE RVITEMS (
	rvID INT NOT NULL,
	rvItemID INT NOT NULL,
	rvItemQty INT NOT NULL,
	rvItemRefNo varchar(255) NOT NULL,
	rvItemRefDate DATE NOT NULL,
	PRIMARY KEY (rvID, rvItemID)
);''',
     '''
CREATE TABLE STATIONS (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
CREATE TABLE SCHEMES (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	DateOfCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ID)
);''',
     '''
ALTER TABLE RECEIVEDVOUCHERS ADD FOREIGN KEY (ApprovedBy) REFERENCES USERS(ID);''',
     '''
ALTER TABLE IVITEMS ADD FOREIGN KEY (ivID) REFERENCES ISSUEDVOUCHERS(ID);''',
     '''
ALTER TABLE IVITEMS ADD FOREIGN KEY (ivItemID) REFERENCES ITEMS(ID);''',
     '''
ALTER TABLE ITEMS ADD FOREIGN KEY (CategoryID) REFERENCES CATEGORIES(ID);''',
     '''
ALTER TABLE ISSUEDVOUCHERS ADD FOREIGN KEY (Receiver) REFERENCES STATIONS(ID);''',
     '''
ALTER TABLE ISSUEDVOUCHERS ADD FOREIGN KEY (Scheme) REFERENCES SCHEMES(ID);''',
     '''
ALTER TABLE ISSUEDVOUCHERS ADD FOREIGN KEY (ApprovedBy) REFERENCES USERS(ID);''',
     '''
ALTER TABLE RVITEMS ADD FOREIGN KEY (rvID) REFERENCES RECEIVEDVOUCHERS(ID);''',
     '''
ALTER TABLE RVITEMS ADD FOREIGN KEY (rvItemID) REFERENCES ITEMS(ID);'''

     ]


for i in s:
    cur.execute(i)
