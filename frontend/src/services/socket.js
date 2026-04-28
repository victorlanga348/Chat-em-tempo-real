import { io } from 'socket.io-client';

// Endereço do seu Backend
const SOCKET_URL = 'https://backend-do-chat.onrender.com' || 'http://localhost:3000';

// Conectamos ao servidor
export const socket = io(SOCKET_URL, {
    autoConnect: false // Vamos conectar manualmente para ter mais controle
});