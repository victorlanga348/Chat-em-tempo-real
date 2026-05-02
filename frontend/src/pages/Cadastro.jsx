import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "../components/Input";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import Container from "../components/Container";
import Form from "../components/Form";
import { UserPlus } from 'lucide-react';


function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim() || !email.trim() || !password.trim()) return toast.error('Preencha todos os campos!');

      await api.post('/auth/register', { name, email, password });

      toast.success("Cadastro realizado com sucesso!");
      navigate('/login');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Erro ao cadastrar!";
      toast.error(errorMessage);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleCadastro}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30">
            <UserPlus className="text-indigo-500" size={32} />
          </div>
          <h2 className="text-white text-3xl font-bold tracking-tight">Criar conta</h2>
          <p className="text-slate-400 mt-1">Junte-se à comunidade <span className="gradient-text font-bold">DevChat</span></p>
        </div>
        <Input 
          type="text" 
          placeholder="Nome" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <Button type="submit">Criar minha conta</Button>
        <p className="text-slate-400 mt-8 text-center text-sm">Já tem uma conta? <TextLink to="/login">Faça login!</TextLink></p>
      </Form>
    </Container>
 
  );
}

export default Cadastro;