import type { StatusSolicitacao } from '../types/solicitacao';

const statusColors: Record<StatusSolicitacao, { bg: string; color: string }> = {
  RECEBIDA: { bg: '#e3f2fd', color: '#0d47a1' },
  EM_ANALISE: { bg: '#fff3e0', color: '#e65100' },
  AGENDADA: { bg: '#f3e5f5', color: '#4a148c' },
  CONCLUIDA: { bg: '#e8f5e9', color: '#1b5e20' },
  CANCELADA: { bg: '#ffebee', color: '#b71c1c' },
};

export function StatusBadge({ status }: { status: StatusSolicitacao }) {
  const style = statusColors[status] || { bg: '#eee', color: '#333' };

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.color,
      padding: '0.25rem 0.6rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      {status.replace('_', ' ')}
    </span>
  );
}