import express from 'express';
import cors from 'cors';
import http from 'http'; // Nativo do Node, serve para o Socket.io se apoiar
import { Server } from 'socket.io'; // O motor do chat
import dotenv from 'dotenv';

// Importando suas rotas (MVC)
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Criando o servidor HTTP que o Socket.io precisa
const server = http.createServer(app);

// Configurando o Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Libera o chat para qualquer frontend por enquanto
        methods: ["GET", "POST"]
    }
});

// --- ÁREA DO EXPRESS (Rotas HTTP) ---
app.use('/auth', userRoutes); // Seus logins e cadastros ficam aqui

app.get('/', (req, res) => {
    res.send("Servidor do DevChat rodando!");
});


// --- ÁREA DO SOCKET.IO (Tempo Real) ---
// O evento 'connection' acontece quando o React "liga" para o servidor
io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Quando alguém envia uma mensagem
    socket.on('send_message', (data) => {
        console.log("Mensagem recebida:", data);
        
        // O servidor recebe a mensagem e "grita" para todos os outros
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log("Usuário desconectou");
    });
});

// ATENÇÃO: Agora usamos server.listen e não app.listen!
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor HTTP e Socket rodando na porta ${PORT}`);
});