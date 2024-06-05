const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const adminRouter = require('./router/admin/adminRouter');
require('dotenv').config();
const PORT = process.env.PORT;


connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/',adminRouter)

app.listen(PORT, () => {
  console.log("server start...");
});

