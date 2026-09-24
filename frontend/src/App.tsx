import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SolicitacoesList } from './pages/SolicitacoesList';
import { NovaSolicitacao } from './pages/NovaSolicitacao';
import { DetalhesSolicitacao } from './pages/DetalhesSolicitacao';
import { Login } from './pages/Login';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { SolicitarAcesso } from './pages/SolicitarAcesso';
import { ToastProvider } from './contexts/ToastContext';

function PrivateRoutes() {
  const { signed, loading } = useAuth();

  if (loading) return null;

  return signed ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/solicitar-acesso" element={<SolicitarAcesso />} />

            {/* Rotas Protegidas */}
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/solicitacoes" element={<SolicitacoesList />} />
              <Route path="/nova" element={<NovaSolicitacao />} />
              <Route path="/solicitacoes/:id" element={<DetalhesSolicitacao />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}