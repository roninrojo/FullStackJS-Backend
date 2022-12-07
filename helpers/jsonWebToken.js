import jwt from "jsonwebtoken";

// Cuando llega al endpoint del controlador, generará un token
const generarJWT = (id) => {
    return jwt.sign(
        { id }, // id: id
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    )
};

export default generarJWT;

