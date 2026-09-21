export type StatusSolicitacao = 'RECEBIDA' | 'EM_ANALISE' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
export type PrioridadeSolicitacao = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type CategoriaSolicitacao = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';

export interface Solicitacao {
  id: string;
  protocolo: string;
  nome_solicitante: string;
  categoria: CategoriaSolicitacao;
  prioridade: PrioridadeSolicitacao;
  status: StatusSolicitacao;
  descricao: string;
  justificativa_prioridade?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SolicitacaoInput {
  nome_solicitante: string;
  categoria: CategoriaSolicitacao;
  prioridade: PrioridadeSolicitacao;
  descricao: string;
  justificativa_prioridade?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}