import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { solicitacoesService } from '../services/solicitacoes';
import type {
  CategoriaSolicitacao,
  PrioridadeSolicitacao,
  Solicitacao,
  StatusSolicitacao,
} from '../types/solicitacao';
import { TableSkeleton } from '../components/Skeleton';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { useToast } from '../contexts/ToastContext';

export function SolicitacoesList() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusSolicitacao | ''>('');
  const [categoria, setCategoria] = useState<CategoriaSolicitacao | ''>('');
  const [prioridade, setPrioridade] = useState<PrioridadeSolicitacao | ''>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await solicitacoesService.listar({
          ...(status ? { status } : {}),
          ...(categoria ? { categoria } : {}),
          ...(prioridade ? { prioridade } : {}),
          page,
        });
        setSolicitacoes(response.data);
        setTotal(response.meta?.total ?? response.data.length);
        setLastPage(response.meta?.last_page ?? 1);
      } catch (error) {
        addToast('Erro ao carregar', 'Não foi possível carregar as solicitações.', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [addToast, status, categoria, prioridade, page]);

  function limparFiltros() {
    setStatus('');
    setCategoria('');
    setPrioridade('');
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitações</h1>
          <p className="text-xs text-slate-500">{total} solicitações encontradas</p>
        </div>
        <Link
          to="/solicitacoes/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          + Nova Solicitação
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <label className="space-y-1.5">
          <span className="block text-[11px] font-semibold text-slate-500">Status</span>
          <select value={status} onChange={(event) => { setStatus(event.target.value as StatusSolicitacao | ''); setPage(1); }} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="">Todos os status</option>
            <option value="RECEBIDA">Recebida</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="AGENDADA">Agendada</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="block text-[11px] font-semibold text-slate-500">Categoria</span>
          <select value={categoria} onChange={(event) => { setCategoria(event.target.value as CategoriaSolicitacao | ''); setPage(1); }} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="">Todas as categorias</option>
            <option value="CONSULTA">Consulta médica</option>
            <option value="EXAME">Exame laboratorial</option>
            <option value="VACINACAO">Vacinação</option>
            <option value="OUTRO">Outro</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="block text-[11px] font-semibold text-slate-500">Prioridade</span>
          <select value={prioridade} onChange={(event) => { setPrioridade(event.target.value as PrioridadeSolicitacao | ''); setPage(1); }} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="">Todas as prioridades</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="button" onClick={limparFiltros} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Limpar filtros
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Protocolo</th>
                <th className="p-4">Solicitante</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Prioridade</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {solicitacoes.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-500">Nenhuma solicitação encontrada com esses filtros.</td>
                </tr>
              )}
              {solicitacoes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-600 font-mono">
                    {item.protocolo}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {item.nome_solicitante}
                  </td>
                  <td className="p-4 text-slate-600">
                    {({ CONSULTA: 'Consulta Médica', EXAME: 'Exame Laboratorial', VACINACAO: 'Vacinação', OUTRO: 'Outro' }[item.categoria])}
                  </td>
                  <td className="p-4">
                    <PriorityBadge priority={item.prioridade || 'Normal'} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-4 text-slate-500 font-medium">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '01/11/2024'}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/solicitacoes/${item.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors inline-block border border-slate-200/60"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">Página {page} de {lastPage}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
            Anterior
          </button>
          <button type="button" onClick={() => setPage((current) => Math.min(lastPage, current + 1))} disabled={page >= lastPage || loading} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
