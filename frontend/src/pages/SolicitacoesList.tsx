import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitacoesService } from '../services/solicitacoes';
import type { Solicitacao } from '../types/solicitacao';
import { StatusBadge } from '../components/StatusBadge';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export function SolicitacoesList() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    solicitacoesService.listar()
      .then((res) => setSolicitacoes(res.data))
      .catch(() => setError('Erro ao ligar à API Laravel.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState mensagem={error} />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Solicitações de Saúde</h1>
        <Link to="/nova" style={{ padding: '0.6rem 1.2rem', backgroundColor: '#0066cc', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          + Nova Solicitação
        </Link>
      </div>

      {solicitacoes.length === 0 ? (
        <EmptyState />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '0.5rem' }}>Protocolo</th>
              <th style={{ padding: '0.5rem' }}>Solicitante</th>
              <th style={{ padding: '0.5rem' }}>Categoria</th>
              <th style={{ padding: '0.5rem' }}>Prioridade</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{item.protocolo}</td>
                <td style={{ padding: '0.5rem' }}>{item.nome_solicitante}</td>
                <td style={{ padding: '0.5rem' }}>{item.categoria}</td>
                <td style={{ padding: '0.5rem' }}>{item.prioridade}</td>
                <td style={{ padding: '0.5rem' }}><StatusBadge status={item.status} /></td>
                <td style={{ padding: '0.5rem' }}>
                  <Link to={`/solicitacoes/${item.id}`}>Ver detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}