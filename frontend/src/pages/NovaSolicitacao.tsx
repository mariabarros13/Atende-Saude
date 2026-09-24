import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { solicitacoesService } from '../services/solicitacoes';
import type { CategoriaSolicitacao, PrioridadeSolicitacao } from '../types/solicitacao';

export function NovaSolicitacao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaSolicitacao>('CONSULTA');
  const [prioridade, setPrioridade] = useState<PrioridadeSolicitacao>('BAIXA');
  const [descricao, setDescricao] = useState('');
  const [justificativa, setJustificativa] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await solicitacoesService.criar({
        nome_solicitante: nome,
        categoria,
        prioridade,
        descricao,
        justificativa_prioridade: prioridade === 'URGENTE' ? justificativa : undefined,
      });
      navigate('/solicitacoes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar solicitação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/solicitacoes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nova Solicitação</h1>
        <p className="text-sm text-slate-500">Preencha os dados para registrar uma nova solicitação de atendimento</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Dados da Solicitação</h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Nome do Solicitante <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Nome completo do paciente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaSolicitacao)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            >
              <option value="CONSULTA">Consulta Médica</option>
              <option value="EXAME">Exame Laboratorial</option>
              <option value="VACINACAO">Vacinação</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="prioridade" className="block text-xs font-bold text-slate-700 mb-2">
              Prioridade <span className="text-rose-500">*</span>
            </label>
            <select
              id="prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as PrioridadeSolicitacao)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>
        </div>

        {prioridade === 'URGENTE' && (
          <div>
            <label htmlFor="justificativa-prioridade" className="block text-xs font-bold text-rose-600 mb-2">
              Justificativa da Prioridade <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="justificativa-prioridade"
              required
              rows={2}
              placeholder="Descreva o motivo da urgência do atendimento"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full bg-rose-50/30 border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-rose-300 text-slate-800"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Descrição <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Descreva detalhadamente a necessidade de atendimento..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          <span className="text-[10px] text-slate-400 block text-right mt-1">{descricao.length} caracteres</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/solicitacoes"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Solicitação'}
          </button>
        </div>
      </form>
    </div>
  );
}
