import type { StatusSolicitacao } from '../types/solicitacao';

interface StatusBadgeProps {
  status: StatusSolicitacao;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    RECEBIDA: 'bg-blue-50 text-blue-700 border-blue-200/60 dot-blue-500',
    EM_ANALISE: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dot-indigo-500',
    AGENDADA: 'bg-sky-50 text-sky-700 border-sky-200/60 dot-sky-500',
    CONCLUIDA: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald-500',
    CANCELADA: 'bg-rose-50 text-rose-700 border-rose-200/60 dot-rose-500',
  };

  const dots = {
    RECEBIDA: 'bg-blue-500',
    EM_ANALISE: 'bg-indigo-500',
    AGENDADA: 'bg-sky-500',
    CONCLUIDA: 'bg-emerald-500',
    CANCELADA: 'bg-rose-500',
  };

  const labels = {
    RECEBIDA: 'Recebida',
    EM_ANALISE: 'Em Análise',
    AGENDADA: 'Agendada',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}