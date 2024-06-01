const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render('./admin/adminLogin');
});

app.listen(PORT, () => {
  console.log("server start...");
});

