const mongoose = require("mongoose");

const databaseConnect = () => {
    return mongoose.connect("mongodb+srv://veDev:Veda%409986@cluster0.vefguh2.mongodb.net/?appName=Cluster0/devMatch"); 
}

module.exports ={
    databaseConnect
}