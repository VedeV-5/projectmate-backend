const express  = require("express");
const app = express();
const {databaseConnect} = require("./config/database");
const User = require("./models/user");

app.post("/signup",(req, res) => {
    const user = new User({
        firstName : "vedant",
        lastName : "thapliayal",
        age:21,
        password:"dfhd@gamil",
        email:"thalht@"
    })

    try{
        user.save().then((e) => {
        console.log(e);
        res.send("Successfully added the data");
    })
    }catch(err) {
        res.status(400).send("error saving document into mogoDB collection :",err)
    }
    
})

databaseConnect()
    .then(() => {
        console.log("DB connected successfully")
        app.listen(555,()=> { console.log("server is listening at port 555") })
    })
    .catch((err) => {
        console.error("DB connection failed:", err)
    })

