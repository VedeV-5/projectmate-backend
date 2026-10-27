const mongoose = require("mongoose");

//Making Schema
const {Schema} =  mongoose;

const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        trim : true,
        minlength : 1
    },
    lastName : {
        type: String,
        trim : true,
        minlength : 1
    },
    email : {
        type: String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true
    },
    password: {
        type: String,
        required : true,

    },
    age : {
        type : Number,
        required : [true, "Age is required."],
        max : [130,"Enter valid age."],
        min : [18, "You must be atleast 18 years old."],
        validate : {
            validator : Number.isInteger,
            message : "Age should be Integer"
        }      
    },
    gender : {
        type : String,
        required : true,
        enum: ["M", "F", "Rather not say"]
    },
    photoUrl : {
        type : String,
        validate : {
            validator : (photoUrl) => validator.isURL(photoUrl),
            message : "Enter a valid photo url."
        }
    },
    about : {
        type : String,
    },
    skills : {
        type : [String],
        required : true,
        validate : [
            {
                validator : (skills) => {
                    return skills.length >=1 && skills.length <= 20
                },
                message : "Skills must contain between 1 to 20 items"
            },
            {   
                validator : (skills) => {
                    const normalizedSkills = skills.map((skill) => skill.trim().toLowerCase())

                    return normalizedSkills.every((skill,index) => normalizedSkills.indexOf(skill) === index)
                },
                message: "Skill must be unique."
            }
        ]
    }
},{timestamps : true});


module.exports = mongoose.model("user",userSchema)

