import nodemailer from "nodemailer";

export const emailRegistro = async (data) => {
    const { email, nombre, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Email information
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma Tu Cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `
            <p>Hola: ${nombre}. Comprueba tu cuenta en UpTask</p>
            
            <p>
                Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace: ${""}
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}

export const emailOlvidePassword = async (data) => {
    const { email, nombre, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    
    // Email information
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Restablece tu Password",
        text: "Restablece tu Password",
        html: `
            <p>Hola: ${nombre}. Has solicitado reestablecer tu password</p>
            
            <p>
                Sigue el siguiente password para generar un nuevo password: ${""}
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            </p>

            <p>Si tu no solicitaste este email, puedes ignorar este mensaje</p>
        `
    });
}