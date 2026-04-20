import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (email == '' || password == '') return alert('Preencha todos os campos!');

      await api.post('/auth/login', { email, password });
      
      if (res.data.user) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/chat');
        } else {
            alert("Dados do usuário não recebidos do servidor.");
        }
    } catch (err) { 
      console.error(err);
      alert("Erro ao logar!"); 
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">DevChat Login</h2>
        <input 
          type="email" placeholder="E-mail" 
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" 
          className="w-full p-2 mb-6 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition">
          Entrar
        </button>
        <p className="text-gray-400 mt-6 text-center">Não tem uma conta? <Link to="/register" className="text-blue-400 hover:underline">Crie uma aqui!</Link></p>
      </form>
    </div>
  );
}