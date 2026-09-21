import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, CheckCircle2 } from 'lucide-react';
import { solicitacoesService } from '../services/solicitacoes';
import type { Solicitacao, StatusSolicitacao } from '../types/solicitacao';
import { StatusBadge } from '../components/StatusBadge';
import { Loading } from '../components/Loading';

const FLUXO_STATUS: StatusSolicitacao[] = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA'];

export function DetalhesSolicitacao() {
  const { id } = useParams<{ id: string }>();
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      solicitacoesService.obterPorId(id).then((data) => {
        setSolicitacao(data);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleAvancarStatus(novoStatus: StatusSolicitacao) {
    if (!id || !solicitacao) return;
    setUpdating(true);
    try {
      const atualizada = await solicitacoesService.atualizarStatus(id, novoStatus);
      setSolicitacao(atualizada);
    } catch (err) {
      alert('Erro ao atualizar status.');
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !solicitacao) return <Loading />;

  const statusIndex = FLUXO_STATUS.indexOf(solicitacao.status);

  return (
    <div className="space-y-6">
      <Link to="/solicitacoes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Solicitações
      </Link>

      {/* BANNER AZUL COM STEPPER HORIZONTAL */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-600/20">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">PROTOCOLO</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">{solicitacao.protocolo}</h1>
          </div>
          <StatusBadge status={solicitacao.status} />
        </div>

        {/* Stepper Horizontal */}
        <div className="relative flex items-center justify-between max-w-2xl mx-auto pt-4">
          <div className="absolute left-0 top-1/2 h-0.5 bg-blue-400/50 w-full -z-0" />
          {FLUXO_STATUS.map((step, idx) => {
            const isDone = statusIndex >= idx;
            const isCurrent = statusIndex === idx;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone ? 'bg-white text-blue-600 shadow-md' : 'bg-blue-500/80 text-blue-200 border border-blue-400/40'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-blue-200'}`}>
                  {step.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORPO DE INFORMAÇÕES + PAINEL LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Dados e Descrição */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
              Informações da Solicitação
            </h2>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitante</span>
                <p className="font-semibold text-slate-800 text-base mt-1">{solicitacao.nome_solicitante}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</span>
                <p className="font-semibold text-slate-800 text-base mt-1">{solicitacao.categoria}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prioridade</span>
                <p className="font-semibold text-slate-800 mt-1">{solicitacao.prioridade}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Atual</span>
                <div className="mt-1"><StatusBadge status={solicitacao.status} /></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Descrição</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {solicitacao.descricao}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Criado em: <strong className="text-slate-700">{solicitacao.created_at}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Última atualização: <strong className="text-slate-700">{solicitacao.updated_at}</strong></span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Ações de Status + Fluxo Lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Atualizar Status</h3>
            
            {solicitacao.status === 'CONCLUIDA' ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span className="text-xs font-bold">Solicitação concluída com sucesso.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {FLUXO_STATUS.map((step, idx) => {
                  if (idx <= statusIndex) return null;
                  return (
                    <button
                      key={step}
                      disabled={updating}
                      onClick={() => handleAvancarStatus(step)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/10 transition-all disabled:opacity-50"
                    >
                      Avançar para {step.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">FLUXO DE STATUS</h3>
            <div className="space-y-3">
              {FLUXO_STATUS.map((step, idx) => {
                const isPassed = statusIndex >= idx;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPassed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}