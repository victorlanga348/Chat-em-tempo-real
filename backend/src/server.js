import express from 'express';
import cors from 'cors';
import http from 'http'; // Nativo do Node, serve para o Socket.io se apoiar
import { Server } from 'socket.io'; // O motor do chat
import dotenv from 'dotenv';
import prisma from './services/db.js';

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

// --- ÁREA DO SOCKET.IO (Tempo Real) ---
// O evento 'connection' acontece quando o React "liga" para o servidor
io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Quando alguém envia uma mensagem
    socket.on('send_message', async (data) => {
        console.log("Mensagem recebida:", data);

        try {
            // Se o userId não chegar, a gente para por aqui
            if (!data.userId) {
                console.error("ERRO: O userId veio vazio do Frontend!");
                return; 
            }

            // 1. Salva a mensagem no Banco de Dados
            const novaMensagem = await prisma.message.create({
                data: {
                    text: data.text,
                    userId: Number(data.userId)
                },
                include: {
                    user: true
                }
            });
            
            // 2. Envia para todo mundo a mensagem completa
            io.emit('receive_message', {
                text: novaMensagem.text,
                userName: novaMensagem.user.name,
                createdAt: novaMensagem.createdAt
            });
        } catch (error) {
            console.error("Erro ao salvar mensagem:", error);
        }
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