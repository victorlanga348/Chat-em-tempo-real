function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "Acesso negado!" });

    try {

        const tokenLimpo = token.split(" ")[1] || token;

        const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}