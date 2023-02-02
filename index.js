import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js"; 

// Cuando es import default podemos poner un alias directamente
const app = express();

// ¿Qué es un middleware? -> https://medium.com/@aarnlpezsosa/middleware-en-express-js-5ef947d668b
app.use(express.json());

// Variables de entorno. Error -> declararlo despues de usar variables de entorno... 🤦‍♂️  
dotenv.config();

// Cors config
const allowList = [process.env.LOCALHOST_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowList.includes(origin)) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("No permitido por CORS"));
    }
  },
};
app.use(cors(corsOptions));

// PORT
const PORT = process.env.PORT || 4000;

// MongoDB
connectDB();

// Routing Express
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

app.listen(PORT, () => {
  console.log(`Server running in ${PORT} 🚀`);
})