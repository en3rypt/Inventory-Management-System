import mysql.connector
import pandas as pd

db = mysql.connector.connect(
    host="localhost",
    user="admin",
    password="admin"
)
cur = db.cursor()
cur.execute("USE CBE_STOCKS")

xl_file = pd.ExcelFile('file.xlsx')
dfs = {sheet_name: xl_file.parse(sheet_name)
       for sheet_name in xl_file.sheet_names}

# categories entry
for i in dfs['Articles'].CATEGORY.unique():
    cur.execute("INSERT INTO CATEGORIES (Name) VALUES (%s)", (i,))
    db.commit()

# items entry
cat = dfs['Articles'].CATEGORY
items = dfs['Articles'].ITEMS
catID = {'STATIONARY ITEMS': 1, 'CLEANING MATERIALS': 2,
         "ELECTRONIC ITEMS": 3, "ELECTRICAL ITEMS": 4, "FORMS": 5}
for i in range(len(cat)):
    if '"' in items[i]:
        s = f"INSERT INTO ITEMS (CategoryID, Name, Quantity) VALUES({catID[cat[i]]}, '{items[i]}', 1000)"
    else:
        s = f'INSERT INTO ITEMS (CategoryID, Name, Quantity) VALUES({catID[cat[i]]}, "{items[i]}", 1000)'
    cur.execute(s)
    db.commit()

# stations entry
name = dfs['Station Details']['Name of the PS/ Unit']
for i in name:
    cur.execute("INSERT INTO STATIONS (Name) VALUES (%s)", (i,))
    db.commit()

schemes = ["MPF - Modernization of Police Force",
           "DF - Discretionary Funds", "Nirbhaya Funds"]
for i in schemes:
    cur.execute("INSERT INTO SCHEMES (Name) VALUES (%s)", (i,))
    db.commit()

cur.execute(
    "INSERT INTO USERS ( Name, Email, Password, AuthType) VALUES ( '-', 'NULL', 'NULL', 3)")
db.commit()
