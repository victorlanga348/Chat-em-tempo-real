import { Router } from 'express';
import prisma from '../services/db.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/messages/:conversationId', authMiddleware, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await prisma.message.findMany({
            where: { conversationId: Number(conversationId) },
            include: { user: true },
            orderBy: { createdAt: 'asc' }
        });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar mensagens da conversa" });
    }
});

router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                online: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.post('/create-conversation', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.body;
        console.log(id, userId);
        
        let conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { users: { some: { id: Number(id) } } },
                    { users: { some: { id: Number(userId) } } }
                ]
            }
        });
        
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    users: {
                        connect: [{ id: Number(id) }, { id: Number(userId) }]
                    }
                }
            });
        }
        
        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar conversa" });
    }
});

export default router