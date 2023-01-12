import jwt from "jsonwebtoken";
import { Veterniario } from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        try {
            // Quitamos el "Bearer "
            token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded); // -> Obj
            
            // Instanciamos veterinario en el request. Ahora esta disponible para express. -> Custom request
            req.veterinario = await Veterniario.findById(decoded.id).select("-password -token -confirmado");
            
            // controller -> siguiente
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
    /* En esta linea cometí un error que me llevó de cabeza... Puse otro next(). 
    Esto hacía que se llamara de nuevo el siguiente middleweare llamando a res.json dos veces. Los headers solo se pueden enviar / modificar una vez para la misma ruta.
    Esto hacía que al usar res.json en el siguiente middleweare dierra error (Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client).
    Se solucionó eliminando el segundo next()
    */
} 

export default checkAuth;