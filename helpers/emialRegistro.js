import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    const { nombre, email, token } = datos;

    // Email
    const info = await transporter.sendMail({
        from: 'Administrador de PAcientes de Veterinaria', // sender address
        to: email, // list of receivers
        subject: `Hola ${nombre} tu cuenta está lista`, // Subject line
        text: "Te has registrado en APV", // plain text body
        html: `
               <p>Hola ${nombre}, ya puedes acceder a tu cuenta en APV mediante el siguiente enlace:</p>
               <p><a href="${process.env.LOCALHOST_URL}/confirm/${token}">Accede a tu cuenta</a></p>
            `, // html body
    });

    console.log("email enviado: %s", info.messageId);
    
}

export default emailRegistro;