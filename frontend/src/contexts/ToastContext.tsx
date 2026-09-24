import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'loading';

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextData {
  addToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  const addToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, title, message, type };

    setMessages((state) => [...state, toast]);

    if (type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all ${
              item.type === 'success'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : item.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {item.type === 'loading' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold ${
                item.type === 'success' ? 'text-white' : item.type === 'error' ? 'text-rose-900' : 'text-slate-900'
              }`}>
                {item.title}
              </h4>
              {item.message && (
                <p className={`text-[11px] mt-0.5 leading-relaxed ${
                  item.type === 'success' ? 'text-emerald-100' : item.type === 'error' ? 'text-rose-600' : 'text-slate-500'
                }`}>
                  {item.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className={`p-1 rounded-lg transition-colors ${
                item.type === 'success' ? 'hover:bg-emerald-600 text-emerald-100' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}