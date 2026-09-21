import { api } from '../api/client';
import type { 
  Solicitacao, 
  SolicitacaoInput, 
  PaginatedResponse, 
  StatusSolicitacao 
} from '../types/solicitacao';

export const solicitacoesService = {
  async listar(params?: Record<string, string>): Promise<PaginatedResponse<Solicitacao>> {
    const response = await api.get<PaginatedResponse<Solicitacao>>('/solicitacoes', { params });
    return response.data;
  },

  async obterPorId(id: string): Promise<Solicitacao> {
    const response = await api.get<{ data: Solicitacao }>(`/solicitacoes/${id}`);
    return response.data.data;
  },

  async criar(dados: SolicitacaoInput): Promise<Solicitacao> {
    const response = await api.post<{ data: Solicitacao }>('/solicitacoes', dados);
    return response.data.data;
  },

  async atualizarStatus(id: string, novoStatus: StatusSolicitacao): Promise<Solicitacao> {
    const response = await api.patch<{ data: Solicitacao }>(`/solicitacoes/${id}/status`, {
      status: novoStatus,
    });
    return response.data.data;
  },
};