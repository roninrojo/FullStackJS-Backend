import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import veterinarioRoutes from "./routes/veterinarioRoutes.js";  // <- archivos creados llevan extensión

// Cuando es import default podemos poner un alias directamente
const app = express();

// ¿Qué es un middleware? -> https://medium.com/@aarnlpezsosa/middleware-en-express-js-5ef947d668b
app.use(express.json());

// Variables de entorno
dotenv.config();
const PORT = process.env.PORT || 4000;

// MongoDB
connectDB();

// Routing Express
app.use("/api/veterinarios", veterinarioRoutes);

app.listen(PORT, () => {
    console.log(`Server running in ${PORT} 🚀`);
})