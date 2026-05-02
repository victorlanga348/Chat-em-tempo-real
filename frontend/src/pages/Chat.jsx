import { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { toast } from "sonner";
import { MessageSquare, Users, LogOut, Send, Menu, X, Hash, User } from 'lucide-react';

function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [userSelected, setUserSelected] = useState();
  const [currentConversation, setCurrentConversation] = useState();
  
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
        const res = await api.get("/chat/profile");
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
          setListaMensagens([]); // Limpa as mensagens antigas instantaneamente
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

  //funcao para carregar os usuarios online
  const loadUsers = async () => {
    const res = await api.get('/chat/users');
    const usuarios = res.data.filter(u => u.id !== 1);
    setUsuariosOnline(usuarios);
  };

  //funcao para carregar os usuarios online
  useEffect(() => {
    loadUsers();

    socket.on('update_user_list', () => {
      loadUsers(); 
    });

    return () => socket.off('update_user_list');
  }, []);


  // useEffect para gerenciar a conexão Socket.io
  useEffect(() => {
    if (user) {
      // Configura e conecta o socket apenas se necessário
      socket.auth = { userId: user.id }; 
      
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => socket.emit('join_group');
      socket.on('connect', onConnect);
      if (socket.connected) onConnect();

      // Listener de mensagens recebidas
      const handleReceiveMessage = (data) => {
        setListaMensagens((prev) => {
          if (data.conversationId == currentConversationRef.current?.id) {
            return [...prev, data];
          }
          return prev;
        });
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('connect', onConnect);
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [user]);

  // Efeito separado para desconectar apenas quando sair DEFINITIVAMENTE da página de Chat
  useEffect(() => {
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // Ref para sempre ter acesso ao valor atualizado da conversa dentro do listener do socket
  const currentConversationRef = useRef(currentConversation);
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  // useEffect para rolar para o fundo sempre que a lista de mensagens mudar
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listaMensagens]);

  const enviarMensagem = () => {
    try {
      if (mensagem.trim() !== '') {
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

  //funcao que vai carregar a pagina enquanto o usuario não está autenticado
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
      // Cria a conversa no banco primeiro
      const res = await api.post('/chat/create-conversation', { userId: outroUsuario.id, id: user.id });

      // Atualiza os estados visuais se deu tudo certo
      setUserSelected(outroUsuario);
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
        className={`fixed top-0 left-0 h-full w-[280px] glass z-100 px-4 pb-6 flex flex-col gap-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarAberta ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
      >
        <div className="flex items-center gap-3 py-6 px-2 border-b border-white/5 mb-2">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
             <MessageSquare size={20} className="text-white" />
           </div>
           <div>
             <h2 className="font-bold text-white text-lg leading-tight">DevChat</h2>
             <p className="text-xs text-slate-400">Mensagens em tempo real</p>
           </div>
        </div>

        <div className="px-2">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Canais</h3>
          <button 
            onClick={() => {setCurrentConversation({ id: 1, name: "Grupo Geral" }); setUserSelected({ id: 1, name: "Grupo Geral" });}}
            className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${userSelected?.id === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`} 
          >
              <Hash size={18} className={userSelected?.id === 1 ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-400'} />
              <span className="font-medium">Grupo Geral</span>
          </button>
        </div>

        <div className="px-2 flex-1 overflow-y-auto">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 mt-6 px-2">Usuários Online</h3>
          <div className="flex flex-col gap-1">
            {usuariosOnline
            .filter(u => u.id !== user.id)
            .map(u => (
              <button
                key={u.id}
                className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${userSelected?.id === u.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                onClick={() => handleUserClick(u)}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden">
                    <User size={20} className="text-slate-500" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1e293b] ${u.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="font-medium truncate w-full text-left">{u.name}</span>
                  <span className="text-[10px] opacity-60 uppercase">{u.online ? 'Online' : 'Offline'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-2 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 mb-4">
             <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
               <User size={20} className="text-indigo-400" />
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-bold text-white truncate">{user.name}</span>
               <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
             </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className='w-full flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 p-3 rounded-xl cursor-pointer font-bold hover:bg-rose-500 hover:text-white transition-all duration-200 group active:scale-[0.98]'
          >
            <LogOut size={18} />
            <span>Sair do Chat</span>
          </button>
        </div>
      </div>

      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={() => setSidebarAberta(!sidebarAberta)}
        className={`fixed top-6 z-200 w-12 h-12 flex items-center justify-center glass hover:bg-blue-600 hover:text-white text-slate-400 rounded-2xl transition-all duration-500 shadow-xl active:scale-95 ${sidebarAberta ? 'left-[300px]' : 'left-6'}`}
        title={sidebarAberta ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarAberta ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen relative">
        {!userSelected && (
          <div className="flex flex-col items-center justify-center p-10 w-full h-full animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-blue-500/20">
               <MessageSquare size={48} className="text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Bem vindo ao <span className="gradient-text">DevChat</span></h1>
            <p className="text-slate-400 text-center max-w-sm leading-relaxed">
              Conecte-se com outros desenvolvedores em tempo real. Selecione um canal ou usuário para começar.
            </p>
          </div>
        )}
        
        {/*Chat privado*/}
        {userSelected && (
          <div className="flex flex-col w-full h-full max-w-5xl mx-auto p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header do Chat */}
            <div className="glass px-6 py-4 rounded-2xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                  {userSelected.id === 1 ? <Hash size={24} className="text-blue-400" /> : <User size={24} className="text-blue-400" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-tight">{userSelected.name}</h1>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${userSelected.id === 1 || userSelected.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {userSelected.id === 1 ? 'Canal público' : (userSelected.online ? 'Disponível' : 'Indisponível')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="glass flex-1 overflow-y-auto p-6 rounded-3xl mb-4 flex flex-col gap-4 custom-scrollbar">
              {listaMensagens.map((msg, index) => {
                const isMe = msg.userName === user.name;
                return (
                  <div 
                    key={index} 
                    className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'} animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-300`}
                  >
                    {!isMe && msg.userName && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-4">
                        {msg.userName}
                      </span>
                    )}
                    <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/5'}`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="glass p-3 rounded-2xl flex gap-3 items-center focus-within:ring-2 focus-within:ring-blue-500/30 transition-all duration-300">
              <input 
                className="flex-1 p-3 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-[15px]"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                placeholder="Escreva uma mensagem incrível..."
              />
              <button 
                onClick={enviarMensagem}
                disabled={!mensagem.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-500 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;