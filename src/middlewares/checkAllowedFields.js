const checkAllowedFields = (req, res, next) =>{ 

    const allowedField = ["firstName", "gender", "skills", "photoUrl", "about", "lastName", "password" ]

    const requestedField = Object.keys(req.body)
    if(requestedField.length === 0){
        return res.status(400).json({
            message : "Please provide at least one field."
        })
    }

    const invalidField = requestedField.filter((field) => {
        return !allowedField.includes(field)
    })

    if(invalidField.length > 0){
        return res.status(400).json({
            messge: "You can't update these field."
        })
    }

    next()
}


module.exports = checkAllowedFields;