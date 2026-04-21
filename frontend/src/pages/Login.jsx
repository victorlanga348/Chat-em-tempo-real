import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from "../services/api";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (!email.trim() || !password.trim()) return toast.error('Preencha todos os campos!');

      console.log("passou aqui no primeiro if")

      const response = await api.post('/auth/login', { email, password });
      console.log('passou na api')

      localStorage.setItem('token', response.data.token);
      console.log('passou no storage')

      toast.success("Login realizado com sucesso!")
      console.log('passou no toast')

      setEmail('')
      setPassword('')

      navigate("/chat")
    } catch (err) { 
      console.error(err);
      const errorMessage = err.response?.data?.error || "Erro ao logar!";
      toast.error(errorMessage); 
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">DevChat Login</h2>
        <input 
          type="email" placeholder="E-mail" 
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" 
          className="w-full p-2 mb-6 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition active:opacity-5">
          Entrar
        </button>
        <p className="text-gray-400 mt-6 text-center">Não tem uma conta? <Link to="/register" className="text-blue-400 hover:underline">Crie uma aqui!</Link></p>
      </form>
    </div>
  );
}