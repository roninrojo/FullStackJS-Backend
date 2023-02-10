// import res from "express/lib/response.js";
import { Veterinario } from "../models/Veterinario.js"
import generarJWT from "../helpers/jsonWebToken.js";
import tokenGenerator from "../helpers/tokenGenerator.js";
import emailRegistro from "../helpers/emialRegistro.js";
import emailPassword from "../helpers/emailOlvidado.js";

// El usuario envia sus datos rellenando un formulario de registro
const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir duplicados
    const userExist = await Veterinario.findOne({ email });
    if (userExist) {
        const error = new Error("Ese email ya está registrado");
        return res.status(400).json({ msg: error.message });
    }
    try {
        // Recibimos datos
        const veterinario = new Veterinario(req.body);
        // Guardamos un registro en MongoDB
        const veterinarioRegistro = await veterinario.save();

        // Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioRegistro.token
        })    
        
        res.json({ veterinarioRegistro })
    } catch (error) {
        console.log(error);
    }
    
}

const perfil = (req, res) => {
    console.log('entra a perfil');
    
    const { veterinario } = req;

    res.json({veterinario})

    console.log(req.veterinario);
    
}

// El usuario confirma el registro mediante un token enviado por url /:token
const confirmar = async (req, res) => {
    const { token } = req.params;
    try {
        const usuarioConfirmar = await Veterinario.findOne({token}) // {token : token}
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

const login = async (req, res) => {
    const { email, password } = req.body;
    
    const usuario = await Veterinario.findOne({ email });
    // Crea una instancia del modelo cuando encuentra un registro que coincide con email. Podemos usar .select para traernos solo lo que nos interese
    

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

    // Sí existe...
    // console.log(usuario._id); // { _id: new ObjectId...
    
    // Atenticar usuario
    if (await usuario.comprobarPassword(password)) {
        // Autenticar con Json Web Token
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })

    } else {
        const error = new Error("Password incorrecto ");
        return res.status(403).json({msg: error.message})
    }

}

const passwordResetStart = async (req, res) => {
    // Nos llega una email (post req) y debemos buscarlo en la BD
    const { email } = req.body;
    
    const usuario = await Veterinario.findOne({ email });
    
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message})
    }

    // Si existe generamos token y enviamos email para autenticar
    try {
        usuario.token = tokenGenerator();
        await usuario.save();

        // Enviar email
        emailPassword({
            email,
            nombre: usuario.nombre,
            token: usuario.token
        })    

        res.json({ msg: "Email enviado" });
    } catch (error) {
        const e = new Error("Error inesperado");
        return res.status(500).json({msg: e.message})
    }
}

const passwordToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Veterinario.findOne({ token });
    
    if (usuario) {
        res.json({msg:"Token correcto"})
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message})
    }
}

const passwordResetEnd = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    
    const usuario = await Veterinario.findOne({ token });

    if (!usuario) {
        const error = new Error("Error inesperado");
        return res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = null;
        usuario.password = password;
        await usuario.save();
        res.json({msg:"Password modificado"})
    } catch (error) {
        const e = new Error("Token no valido");
        return res.status(403).json({msg: e.message})
    }
}

export {
    registrar,
    perfil,
    confirmar,
    login,
    passwordResetStart,
    passwordToken,
    passwordResetEnd
}  