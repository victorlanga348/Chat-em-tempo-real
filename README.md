# 💬 Chat em Tempo Real

Um aplicativo de chat completo e em tempo real, construído com uma arquitetura moderna e escalável utilizando React no frontend e Node.js com Express e Socket.io no backend.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React (Vite):** Biblioteca principal para construção da interface de usuário com alta performance.
- **TailwindCSS:** Framework CSS utilitário para uma estilização rápida e responsiva.
- **Socket.io-client:** Para comunicação em tempo real e bidirecional com o servidor.
- **React Router DOM:** Para roteamento e navegação entre as páginas (Login, Cadastro, Chat).
- **Axios:** Para requisições HTTP RESTful.
- **Lucide React:** Para ícones modernos e leves.

### Backend
- **Node.js & Express:** Ambiente de execução e framework web para a API.
- **Socket.io:** Para gerenciar conexões de WebSocket e emissão de eventos em tempo real.
- **Prisma ORM:** Para modelagem e interação segura com o banco de dados.
- **JWT (JSON Web Tokens):** Para autenticação e autorização seguras.
- **Bcrypt:** Para criptografia de senhas no banco de dados.

## ✨ Funcionalidades

- **Autenticação de Usuários:** Login e Cadastro seguros utilizando JWT e senhas criptografadas.
- **Chat Global:** Uma sala "Geral" onde todos os usuários registrados podem interagir.
- **Chat Privado (1 para 1):** Mensagens diretas entre dois usuários.
- **Status de Atividade:** Visualização de quais usuários estão online em tempo real.
- **Histórico de Mensagens:** Todas as mensagens são persistidas no banco de dados para acesso futuro.
- **Design Responsivo:** Interface moderna que se adapta perfeitamente a dispositivos móveis e desktops.

## 🛠️ Como Executar o Projeto

Certifique-se de ter o **Node.js** instalado na sua máquina.

### 1. Clone o repositório

```bash
git clone https://github.com/victorlanga348/Chat-em-tempo-real.git
cd Chat-em-tempo-real
```

### 2. Configurando o Backend

Navegue até a pasta do backend:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` e configure as variáveis de ambiente necessárias (ex: `DATABASE_URL`, `JWT_SECRET`).

Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O backend estará rodando, geralmente, em `http://localhost:3000`.

### 3. Configurando o Frontend

Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie a aplicação React (Vite):
```bash
npm run dev
```
Acesse o aplicativo no seu navegador no endereço indicado pelo Vite (geralmente `http://localhost:5173`).

---

Feito com dedicação para aprender e dominar WebSockets e desenvolvimento Full-Stack! 🚀
