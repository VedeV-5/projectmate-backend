const validateSignup = (req, res, next) => {

    //check whether if the req.body is undefined/null/ or str/arr/num or {} or 
    if(!req.body || Object.keys(req.body).length === 0 || typeof req.body !== "object" || Array.isArray(req.body)){
        return res.status(400).json({
            message : "request body is required and must be in json format"
        })
    }

    //Extract the field - type and user doesnt left the field empty with .trim
    const {firstName, lastName, email, password, gender, age, skills, photoUrl} = req.body; 
    if(typeof firstName !== "string"|| !firstName.trim() ||( typeof lastName !== "undefined" && (typeof lastName !== "string"  || !lastName.trim()) ))
    {
        return res.status(400).json({
            message : "firstName is required, lastName must contain the  valid values"
        })
    }

    //Validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/

    if(!emailRegex.test(email)){    /** .test(arg) -> automaticlaly convert the arg of Any type to String(IMPLICIT CONVERSION) */
        return res.status(400).json({
            message : "Please provide a valid email address"
        })
    }
    

    //Validate the password
    if(typeof password !== "string" || password.length < 8){
        return res.status(400).json({
            message : "password should be of >= 8 length"
        })
    }

    //Validate the age 
    if (typeof age !== "number" || !Number.isInteger(age) || age < 18) {
        return res.status(400).json({
            message: "Age must be an integer of at least 18."
        });
    }

    //Validate the gender
    const allowedGenders = ["M", "F", "Rather not say"];

    if(typeof gender !== "string" || !allowedGenders.includes(gender)){ /** .include(arg) -> also dont throw error if arg = of any datatypre */
        return res.status(400).json({
            message: "Please select valid gender option"
        })
    }

    //Validate the skills Array 
    if(!skills || !Array.isArray(skills) || !(skills.length >=1 && skills.length <=20)){
        return res.status(400).json({
            message: "Skills must be array with 1 to 20 items."
        })
    }
    else{
        //validating each string before calling trim -> as trim is applied in string and it should not be empty
        if(skills.some((skill) =>  typeof skill !== "string" || !skill.trim())){
            res.status(400).json({
                message: "Skill must be a non-empty string."
            })
        }
        //making all skills items in lowercase
        const normalizedSkill = skills.map((skill) => skill.trim().toLowerCase());

        //Checking if any duplicate skill is present
        const areUnique = normalizedSkill.every((skill, index) => normalizedSkill.indexOf(skill) === index )
        if(!areUnique){
            return res.status(400).json({
                message : "Duplicate skills Item."
            })
        }
    }

    //Validate the photo url
    if(!validator.isURL(photoUrl)){
        return res.status(400).json({
            message : "Enter a valid profile img url."
        })
    }

    //Validate the about
    if(!typeof about !== "string"){
        return res.status(400).json({
            message : "About section must be string."
        })
    }

    next();
}

module.exports = validateSignup;
