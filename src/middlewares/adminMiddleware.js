const adminMiddleware = (req, res, next) => {
    if(req.role != 'admin'){
        res.status(401).send("Access Denied")
    }
    else{
        next()
    }
}

module.export = {
    adminMiddleware
}