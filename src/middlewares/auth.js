export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

export const isAdmin = (req, res, next) => {
    /* Vamos a utilizar este middleware luego de que se ejecute 
    el de authenticate, por lo quepodemos acceder a req.user
    (ya que authenticate) llena con la info del usuario */
    const role = req.user.token.role
    if(role === 'ADMIN'){
        next()
    } else {
        return res.send('No autorizado!')
    }
}