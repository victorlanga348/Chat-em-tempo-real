import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const token = req.headers.authorization; 

    if (!token) return res.status(401).json({ error: "Acesso negado!" });

    try {

        const cleanToken = token.split(" ")[1] || token;

        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}