import type { StatusSolicitacao, PrioridadeSolicitacao } from '../types/solicitacao';

export type Status = StatusSolicitacao;
export type Prioridade = PrioridadeSolicitacao;

// Componente para Badges de Status
export function StatusBadge({ status }: { status: Status | string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    RECEBIDA: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-600' },
    EM_ANALISE: { bg: 'bg-blue-100/60', text: 'text-blue-700', dot: 'bg-blue-600' },
    AGENDADA: { bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500' },
    CONCLUIDA: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-600' },
    CANCELADA: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
  };

  const labels: Record<string, string> = { RECEBIDA: 'Recebida', EM_ANALISE: 'Em Análise', AGENDADA: 'Agendada', CONCLUIDA: 'Concluída', CANCELADA: 'Cancelada' };
  const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {labels[status] ?? status}
    </span>
  );
}

// Componente para Badges de Prioridade (Ajustado conforme o protótipo do Figma)
export function PriorityBadge({ priority }: { priority: Prioridade | string }) {
  if (priority === 'URGENTE') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
        <span>⚠️</span> Urgente
      </span>
    );
  }

  if (priority === 'ALTA') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Alta
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
      {priority === 'MEDIA' ? 'Média' : priority === 'BAIXA' ? 'Baixa' : priority}
    </span>
  );
}