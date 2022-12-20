import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    propietario: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    sintomas: {
      type: String,
      required: true,
    },
    // Podemos agregar el id único con ObjectId (es propio de moongose)
    // Lo referenciamos al modelo de Veterinario por si nos queremos traer sus datos.
    veterinario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinario",
    },
  },
    {
      // -> https://mongoosejs.com/docs/timestamps.html
    timestamps: true,
  }
);

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;
