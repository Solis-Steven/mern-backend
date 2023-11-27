import express from "express";
import dotenv from "dotenv";
import { dataBaseConnection } from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());

dotenv.config();

dataBaseConnection();

// Configurar cors
const whiteList = [
    process.env.FRONTEND_URL
];

const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)) {
            // Puede consultar la API
            callback(null, true);
        } else {
            // No esta permitido su request
            callback(new Error("Error de cors"))
        }
    }
}

app.use(cors(corsOptions));

// Routing
// use responde a todos los verbos HTTP
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
})

//* Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

// Abre una conexion de socket.io
io.on("connection", (socket) => {

    //* Definir los eventos de socket io
    socket.on("abrir proyecto", (proyectoId) => {
        socket.join(proyectoId); // Lo agrega a un room

        // socket.to().emit(); Para que sea solo a una persona por ejemplo
    });

    socket.on("nueva tarea", tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea agregada", tarea); // Emitir este nuevo evento a la persona que tiene abierta ese proyecto
    });

    socket.on("eliminar tarea", tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea eliminada", tarea)
    });

    socket.on("actualizar tarea", tarea => {
        const proyecto = tarea.proyecto._id;

        socket.to(proyecto).emit("tarea actualizada", tarea);
    });

    socket.on("cambiar estado", tarea => {
        const proyecto = tarea.proyecto._id;

        socket.to(proyecto).emit("nuevo estado", tarea);
    });
});