const authMiddleware = (req, res, next) => {
    // we get the user from token 
    const user = {
        id: 101,
        role : 'admin',
    };

    if(!user){
        res.status(401).send("Please Login");
    }
    else{
        req.user = user; // we will add user property to req -> modifying the req
        next();
    }
}

module.exports = {
    authMiddleware
}