//express project setup
const express = require('express');
require('dotenv').config()


const app = express();
const port = 3000;

//home route
app.get('/', (req, res) => res.send('Hello World!'));

//app listen
app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));
