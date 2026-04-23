import { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { toast } from "sonner";

function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  
  // Ref para controlar o scroll automático
  const messagesEndRef = useRef(null);
  
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

  // Busca mensagens quando a conversa muda
  useEffect(() => {
    async function carregarMensagens() {
      if (currentConversation) {
        try {
          const res = await api.get(`/chat/messages/${currentConversation.id}`);
          const formatadas = res.data.map(m => ({
            text: m.text,
            userName: m.user.name,
            conversationId: m.conversationId
          }));
          setListaMensagens(formatadas);
        } catch (err) {
          console.error("Erro ao carregar mensagens:", err);
        }
      }
    }

    carregarMensagens();
  }, [currentConversation]);

  const loadUsers = async () => {
    const res = await api.get('/chat/users');
    setUsuariosOnline(res.data);
  };

  useEffect(() => {
    loadUsers();

    socket.on('update_user_list', () => {
      loadUsers(); 
    });

    return () => socket.off('update_user_list');
  }, []);


  useEffect(() => {
    if (user) {
      // Adiciona o ID do usuário na autenticação do socket
      socket.auth = { userId: user.id }; 
      socket.connect();
    }
  
    socket.on('receive_message', (data) => {
      // Só adiciona na lista se a mensagem for da conversa atual
      setListaMensagens((prev) => {
        if (currentConversation && data.conversationId === currentConversation.id) {
          return [...prev, data];
        }
        return prev;
      });
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [user, currentConversation]);

  // useEffect para rolar para o fundo sempre que a lista de mensagens mudar
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listaMensagens]);

  const enviarMensagem = () => {
    try {
      if (mensagem.trim() !== '' && user && currentConversation) {
        socket.emit('send_message', { 
          text: mensagem,
          userId: user.id,
          conversationId: currentConversation.id,
          user: user.name,
        });
      setMensagem('');
      } else {
        toast.error("Digite uma mensagem!");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Carregando...
      </div>
    );
  }



  //funcao para pegar o id de alguem especifico e criar o id de uma conversa intima
  async function handleUserClick(outroUsuario) {
    try {
      setUserSelected(outroUsuario);
      console.log("Conversando com:", outroUsuario.name);
      
      // Cria ou busca a conversa no backend
      const res = await api.post('/chat/create-conversation', { userId: outroUsuario.id, id: user.id });

      toast.success("Conversa criada com sucesso!");

      setCurrentConversation(res.data);
    } catch (error) {
      toast.error("Erro ao criar conversa!");
    }
  };
  
  if (!user) return;

  return (
    <div className="relative min-h-screen bg-gray-900 flex font-sans text-white overflow-hidden">

      {/* Overlay — fecha a sidebar ao clicar fora */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 z-99"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* Barra lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#1e2a3a] border-r border-gray-700 z-100 pt-20 px-5 pb-5 flex flex-col gap-3 transition-transform duration-300 ease-in-out ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className='font-bold text-blue-600 mb-5 text-[18px]'>Usuários Online</h2>
        {usuariosOnline
        .filter(u => u.id !== user.id).
        map(u => (
          <div key={u.id} className="flex flex-col gap-2">
            <div 
              className={`flex items-center gap-2 hover:bg-blue-600 p-2 rounded-lg cursor-pointer transition active:scale-95 ${userSelected?.id === u.id ? 'bg-blue-600' : 'bg-transparent'}`} 
              onClick={() => handleUserClick(u)}
            >
              <div 
                className={`w-2 h-2 rounded-full ${u.online ? 'bg-green-500' : 'bg-red-500 '}`}
              >
              </div>
              <button className="text-sm">{u.name}</button>
            </div>
            <div> 
              <hr className='border-gray-700' />
            </div>
          </div>
          
        ))}
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          className='bg-red-500 text-white border-none p-2 rounded-lg cursor-pointer text-[14px] mt-auto hover:bg-red-600 transition active:scale-95'
        >
          Sair
        </button>
      </div>

      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={() => setSidebarAberta(!sidebarAberta)}
        className={`fixed top-4 z-200 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-lg transition-all duration-300 active:scale-95 ${sidebarAberta ? 'left-[268px]' : 'left-4'}`}
        title={sidebarAberta ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarAberta ? '✕' : '☰'}
      </button>

      {/* Conteúdo principal */}

      {!userSelected && (
        <div className='w-full flex items-center justify-center h-screen flex-col'>
          <h1 className='font-bold text-[50px] mb-5'>Hi!</h1>
          <p className='text-gray-500'>Seja bem vindo ao nosso <span className='text-blue-600'>chat ao vivo</span></p>
        </div>
      )}
      
      {/*Chat privado*/}
      {userSelected && (
        <div className="flex flex-col items-center p-10 w-full">
          <h1 className="text-3xl font-bold text-blue-400 text-center mb-5">{userSelected.name}</h1>

          <div className="bg-gray-800 w-full max-w-2xl h-[500px] overflow-y-auto p-4 rounded-lg shadow-xl border border-gray-700 mb-4 flex flex-col gap-2">
            {listaMensagens.map((msg, index) => (
              <div key={index} className={`max-w-[80%] p-3 rounded-lg ${msg.userName === user.name ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'}`}>
                <div className="text-xs text-blue-200 mb-1">{msg.userName}</div>
                <div>{msg.text}</div>
              </div>
            ))}
            {/* Div invisível para marcar o fim da conversa e forçar o scroll */}
            <div ref={messagesEndRef} />
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
      )}
    </div>
  );
}

export default Chat;