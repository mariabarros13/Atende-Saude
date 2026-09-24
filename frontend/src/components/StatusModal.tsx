import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import type { Status } from './StatusBadge';

interface StatusModalProps {
  statusAtual: Status;
  proximosStatus: Status[];
  onClose: () => void;
  onConfirm: (novoStatus: Status) => void;
}

export function StatusModal({ statusAtual, proximosStatus, onClose, onConfirm }: StatusModalProps) {
  const [selected, setSelected] = useState<Status>(proximosStatus[0] || statusAtual);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Atualizar Status</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Atual */}
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-2">Status atual</span>
          <StatusBadge status={statusAtual} />
        </div>

        {/* Comparativo: Atual -> Próximo */}
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

        {/* Dropdown de Seleção */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Selecione o próximo status</label>
          <select 
            value={selected} 
            onChange={(e) => setSelected(e.target.value as Status)}
            className="w-full bg-white border border-blue-500 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {proximosStatus.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Alertas dinâmicos baseados no próximo status */}
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

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(selected)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}