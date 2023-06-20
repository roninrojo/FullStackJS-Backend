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

    // console.log(req.veterinario);
    
}

// El usuario confirma el registro mediante un token enviado por url /:token
const confirmar = async (req, res) => {
    const { token } = req.params;
    console.log('entra en confirmar');
    
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
        const passwordSaved = await usuario.save();
        console.log(passwordSaved)
        res.json({msg:"Password modificado"})
    } catch (error) {
        const e = new Error("Token no valido");
        return res.status(403).json({msg: e.message})
    }
}

const actualizarPerfil = async (req, res) => {
    // guardamos instancia del registro de la BBDD
    // console.log(req.body);
    console.log('➡️ Entra en Actualizar Perfil');
    // console.log(req.veterinario);
    // Podríamos usar el id de req.veterinario, porque ya está logado y ha pasado por authMiddleware.js
    // que instancia veterinario en wl req, pero como le pasamos el perfil con el id, lo aprovechamos.
    const { _id, nombre, email, telefono, web } = req.body;
    const usuario = await Veterinario.findById(_id);
    if (!usuario) {
        const error = new Error("Error inesperado");
        return res.status(400).json({msg: error.message})
    }

    // email definido como único en el modelo -> Veterinario.js
    if (usuario.email !== email) {
        const exist = await Veterinario.findOne({ email });
        if (exist) {
            const error = new Error("Ese email está siendo usado por otro usuario. Tus cambios no se guardaron.");
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.telefono = telefono;
        usuario.web = web;
        
        const usuarioUpdated = await usuario.save();
        res.json(usuarioUpdated);

    } catch (error) {
        console.log(error);
        const e = new Error("Error inesperado");
        return res.status(400).json({msg: e.message})
        
    }
}

const actualizarPassword = async (req, res) => {
    console.log('entra en actualizar password');
    // console.log(req.body);
    // console.log(req);

    const { id } = req.veterinario; // <- authMiddleware.js No hace falta que le pasemos id
    const [ password, newPassword ] = req.body;
    const usuario = await Veterinario.findById(id);
    
    if (!usuario) {
        const error = new Error("No existe el usuario");
        return res.status(400).json({msg: error.message})
    }

    if (await usuario.comprobarPassword(password)) {
        try {
            usuario.password = newPassword;
            await usuario.save();
            res.json({msg:"Password modificado ✅"})
        } catch (error) {
            console.log(error);
            const e = new Error("Error inesperado. No se puedo actualizar el password.");
            return res.status(400).json({msg: e.message})
        }
    } else {
        const error = new Error("Password incorrecto");
        return res.status(403).json({msg: error.message})
    } 
}

export {
    registrar,
    perfil,
    confirmar,
    login,
    passwordResetStart,
    passwordToken,
    passwordResetEnd,
    actualizarPerfil,
    actualizarPassword
}  