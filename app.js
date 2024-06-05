const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render('./admin/adminHome');
});
app.get("/login",(req,res)=>{
  res.render('./user/userLogin')
})
app.listen(PORT, () => {
  console.log("server start...");
});
