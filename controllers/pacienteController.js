import Paciente from "../models/Paciente.js";

const registrarPaciente = async (req, res) => {
    // Recibimos datos
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    
    try {
        const pacienteRegistro = await paciente.save();
        res.json(pacienteRegistro);
    } catch (error) {
        console.log(error);
    }

}

const obtenerPacientes = async(req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario);
    
    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        // Nos aseguramos que la sesión es la correcta en la query.
        const paciente = await Paciente.findById(id).where("veterinario").equals(req.veterinario);
        if (paciente) {
            return res.json(paciente);
        } else {
            return res.json({msg:"Acción no valida"});
        }
    } catch (error) {
        return res.status(400).json({msg: error.message})
        
    }
}
const actualizarPaciente = async (req,res) => {
    const { id } = req.params;
    try {
        // Nos aseguramos que la sesión es la correcta en la query.
        const paciente = await Paciente.findById(id).where("veterinario").equals(req.veterinario);
        if (paciente) {
            console.log(paciente);
            paciente.nombre = req.body.nombre || paciente.nombre;
            paciente.propietario = req.body.propietario || paciente.propietario;
            paciente.email = req.body.email || paciente.email;
            paciente.fecha = req.body.fecha || paciente.fecha;
            paciente.sintomas = req.body.sintomas || paciente.sintomas;

            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado);
        } else {
            return res.json({msg:"El paciente no existe o acción no valida"});
        }
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }

}
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id).where("veterinario").equals(req.veterinario);
        if (paciente) {
            await paciente.deleteOne();
            return res.json({msg:"Paciente eliminado"});
        } else {
            return res.json({msg:"El paciente no existe o Acción no valida"});
        }
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export {
    registrarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}