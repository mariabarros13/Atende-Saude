import { Clock } from 'lucide-react';

export interface AuditLogItem {
  id: string;
  date: string;
  time: string;
  author: string;
  action: string;
}

interface AuditTimelineProps {
  logs: AuditLogItem[];
}

export function AuditTimeline({ logs }: AuditTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-sm">Histórico de Atividades</h3>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {logs.length} registros
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="relative flex flex-col gap-1 text-xs">
            <div className="absolute -left-[1.85rem] top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{log.date} · {log.time}</span>
            </div>
            <p className="text-slate-700 font-normal">
              <strong className="font-semibold text-slate-900">{log.author}</strong> {log.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}