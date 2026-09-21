import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitacoesService } from '../services/solicitacoes';
import type { Solicitacao } from '../types/solicitacao';
import { Loading } from '../components/Loading';
import { ErrorState } from '../components/ErrorState';
import { StatusBadge } from '../components/StatusBadge'; // <-- Usando as cores institucionais!

export function SolicitacoesList() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      setLoading(true);
      setError(null);
      const res = await solicitacoesService.listar(); 
      setSolicitacoes(res.data);
    } catch (err) {
      setError('Não foi possível carregar os dados. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  const totalRecebidas = solicitacoes.filter(s => s.status === 'RECEBIDA').length;
  const totalEmAnalise = solicitacoes.filter(s => s.status === 'EM_ANALISE').length;
  const totalAgendadas = solicitacoes.filter(s => s.status === 'AGENDADA').length;
  const totalConcluidas = solicitacoes.filter(s => s.status === 'CONCLUIDA').length;

  if (loading) return <Loading />;
  if (error) return <ErrorState mensagem={error} />;

  return (
    // Fundo da página em cinza claro para destacar os cartões brancos
    <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: '#111827', fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Painel de Solicitações</h1>
            <p style={{ color: '#6B7280', margin: 0, fontSize: '0.95rem' }}>Visão geral e gestão de atendimentos de saúde.</p>
          </div>
          <Link 
            to="/nova" 
            style={{ 
              backgroundColor: '#2563EB', // O teu Azul Institucional
              color: '#fff', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            + Nova Solicitação
          </Link>
        </div>

        {/* DASHBOARD: Os 4 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <CardDashboard titulo="Novas / Recebidas" valor={totalRecebidas} cor="#6B7280" />
          <CardDashboard titulo="Em Análise" valor={totalEmAnalise} cor="#F59E0B" />
          <CardDashboard titulo="Agendadas" valor={totalAgendadas} cor="#2563EB" />
          <CardDashboard titulo="Concluídas" valor={totalConcluidas} cor="#10B981" />
        </div>

        {/* TABELA DE LISTAGEM */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#111827' }}>Últimas Solicitações</h2>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Protocolo</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solicitante</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prioridade</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#111827', fontSize: '0.9rem' }}>{item.protocolo}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#374151', fontSize: '0.9rem' }}>{item.nome_solicitante}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>
                    {item.prioridade === 'URGENTE' 
                      ? <span style={{ color: '#DC2626', fontWeight: '600', backgroundColor: '#FEE2E2', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>Urgente</span> 
                      : <span style={{ color: '#4B5563' }}>{item.prioridade}</span>}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/solicitacoes/${item.id}`} style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                      Abrir detalhe &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
}

// Subcomponente de Cartão aprimorado
function CardDashboard({ titulo, valor, cor }: { titulo: string; valor: number; cor: string }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      borderTop: `4px solid ${cor}`
    }}>
      <h3 style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 0.5rem 0', letterSpacing: '0.05em' }}>
        {titulo}
      </h3>
      <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', margin: 0, lineHeight: 1 }}>
        {valor}
      </p>
    </div>
  );
}