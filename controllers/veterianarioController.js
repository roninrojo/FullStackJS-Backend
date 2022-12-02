import { Veterniario } from "../models/Veterinario.js"
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
    res.json({msg: "hhtp//google.es"})
}

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

export {
    registrar,
    perfil,
    confirmar
}  