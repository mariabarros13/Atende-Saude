import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { AuditTimeline } from '../components/AuditTimeline';
import { useToast } from '../contexts/ToastContext';
import { solicitacoesService } from '../services/solicitacoes';
import { Skeleton } from '../components/Skeleton';
import type { Solicitacao, StatusSolicitacao } from '../types/solicitacao';

// Mapeamento oficial de transição de status
const STATUS_FLOW: Record<StatusSolicitacao, StatusSolicitacao[]> = {
  RECEBIDA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['AGENDADA', 'CANCELADA'],
  AGENDADA: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

// Componente do Modal interno para atualizar status
function StatusModal({ statusAtual, proximosStatus, onClose, onConfirm }: {
  statusAtual: string;
  proximosStatus: StatusSolicitacao[];
  onClose: () => void;
  onConfirm: (next: StatusSolicitacao) => void;
}) {
  const [selected, setSelected] = useState<StatusSolicitacao>(proximosStatus[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Atualizar Status</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">✕</button>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium block mb-2">Status atual</span>
          <StatusBadge status={statusAtual} />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center gap-4 border border-slate-100/80">
          <div className="text-center">
            <StatusBadge status={statusAtual} />
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Atual</span>
          </div>
          <span className="text-slate-400 text-sm">→</span>
          <div className="text-center">
            <StatusBadge status={selected} />
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Próximo</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Selecione o próximo status</label>
          <select 
            value={selected} 
            onChange={(e) => setSelected(e.target.value as StatusSolicitacao)}
            className="w-full bg-white border border-blue-500 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {proximosStatus.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {selected === 'CANCELADA' && (
          <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-700 font-medium">
            ⚠️ Esta ação finalizará a solicitação como <strong>Cancelada</strong>.
          </div>
        )}
        {selected === 'CONCLUIDA' && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-700 font-medium">
            ✓ A solicitação será marcada como <strong>Concluída</strong> com sucesso.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
            Cancelar
          </button>
          <button onClick={() => onConfirm(selected)} className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer">
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}

export function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Histórico de atividades / Timeline mantido na sidebar
  const [historico, setHistorico] = useState([
    {
      id: '1',
      date: '01/11/2024',
      time: '09:15',
      author: 'Sistema',
      action: 'criou a solicitação inicial.'
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        setLoading(true);
        const data = await solicitacoesService.obterPorId(id);
        setSolicitacao(data);
      } catch (err) {
        addToast('Erro', 'Não foi possível carregar os detalhes.', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, addToast]);

  async function handleConfirmStatus(nextStatus: StatusSolicitacao) {
    if (!solicitacao) return;

    try {
      const solicitacaoAtualizada = await solicitacoesService.atualizarStatus(solicitacao.id, nextStatus);
      setSolicitacao(solicitacaoAtualizada);

      const now = new Date();
      const newEntry = {
        id: Math.random().toString(),
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        author: 'Utilizador Logado',
        action: `alterou o status para ${nextStatus.toUpperCase().replace(/ /g, '_')}`
      };

      setHistorico([newEntry, ...historico]);
      setShowModal(false);
      addToast('Status Atualizado', `Solicitação alterada para "${nextStatus}" com sucesso.`, 'success');
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || err.message
        : 'Falha ao atualizar o status.';
      addToast('Erro ao atualizar status', mensagem, 'error');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!solicitacao) return <div className="p-8 text-center text-slate-500">Solicitação não encontrada.</div>;

  const etapas: StatusSolicitacao[] = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA'];
  const currentIdx = etapas.indexOf(solicitacao.status);
  const proximosStatus = STATUS_FLOW[solicitacao.status] || [];
  const podeAtualizar = proximosStatus.length > 0;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Modal de Status */}
      {showModal && (
        <StatusModal 
          statusAtual={solicitacao.status}
          proximosStatus={proximosStatus}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmStatus}
        />
      )}

      {/* Botão Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
      >
        ← Voltar para Solicitações
      </button>

      {/* Banner Superior Azul com Stepper */}
      <div className="rounded-2xl p-7 text-white shadow-sm bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="text-xs text-blue-200/80 uppercase tracking-wider font-semibold mb-1">Protocolo</div>
            <div className="text-2xl font-bold font-mono tracking-tight">{solicitacao.protocolo}</div>
          </div>
          <StatusBadge status={solicitacao.status} />
        </div>

        <div className="pt-4 relative max-w-3xl mx-auto">
          <div className="absolute left-[12.5%] right-[12.5%] top-[30px] h-0.5 bg-white/25" aria-hidden="true">
            <div className="h-full bg-white transition-all duration-300" style={{ width: `${Math.max(0, currentIdx) / (etapas.length - 1) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between relative">
          {etapas.map((step, i) => {
            // A etapa atual normalmente mostra seu número; quando o fluxo chega
            // ao estado final, ela também deve aparecer como concluída.
            const done = currentIdx > i || (i === etapas.length - 1 && currentIdx === i);
            const active = currentIdx === i;
            return (
              <div key={step} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  done || active ? 'bg-white text-blue-600 shadow-sm' : 'bg-white/20 text-white/70'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-[11px] font-medium ${active ? 'text-white font-semibold' : 'text-blue-100/70'}`}>
                  {({ RECEBIDA: 'Recebida', EM_ANALISE: 'Em Análise', AGENDADA: 'Agendada', CONCLUIDA: 'Concluída', CANCELADA: 'Cancelada' }[step])}
                </span>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Informações e Descrição */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-4">
              Informações da Solicitação
            </h2>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Solicitante</span>
                <p className="font-semibold text-slate-800 text-sm">{solicitacao.nome_solicitante}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categoria</span>
                <p className="font-semibold text-slate-800 text-sm">{({ CONSULTA: 'Consulta Médica', EXAME: 'Exame Laboratorial', VACINACAO: 'Vacinação', OUTRO: 'Outro' }[solicitacao.categoria])}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prioridade</span>
                <PriorityBadge priority={solicitacao.prioridade || 'Normal'} />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                <StatusBadge status={solicitacao.status} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-slate-800">Descrição</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{solicitacao.descricao}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Criado em</p>
                <p className="text-xs font-semibold text-slate-700">{formatDateTime(solicitacao.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Última atualização em</p>
                <p className="text-xs font-semibold text-slate-700">{formatDateTime(solicitacao.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Atualizar Status + Histórico de Atividades (AuditTimeline) */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Atualizar Status</h3>

            {podeAtualizar ? (
              <>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Atualize o status desta solicitação para o próximo passo no fluxo de atendimento.
                </p>
                <div className="space-y-2">
                  {proximosStatus.map((step) => (
                    <div key={step} className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                      <span className="text-blue-600 text-xs font-bold">→</span>
                      <StatusBadge status={step} />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer mt-2"
                >
                  Atualizar Status
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-2">
                <div className="text-2xl">{solicitacao.status === 'CONCLUIDA' ? '✅' : '🚫'}</div>
                <p className="text-xs text-slate-500">
                  {solicitacao.status === 'CONCLUIDA' 
                    ? 'Solicitação concluída com sucesso.' 
                    : 'Solicitação cancelada. Não é possível alterar o status.'}
                </p>
              </div>
            )}
          </div>

          {/* O Histórico de Atividades continua guardado aqui na lateral */}
          <AuditTimeline logs={historico} />
        </div>

      </div>
    </div>
  );
}
