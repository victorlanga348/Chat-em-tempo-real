import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim() || !email.trim() || !password.trim()) return toast.error('Preencha todos os campos!');

      console.log("passou aqui no primeiro if")

      const response = await api.post('/auth/register', { name, email, password });
      console.log(response.data);

      toast.success("Cadastro realizado com sucesso!");
      navigate('/login');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Erro ao cadastrar!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleCadastro} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">DevChat Cadastro</h2>
        <input 
          type="text" placeholder="Nome" 
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition cursor-pointer active:scale-95 outline-none">
          Cadastrar
        </button>
        <p className="text-gray-400 mt-6 text-center">Já tem uma conta? <Link to="/login" className="text-blue-400 hover:underline">Faça login!</Link></p>
      </form>
    </div>
 
  );
}

export default Cadastro;