import res from "express/lib/response.js";
import { Veterniario } from "../models/Veterinario.js"
import generarJWT from "../helpers/jsonWebToken.js";

// El usuario envia sus datos rellenando un formulario de registro
const registrar = async (req, res) => {
    
    try {
        // Recibimos datos
        const veterinario = new Veterniario(req.body);
        // Guardamos un registro en MongoDB
        const veterinarioRegistro = await veterinario.save();
        
        res.json({ veterinarioRegistro })
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    res.json({msg: "Perfil"})
}

// El usuario confirma el registro mediante un token enviado por url /:token
const confirmar = async (req, res) => {
    const { token } = req.params;
    try {
        const usuarioConfirmar = await Veterniario.findOne({token}) // {token : token}
        if (!usuarioConfirmar) {
            const error = new Error("Token no valido");
            return res.status(404).json({ msg: error.message });
        } else {
            usuarioConfirmar.token = null;
            usuarioConfirmar.confirmado = true;
            await usuarioConfirmar.save();
            res.json({msg: "Usuario Confirmado Correctamente"})
        }
    } catch (error) {
        console.log(error);
    }    
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    
    const usuario = await Veterniario.findOne({ email });
    // Crea una instancia del modelo cuando encuentra un registro que coincide con email.
    console.log(usuario.id); // { _id: new ObjectId...

    // email no existe
    if (!usuario) { // null
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message})
    }
    
    // usuario no confirmado
    if (!usuario.confirmado) {
        const error = new Error("El usuario no esta confirmado");
        return res.status(403).json({msg: error.message})
    }

    // Atenticar usuario
    if (await usuario.comprobarPassword(password)) {
        // Autenticar con Json Web Token
        res.json({token: generarJWT(usuario.id)})

    } else {
        const error = new Error("Password incorrecto ");
        return res.status(403).json({msg: error.message})
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar
}  