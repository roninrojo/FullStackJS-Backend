// Por convención los modelos se nombran con la 1a letra en mayúscula

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import tokenGenerator from "../helpers/tokenGenerator.js";

// https://mongoosejs.com/docs/schematypes.html
const veterinarioSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	telefono: {
		type: String,
		default: null,
		trim: true
	},
	web: {
		type: String,
		default: null
	},
	token: {
		type: String,
		default: tokenGenerator()     
	},
	confirmado: {
		type: Boolean,
		default: false
	}
});

// .pre() es un middleware de mongoose. En este caso hacemos que salte antes del .save
// Modificamos el passord antes de almacenarlo
veterinarioSchema.pre("save", async function (next) {
   	// Usamos function() para utilizar el this que apunta al scope del objeto  que llama la función
   	// Si usamos () => this apunta al scope de la función
   
	// Si el ususario modifica otros datos y ya esta confirmado no queremos que se encripte de nuevo su password.
	// next() pasa al siguiente middleware
	if (!this.isModified('password')) {
		next() // -> save() 
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt)
})

// Asignamos un metdodo al objeto schema -> https://mongoosejs.com/docs/guide.html#methods
// Para comparar passwords

veterinarioSchema.methods.comprobarPassword = async function (passordForm) {
	return await bcrypt.compare(passordForm, this.password) // <- de nuevo apuntamos al this del objeto
}


// Mongoose tiene que compilar el esquema en un modelo (MVC). Para ello utiliza .model, toma un nombre y un esquema.
export const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
