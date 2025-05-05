const express = require('express');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const port = require('./config/default.js').port;
let verifyAuthentication = require("./router/auth_users.js").verifyAuthentication;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    verifyAuthentication(req, res, next);
});
 
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(port,()=>console.log("Server is running"));
