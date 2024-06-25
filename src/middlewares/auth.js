export const isAuthenticated = (req, res, next) => {
    //console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

export const isAdmin = (req, res, next) => {
    const role = req.user.role
    //console.log(req.user)
    if(role === 'ADMIN'){
        console.log(role)
        next();
    } else {
        return res.send('No autorizado!')
    }
}