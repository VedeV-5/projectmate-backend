const express  = require("express");
const app = express();

const {databaseConnect} = require("./config/database")

databaseConnect()
    .then(() => {
        console.log("DB connected successfully")
        app.listen(555,()=> { console.log("server is listening at port 555") })
    })
    .catch((err) => {
        console.error("DB connection failed:", err)
    })


