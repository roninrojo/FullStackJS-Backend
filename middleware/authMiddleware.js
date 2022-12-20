import jwt from "jsonwebtoken";
import { Veterniario } from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        try {
            // Quitamos el "Bearer "
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded); -> Obj
            
            // Instanciamos veterinario en el request. Ahora esta disponible para express. -> Custom request
            req.veterinario = await Veterniario.findById(decoded.id).select("-password -token -confirmado");
            
            // controller -> perfil 
            next();
            
        } catch (error) {
            const e = new Error(error);
            return res.status(403).json({msg: e.message})
        }
    } 
    
    if(!token){
        const error = new Error("El token no es válido o no existe");
        return res.status(403).json({ msg: error.message })
    }

    next();
} 

export default checkAuth;