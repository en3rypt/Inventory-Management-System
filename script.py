import mysql.connector

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


s = ['''CREATE TABLE IF NOT EXISTS REQUESTS (
	ID INT NOT NULL AUTO_INCREMENT,
	StationID INT NOT NULL,
	DateOfReceival TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Approval varchar(255) NOT NULL DEFAULT 'PENDING',
	PRIMARY KEY (ID)
);''',

     '''CREATE TABLE IF NOT EXISTS REQUESTEDITEMS (
	ReqID INT NOT NULL,
    ReqItemID INT NOT NULL,
	ReqItemQty INT NOT NULL,
	PRIMARY KEY (ReqID, ReqItemID)
);
''',
     '''CREATE TABLE IF NOT EXISTS ITEMS (
	ID INT NOT NULL AUTO_INCREMENT,
	CategoryID INT NOT NULL,
	Name varchar(255) NOT NULL,
	Quantity INT NOT NULL,
	PRIMARY KEY (ID)
);
''',
     '''CREATE TABLE IF NOT EXISTS CATEGORIES (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	PRIMARY KEY (ID)
);
''',
     '''CREATE TABLE IF NOT EXISTS USERS (
	ID INT NOT NULL AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	Email varchar(50) NOT NULL,
	password varchar(100) NOT NULL,
	AuthType INT NOT NULL,
	PRIMARY KEY (ID)
);
''',

     '''ALTER TABLE REQUESTEDITEMS ADD FOREIGN KEY (ReqID) REFERENCES REQUESTS(ID);''',

     '''ALTER TABLE REQUESTEDITEMS ADD FOREIGN KEY (ReqItemID) REFERENCES ITEMS(ID);''',

     '''ALTER TABLE ITEMS ADD FOREIGN KEY (CategoryID) REFERENCES CATEGORIES(ID);'''
     ]


for i in s:
    cur.execute(i)
