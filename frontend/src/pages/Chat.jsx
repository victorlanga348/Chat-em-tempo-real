import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await api.get("/auth/profile");
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }

    checkUser();
  }, [navigate]);

  useEffect(() => {
    // Busca as mensagens antigas via Axios (HTTP)
    async function carregarHistorico() {
        const res = await api.get('/auth/messages');
        // Formate os dados para ficarem iguais aos do Socket
        const formatadas = res.data.map(m => ({
            text: m.text,
            userName: m.user.name
        }));
        setListaMensagens(formatadas);
    }

    carregarHistorico();
    
    // Configuração do Socket...
    socket.connect();
    // ... resto do código
}, []);

  useEffect(() => {
    socket.connect();

    socket.on('receive_message', (data) => {
      setListaMensagens((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [user]);

  const enviarMensagem = () => {
    if (mensagem.trim() !== '' && user && user.id) {
      socket.emit('send_message', { 
        text: mensagem,
        userId: user.id,
        user: user.name
      });
      setMensagem('');
    } else {
      console.error("Não foi possível enviar: usuário não identificado ou texto vazio");
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Carregando...
      </div>
    );
  }
  
  if (!user) return;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-10 font-sans text-white">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">DevChat</h1>
        <div className="flex items-center gap-4">
          <span>Olá, <strong>{user.name}</strong></span>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="bg-gray-800 w-full max-w-2xl h-[500px] overflow-y-auto p-4 rounded-lg shadow-xl border border-gray-700 mb-4 flex flex-col gap-2">
        {listaMensagens.map((msg, index) => (
          <div key={index} className={`max-w-[80%] p-3 rounded-lg ${msg.userName === user.name ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'}`}>
            <div className="text-xs text-blue-200 mb-1">{msg.userName}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 w-full max-w-2xl">
        <input 
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
          placeholder="Digite sua mensagem..."
        />
        <button 
          onClick={enviarMensagem}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;