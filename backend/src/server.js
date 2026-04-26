import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import prisma from './services/db.js';
import userRoutes from './routes/public/userRoutes.js';
import chatRoutes from './routes/private/chatRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Criando o servidor HTTP que o Socket.io precisa
const server = http.createServer(app);

// Configurando o Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- ÁREA DO EXPRESS (Rotas HTTP) ---
app.use('/auth', userRoutes);
app.use('/chat', chatRoutes);

// --- ÁREA DO SOCKET.IO (Tempo Real) ---
// O evento 'connection' acontece quando o React "liga" para o servidor
io.on('connection', async (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    const userId = socket.handshake.auth.userId;
    if (userId) {
        try {
            await prisma.user.updateMany({
                where: { id: Number(userId) },
                data: { online: true }
            });
            io.emit('update_user_list');
            console.log(`Usuário ${userId} está online`);
        } catch (error) {
            console.error("Erro ao atualizar status online:", error);
        }
    }

    // Quando alguém envia uma mensagem
    socket.on('send_message', async (data) => {
        console.log("Mensagem recebida:", data);

        try {
            if (!data.userId || !data.conversationId) {
                console.error("ERRO: Dados incompletos do Frontend!", data);
                return; 
            }

            const novaMensagem = await prisma.message.create({
                data: {
                    text: data.text,
                    userId: Number(data.userId),
                    conversationId: Number(data.conversationId)
                },
                include: {
                    user: true
                }
            });
            
            console.log("Mensagem salva:", novaMensagem);

            io.emit('receive_message', {
                text: novaMensagem.text,
                userName: novaMensagem.user.name,
                userId: novaMensagem.userId,
                conversationId: novaMensagem.conversationId,
                createdAt: novaMensagem.createdAt
            });
        } catch (error) {
            console.error("Erro ao salvar mensagem:", error);
        }
    });

    socket.on('disconnect', async () => {
        if (userId) {
        try {
            await prisma.user.updateMany({
                where: { id: Number(userId) },
                data: { online: false }
            });
            io.emit('update_user_list'); 
            console.log(`Usuário ${userId} ficou offline`);
        } catch (error) {
            console.error("Erro ao atualizar status online:", error);
        }
    }
    });
});

const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));