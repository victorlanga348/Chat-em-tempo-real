import { io } from 'socket.io-client';

// Endereço do seu Backend
const SOCKET_URL = 'http://localhost:3000' || 'https://backend-do-chat.onrender.com';

// Conectamos ao servidor
export const socket = io(SOCKET_URL, {
    autoConnect: false
});