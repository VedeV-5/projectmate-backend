require("dotenv").config();
const mongoose = require("mongoose");

const databaseConnect = () => {
    return mongoose.connect(process.env.MONGODBcluster_URI)
}

module.exports ={
    databaseConnect
}