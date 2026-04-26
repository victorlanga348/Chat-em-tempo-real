import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000" || "https://backend-do-chat.onrender.com"
})

// MÁGICA: Este código abaixo anexa o token automaticamente em TODA requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        // Se houver token, adiciona no cabeçalho Authorization
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api