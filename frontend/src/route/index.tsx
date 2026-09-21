import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SolicitacoesList } from '../pages/SolicitacoesList';
import { NovaSolicitacao } from '../pages/NovaSolicitacao';
import { DetalhesSolicitacao } from '../pages/DetalhesSolicitacao';
import { Dashboard } from '../pages/Dashboard';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolicitacoesList />} />
        <Route path="/nova" element={<NovaSolicitacao />} />
        <Route path="/solicitacoes/:id" element={<DetalhesSolicitacao />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}