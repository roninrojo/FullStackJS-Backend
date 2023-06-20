import nodemailer from "nodemailer";

const emailPassword = async (datos) => {
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
        from: 'Administrador de Pacientes de Veterinaria', // sender address
        to: email, // list of receivers
        subject: `Hola ${nombre}, solicitaste restablecer tu password`, // Subject line
        text: "Hola ${nombre}, solicitaste restablecer tu password", // plain text body
        html: `<p>👋</p>
               <p>Hola ${nombre}, para restablecer tu password, pulsa en el siguiente enlace:</p>
               <p><a href="${process.env.LOCALHOST_URL}/forgotten-password/${token}">Restablece tu password</a></p>
            `, // html body
    });

    console.log("email enviado: %s", info.messageId);
    
}

export default emailPassword;