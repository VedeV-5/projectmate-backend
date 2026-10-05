const express  = require("express");

const app = express();

const {authMiddleware} = require("./middlewares/authMiddleware")
const {adminMiddleware}  = require("./middlewares/adminMiddleware")

app.use("/admin", authMiddleware, adminMiddleware)

app.get("/admin/data",(req, res) => {
    res.send("data take admin")

})

app.listen(555,()=> { console.log("server is listening at port 555") })