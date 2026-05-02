import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { toast } from "sonner";
import Input from "../components/Input";
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import Container from '../components/Container';
import Form from '../components/Form';
import { MessageSquare } from 'lucide-react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (!email.trim() || !password.trim()) return toast.error('Preencha todos os campos!');

      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', response.data.token);

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
    <Container>
      <Form onSubmit={handleLogin}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
            <MessageSquare className="text-blue-500" size={32} />
          </div>
          <h2 className="text-white text-3xl font-bold tracking-tight">Bem-vindo</h2>
          <p className="text-slate-400 mt-1">Entre no <span className="gradient-text font-bold">DevChat</span></p>
        </div>
        <Input 
          type="email" 
          placeholder="E-mail" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar na conta</Button>
        <p className="text-slate-400 mt-8 text-center text-sm">Não tem uma conta? <TextLink to="/register">Crie uma aqui!</TextLink></p>
      </Form>
    </Container>
  );
}