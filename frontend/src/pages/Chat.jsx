import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  async function getUser(){
    const res = await api.get("/users/profile");
    setUser(res.data);
    console.log(res.data);
  }
  
  useEffect(() => {
    getUser();
    if (!user) return navigate('/login');
    // 1. Liga o interruptor do socket
    socket.connect();

    // 2. Ouve quando o servidor "grita" uma mensagem nova
    socket.on('receive_message', (data) => {
      // Adiciona a nova mensagem na lista que aparece na tela
      setListaMensagens((prev) => [...prev, data]);
    });

    // 3. Limpa a conexão quando a gente fecha o site
    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, []);

  const enviarMensagem = async () => {
    if (mensagem.trim() !== '') {
      // Envia a mensagem para o servidor (Grita no microfone)
      socket.emit('send_message', {
        text: mensagem,
        user: user.name
      });
      setMensagem(''); // Limpa o campo
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">DevChat Teste</h1>

      <div className="bg-white w-full max-w-md h-80 overflow-y-auto p-4 rounded-lg shadow-inner border mb-4">
        {listaMensagens.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-blue-50 rounded">
            <strong>{msg.user}: </strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 w-full max-w-md">
        <input 
          className="flex-1 p-2 border rounded shadow-sm outline-none"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button 
          onClick={enviarMensagem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;