const checkAuth = (req, res, next) => {
    console.log("Primero se ejecuta este y luego NEXT!");
    next()
    
}

export default checkAuth;