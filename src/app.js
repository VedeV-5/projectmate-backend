const express  = require("express");
const app = express();
const {databaseConnect} = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt")

app.use(express.json())

const validateSignup = require("./middlewares/validateSignup")
const checkAllowedFields = require("./middlewares/checkAllowedFields")

app.post("/signup", validateSignup, async (req, res) => {

    // After validating ->> destructring the reqBody
    const {firstName, lastName, email, password, age, gender, skills} = req.body;

    try{
        // Hash the passoword
        const passwordHash = await bcrypt.hash(password, 10)

        // Create the user document
        const user = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            age,
            gender,
            skills
        })

        // Save the user in mongoDB
        const savedUser = await user.save()
        
        // Return a successful response
        return res.status(201).json({
            message: "User registered successfully.",
            user : savedUser,
        });
    }      
    catch(err) {

        console.error("Signup error : ", err)

        // Handle duplicate key error, especially duplicate email ->  unique : true
        if(err.code === 11000){
            return res.status(409).json({
                message: "An account already exists with same email."
            })
        }

        // Handle  Mongoose scheme Validation Error
        if(err.name === "ValidationError"){
            return res.status(400).json({
                message : "Invalid user data."
            })
        }
        
        // Handle unexpected error
        return res.status(500).json({
            message : "Internal error occured."
        })
    }
    
})

app.post("/login",async (req, res) => {
    const {email, password} = req.body;
    try{
        // Find the user by email   
        const user = await User.findOne({email})
        
        // Check whether user exits
        if(!user){
            return  res.status(404).json({
                message: "Invalid email or password."
            })
        }

        // Now checking the password is Correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid email or password."
            })
        }

        return res.status(200).json({
            message : "Login successful."
        })
    }
    catch(err){
        console.log("Login error : ", err)

        return res.status(500).json({
            message : "Internal server error."
        })
    }

})

app.get("/feed", async (req, res) =>{
   try{
        const users = await User.find({}).select("-password");

        return res.status(200).json({
            success : true,
            data : users
        })
    }
    catch(err){
        console.error("Failed to fetch user: ", err)
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        })
    }
})

app.get("/users/search", async (req, res) => {
    try{
        const { name } = req.query;
        console.log("name", name)

        //Checking for the  name to be string -> bfr applying .trim()
        if(typeof name  !== "string" || !name.trim()){
            return res.status(400).json({
                success : false,
                message : "Name is required."
            })
        }

        //Removing special character -> that can be treated specially in regex (. => /. and + => /+ etc...)
        const escSpecialRegex = name.replace(/[.*+?^${}()|\[\]\\]/g,"\\$&")
        

        const parts = escSpecialRegex.trim().split(/\s+/)


        let query;
        if(parts.length === 1 ){
            query = {
                $or : [
                    {
                        firstName : {
                            $regex : parts[0],
                            $options : "i"
                        }
                    },
                    {   
                        lastName : {
                        $regex : parts[0],
                        $options : "i"
                        }  
                    }
                ] 
            }
        }else{
            query = {
                firstName : {
                    $regex : parts[0],
                    $options : "i"
                },
                lastName : {
                    $regex : parts.slice(1).join(" "),
                    $options : "i"
                }
            }
        }

        const users = await User.find(query).limit(20).select("-password")

        return res.status(200).json({
            success : true,
            data : users
        })
    }
    catch(err){
        console.log("Error finding the profile : ",err)

        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})

app.delete("/user/:id", async (req, res) => {

    try{
        const {id} = req.params;

        const deletedUser = await User.findByIdAndDelete({_id :  id})
        
        if(!deletedUser){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message : "Successfully deleted the user"
        })
    }
    catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({
                message : "Invalid user Id"
            })
        }

        console.log("Error deleting user : ",err);
        
        return res.status(500).json({
            message : "Internal server error."
        })

    }
    
})

app.patch("/user/:id", checkAllowedFields,async (req, res) => {
    try{
        const {id} = req.params;

        const updatedUser = await User.findByIdAndUpdate({_id : id}, req.body, {returnDocument : "before", runValidators : true}).select("-password");

        if(!updatedUser){
            return res.status(404).json({
                message : "User not found."
            })
        }

        return res.status(200).json({
            message : "Successfully updated the data",
            data : updatedUser
        })
    }
    catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({
                message: "Invalid user id."
            })
        }

        console.log("Error updating user.", err);
        return res.status(500).json({
            message : "Internal server error."
        })
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