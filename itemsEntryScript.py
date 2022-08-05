import mysql.connector
import pandas as pd
from random import randint
db = mysql.connector.connect(
    host="sql6.freesqldatabase.com",
    user="sql6510904",
    password="HE7SwbFPZT"
)
cur = db.cursor()
cur.execute("USE sql6510904")

xl_file = pd.ExcelFile('file.xlsx')
dfs = {sheet_name: xl_file.parse(sheet_name)
       for sheet_name in xl_file.sheet_names}

# categories entry
for i in dfs['Articles'].CATEGORY.unique():
    cur.execute("INSERT INTO categories (Name) VALUES (%s)", (i,))
    db.commit()

# items entry
cat = dfs['Articles'].CATEGORY
items = dfs['Articles'].ITEMS
catID = {'STATIONARY ITEMS': 1, 'CLEANING MATERIALS': 2,
         "ELECTRONIC ITEMS": 3, "ELECTRICAL ITEMS": 4, "FORMS": 5}
for i in range(len(cat)):
    k = items[i].replace("'", "\\'").replace('"', '\\"')
    
    s = f"INSERT INTO items (CategoryID, Name, Quantity) VALUES({catID[cat[i]]}, '{k}', {randint(100,1000)})"
    
    cur.execute(s)
    db.commit()

# stations entry
name = dfs['Station Details']['Name of the PS/ Unit']
for i in name:
    cur.execute("INSERT INTO stations (Name) VALUES (%s)", (i,))
    db.commit()

schemes = ["MPF - Modernization of Police Force",
           "DF - Discretionary Funds", "Nirbhaya Funds"]
for i in schemes:
    cur.execute("INSERT INTO schemes (Name) VALUES (%s)", (i,))
    db.commit()


db.commit()
