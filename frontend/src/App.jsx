import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat'; 
import Cadastro from './pages/Cadastro';
import { Toaster } from 'sonner';
import { Navigate } from 'react-router-dom';

function App() {
  const navigateTo = (path) => <Navigate to={path} />;
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={navigateTo("/login")} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;