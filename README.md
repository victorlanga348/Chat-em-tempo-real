# 💬 Chat em Tempo Real - WebSocket & Full-Stack Architecture

Aplicativo Full Stack de chat completo e em tempo real, construído com uma arquitetura moderna e escalável utilizando **React** no frontend e **Node.js** com **Express** e **Socket.io** no backend. O projeto foi desenvolvido com foco em comunicação instantânea, segurança com JWT e design responsivo.

Diferente de sistemas convencionais baseados em requisições long-polling, este sistema implementa WebSockets nativos para garantir a entrega bidirecional e instantânea das mensagens, com persistência de histórico no banco de dados.

---

## 🔗 Links do Projeto
- **Repositório:** [https://github.com/victorlanga348/Chat-em-tempo-real](https://github.com/victorlanga348/Chat-em-tempo-real)

---

## 🧠 Decisões de Arquitetura

### **1. Comunicação Bidirecional (WebSockets)**
Optei pelo uso do Socket.io para manter uma conexão persistente entre cliente e servidor, eliminando a sobrecarga de requisições HTTP sucessivas e permitindo a atualização instantânea de mensagens e status de usuários (online/offline).

### **2. Persistência de Histórico no Banco de Dados**
As mensagens são gravadas diretamente no banco de dados antes da emissão via Socket. Essa abordagem garante que os usuários tenham acesso ao histórico completo de conversas (tanto globais quanto privadas) mesmo após se desconectarem e retornarem à plataforma.

### **3. Escolha do Prisma ORM**
Utilizei o Prisma para garantir **Type Safety** e agilidade no desenvolvimento backend. A sua integração simplificada com banco de dados relacional facilita o mapeamento das complexas relações entre Usuários, Salas e Mensagens.

### **4. Isolamento entre Chat Global e Privado**
A estrutura de salas virtuais (rooms) do Socket.io foi empregada de forma estratégica, onde existe um canal de broadcast para o chat global ("Geral") e canais exclusivos baseados em IDs únicos para os chats 1-para-1, impedindo vazamento de mensagens.

---

## 🔒 Pontos Técnicos e Segurança

- **Autenticação com JWT:** Todas as rotas sensíveis são protegidas via JSON Web Tokens. O token é necessário para acessar o histórico de chats e estabelecer a conexão via Socket.io.
- **Criptografia de Senhas:** O Bcrypt foi implementado para gerar hashes seguros das senhas dos usuários, impedindo que credenciais fiquem legíveis no banco de dados.
- **Verificação de Propriedade:** O backend verifica a identidade baseada no token para certificar-se de que o usuário só pode ler e enviar mensagens nas salas privadas às quais pertence.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (Node.js & Express)**
- **Express:** Engine de rotas e criação da API REST.
- **Socket.io:** Para gerenciar conexões de WebSocket e eventos em tempo real.
- **Prisma ORM:** Modelagem de dados relacional e interação segura.
- **JWT (Json Web Token):** Autenticação e autorização seguras.
- **Bcrypt:** Algoritmo de hashing para senhas.

### **Frontend (React & Vite)**
- **React (Vite):** UI reativa, modular e de alta performance.
- **Tailwind CSS:** Design system utilitário e responsivo.
- **Socket.io-client:** Integração com os WebSockets do servidor.
- **React Router DOM:** Roteamento entre páginas (Login, Cadastro, Chat).
- **Axios:** Cliente HTTP para API RESTful.
- **Lucide React:** Ícones modernos e leves para a interface.

---

## 🔒 Destaques de Engenharia e Segurança

### **1. Controle de Estado em Tempo Real**
- Sincronização inteligente de status (Online/Offline) baseado nos eventos de conexão e desconexão do Socket.io.
- Atualização em tempo real da interface do usuário assim que novas mensagens chegam, evitando a necessidade de atualização manual.

### **2. Estruturação Modular de Rotas e Sockets**
- A lógica de REST (Login, Cadastro) está separada da lógica de Eventos Socket, mantendo o código escalável e de fácil manutenção.

---

## 📋 Principais Funcionalidades
- [x] **Autenticação de Usuários:** Login e Cadastro seguros utilizando JWT e senhas criptografadas.
- [x] **Chat Global:** Uma sala "Geral" onde todos os usuários registrados podem interagir.
- [x] **Chat Privado (1 para 1):** Mensagens diretas e exclusivas entre dois usuários.
- [x] **Status de Atividade:** Visualização de quais usuários estão online em tempo real.
- [x] **Histórico de Mensagens:** Todas as mensagens são persistidas no banco para acesso contínuo.
- [x] **Design Responsivo:** Interface moderna perfeitamente adaptada a dispositivos móveis e desktops.

---

## 🔮 Possíveis Evoluções
- [ ] **Digitação em Tempo Real:** Indicador de "Usuário X está digitando...".
- [ ] **Notificações:** Alertas visuais e sonoros para novas mensagens quando o chat estiver em background.
- [ ] **Envio de Mídia:** Suporte a envio de imagens e arquivos.
- [ ] **Mensagens Lidas:** Indicador de "Visualizado" (read receipts).

---

## 📂 Estrutura do Projeto

```text
├── backend/              # API RESTful & WebSocket Server
│   ├── prisma/           # Schema e migrations do banco de dados
│   ├── src/              # Controladores, rotas e configuração do Socket
│   └── .env              # Variáveis de ambiente
├── frontend/             # Frontend SPA (React)
│   ├── src/
│   │   ├── components/   # Componentes modulares
│   │   ├── pages/        # Telas (Login, Cadastro, Chat)
│   │   └── services/     # Configuração do Axios e Socket.io-client
```

## 🚀 Como Rodar o Projeto

### **1. Clone o repositório**
```bash
git clone https://github.com/victorlanga348/Chat-em-tempo-real.git
cd Chat-em-tempo-real
```

### **2. Configure o servidor (Backend):**
- Acesse `cd backend` e instale com `npm install`.
- Crie um arquivo `.env` na raiz da pasta `backend` com sua `DATABASE_URL` e `JWT_SECRET`.
- Execute as migrations: `npx prisma migrate dev`.
- Inicie o servidor: `npm run dev`.

### **3. Configure o frontend (Frontend):**
- Abra um novo terminal, acesse `cd frontend` e instale com `npm install`.
- Inicie o desenvolvimento: `npm run dev`.

## ✍️ Autor

Desenvolvido por Victor Langa com dedicação para aprender e dominar WebSockets, desenvolvimento Full-Stack e arquiteturas em tempo real.
