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

export const informationToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
        });
    }
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
        });
      }
      req.user = decoded;
      next();
    });
}