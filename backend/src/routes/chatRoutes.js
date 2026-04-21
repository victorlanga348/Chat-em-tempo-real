import { Router } from 'express';
import prisma from '../services/db.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/messages', authMiddleware, async (req, res) => {
    const messages = await prisma.message.findMany({
        include: { user: true },
        orderBy: { createdAt: 'asc' } 
    });
    res.json(messages);
});

export default router