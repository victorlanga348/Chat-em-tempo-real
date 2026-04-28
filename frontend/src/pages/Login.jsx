import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { toast } from "sonner";
import Input from "../components/Input";
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import Container from '../components/Container';
import Form from '../components/Form';

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
        <h2 className="text-white text-2xl font-bold mb-6 text-center">DevChat Login</h2>
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
        <Button type="submit">Entrar</Button>
        <p className="text-gray-400 mt-6 text-center">Não tem uma conta? <TextLink to="/register">Crie uma aqui!</TextLink></p>
      </Form>
    </Container>
  );
}