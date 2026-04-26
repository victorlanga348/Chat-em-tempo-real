import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "../components/Input";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import Container from "../components/Container";
import Form from "../components/Form";

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
        <h2 className="text-white text-2xl font-bold mb-6 text-center">DevChat Cadastro</h2>
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
        <Button type="submit">Cadastrar</Button>
        <p className="text-gray-400 mt-6 text-center">Já tem uma conta? <TextLink to="/login">Faça login!</TextLink></p>
      </Form>
    </Container>
 
  );
}

export default Cadastro;