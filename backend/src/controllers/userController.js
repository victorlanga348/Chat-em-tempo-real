import prisma from '../services/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({ data: { name, email, password: hash } });

        await prisma.conversation.upsert({
            where: { id: 1 }, // Vamos reservar o ID 1 para o Geral
            update: {
                users: { connect: { id: user.id } } // Adiciona o novo usuário
            },
            create: {
                id: 1,
                users: { connect: { id: user.id } }
            }
        });

        res.status(201).json(user);

    } catch (e) {
        console.error(e);
        res.status(400).json({ error: "Erro ao registrar" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro no servidor" });
    }
};

export const profile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user } });
        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro no servidor" });
    }
};
