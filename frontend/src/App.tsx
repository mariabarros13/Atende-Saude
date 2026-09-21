import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SolicitacoesList } from './pages/SolicitacoesList';
import { NovaSolicitacao } from './pages/NovaSolicitacao';
import { DetalhesSolicitacao } from './pages/DetalhesSolicitacao';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/solicitacoes" element={<SolicitacoesList />} />
          <Route path="/nova" element={<NovaSolicitacao />} />
          <Route path="/solicitacoes/:id" element={<DetalhesSolicitacao />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}