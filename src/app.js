const express  = require("express");

const app = express();

app.use("/",(req, res, next) => {
    res.send("got to the home page")
})

app.use("/hello",(req, res, next)=>{
    res.send("got to the hello page ")
})

app.use("/about",(req, res, next) => {
    res.send("got to the about page")
})

app.listen(555,()=> { console.log("server is listening at port 555") })