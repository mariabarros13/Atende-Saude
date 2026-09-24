import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Inbox, Search, Calendar, CheckCircle2 } from 'lucide-react';
import { solicitacoesService } from '../services/solicitacoes';
import type { Solicitacao } from '../types/solicitacao';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Loading } from '../components/Loading';

export function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    solicitacoesService.listar().then((res) => {
      setSolicitacoes(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  // Mapeamento por Status
  const recebidas = solicitacoes.filter((s) => s.status === 'RECEBIDA').length;
  const emAnalise = solicitacoes.filter((s) => s.status === 'EM_ANALISE').length;
  const agendadas = solicitacoes.filter((s) => s.status === 'AGENDADA').length;
  const concluidas = solicitacoes.filter((s) => s.status === 'CONCLUIDA').length;
  const canceladas = solicitacoes.filter((s) => s.status === 'CANCELADA').length;

  // Mapeamento por Prioridade
  const alta = solicitacoes.filter((s) => s.prioridade === 'ALTA').length;
  const normal = solicitacoes.filter((s) => s.prioridade === 'BAIXA' || s.prioridade === 'MEDIA').length;
  const urgente = solicitacoes.filter((s) => s.prioridade === 'URGENTE').length;

  const total = solicitacoes.length || 1;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral das solicitações de atendimento</p>
        </div>

        <Link
          to="/nova"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Solicitação
        </Link>
      </div>

      {/* 4 Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard icon={<Inbox className="w-5 h-5 text-blue-600" />} title="Recebidas" count={recebidas} color="bg-blue-600" />
        <MetricCard icon={<Search className="w-5 h-5 text-indigo-600" />} title="Em Análise" count={emAnalise} color="bg-indigo-600" />
        <MetricCard icon={<Calendar className="w-5 h-5 text-sky-600" />} title="Agendadas" count={agendadas} color="bg-sky-500" />
        <MetricCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} title="Concluídas" count={concluidas} color="bg-emerald-500" />
      </div>

      {/* SEÇÃO DOS GRÁFICOS (Lado a Lado) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE DONUT: Distribuição por Prioridade */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Distribuição por Prioridade</h2>
            <p className="text-xs text-slate-400 mb-4">Total de {solicitacoes.length} solicitações</p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <DonutChart alta={alta} normal={normal} urgente={urgente} total={total} />
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600">Alta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Urgente</span>
            </div>
          </div>
        </div>

        {/* BARRAS DE PROGRESSO: Resumo por Status */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Resumo por Status</h2>
          <p className="text-xs text-slate-400 mb-6">Detalhamento proporcional por etapa</p>

          <div className="space-y-4">
            <ProgressBar label="Recebida" count={recebidas} total={total} color="bg-blue-600" />
            <ProgressBar label="Em Análise" count={emAnalise} total={total} color="bg-indigo-600" />
            <ProgressBar label="Agendada" count={agendadas} total={total} color="bg-sky-500" />
            <ProgressBar label="Concluída" count={concluidas} total={total} color="bg-emerald-500" />
            <ProgressBar label="Cancelada" count={canceladas} total={total} color="bg-rose-500" />
          </div>
        </div>

      </div>

      {/* Tabela Resumida de Últimas Solicitações */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Últimas Solicitações</h2>
          <Link to="/solicitacoes" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3 px-6">Protocolo</th>
              <th className="py-3 px-6">Solicitante</th>
              <th className="py-3 px-6">Categoria</th>
              <th className="py-3 px-6">Prioridade</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {solicitacoes.slice(0, 5).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-blue-600">{item.protocolo}</td>
                <td className="py-4 px-6 font-medium text-slate-800">{item.nome_solicitante}</td>
                <td className="py-4 px-6 text-slate-500">{item.categoria}</td>
                <td className="py-4 px-6">
                  <PriorityBadge priority={item.prioridade} />
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subcomponente de Gráfico de Rosca em SVG
function DonutChart({ alta, normal, urgente, total }: { alta: number; normal: number; urgente: number; total: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const pctAlta = alta / total;
  const pctNormal = normal / total;
  const pctUrgente = urgente / total;

  const strokeAlta = pctAlta * circumference;
  const strokeNormal = pctNormal * circumference;
  const strokeUrgente = pctUrgente * circumference;

  const offsetNormal = strokeAlta;
  const offsetUrgente = strokeAlta + strokeNormal;

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Arco Alta (Vermelho/Rosa) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#F43F5E"
          strokeWidth="16"
          strokeDasharray={`${strokeAlta} ${circumference}`}
          strokeDashoffset="0"
        />
        {/* Arco Normal (Cinza) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#94A3B8"
          strokeWidth="16"
          strokeDasharray={`${strokeNormal} ${circumference}`}
          strokeDashoffset={`-${offsetNormal}`}
        />
        {/* Arco Urgente (Amarelo/Laranja) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#F59E0B"
          strokeWidth="16"
          strokeDasharray={`${strokeUrgente} ${circumference}`}
          strokeDashoffset={`-${offsetUrgente}`}
        />
      </svg>
    </div>
  );
}

function MetricCard({ icon, title, count, color }: { icon: React.ReactNode; title: string; count: number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{count}</div>
        <div className="text-xs font-medium text-slate-500 mb-4">{title}</div>
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${Math.min(count * 20, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = Math.round((count / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-400">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
