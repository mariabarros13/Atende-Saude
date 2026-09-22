import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans antialiased">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="font-bold text-slate-900 text-lg">Atende Saúde</h1>
          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">GESTÃO DE ATENDIMENTO</span>
        </div>

        {/* Stepper Horizontal */}
        <div className="flex items-center justify-center gap-8 relative max-w-xs mx-auto">
          <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200 -z-0" />
          
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-blue-600">
              1
            </div>
            <span className="text-[11px] font-bold text-blue-600">E-mail</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-white text-slate-400 font-bold text-xs flex items-center justify-center border-2 border-slate-200">
              2
            </div>
            <span className="text-[11px] font-medium text-slate-400">Código</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-white text-slate-400 font-bold text-xs flex items-center justify-center border-2 border-slate-200">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-400">Nova senha</span>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Esqueceu sua senha?</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Informe seu e-mail cadastrado e enviaremos um código de verificação para redefinir sua senha.
            </p>
          </div>

          {sent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p>Código enviado com sucesso para <strong>{email}</strong>!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">E-mail institucional <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.gov.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Enviar código de verificação
              </button>
            </form>
          )}

          <div className="pt-2">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}