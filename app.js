const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const adminRouter = require("./router/admin/adminRouter");
const categoryRouter = require("./router/admin/categoryRouter");
const subCategoryRouter = require("./router/admin/subCategoryRouter");
const productRouter = require("./router/admin/productRouter");
const userHome = require('./router/user/homeRouter')
const productDetail = require('./router/user/productDetailsRt')
const authentication = require('./router/user/authenticationRt')
const flash = require("connect-flash");
const session = require("express-session");
const cartRoutes = require('./router/user/cartRt');
const validation  = require("./middleware/dbValidation")
const checkOut = require('./router/user/checkOutRt')
require("dotenv").config();
const PORT = process.env.PORT;

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

connectDB(); 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", adminRouter);
app.use("/", categoryRouter);
app.use("/", subCategoryRouter);
app.use("/", productRouter); 
app.use("/",userHome)
app.use("/user",productDetail)
app.use("/user",authentication)
app.use('/cart',validation, cartRoutes);
app.use('/',validation,checkOut)
app.listen(PORT, () => {
  console.log("server start...");
});
