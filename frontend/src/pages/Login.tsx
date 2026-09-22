import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased">
      
      {/* LADO ESQUERDO: Formulário de Login */}
      <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          {/* Logo Topo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">Atende Saúde</h1>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">GESTÃO DE ATENDIMENTO</span>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
            <p className="text-sm text-slate-500">Acesse sua conta para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Senha <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/recuperar-senha" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Acessando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Não tem uma conta?{' '}
            <Link to="/solicitar-acesso" className="font-semibold text-blue-600 hover:text-blue-700">
              Solicitar acesso
            </Link>
          </div>
        </div>

        {/* Rodapé institucional */}
        <div className="pt-8 text-[11px] text-slate-400 border-t border-slate-100 mt-8">
          <p>Sistema de Gestão de Saúde Pública · Ministério da Saúde</p>
          <p>© 2026 · Todos os direitos reservados</p>
        </div>
      </div>

      {/* LADO DIREITO: Painel Azul de Apresentação */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-blue-600 p-12 text-white relative overflow-hidden">
        {/* Círculos decorativos de fundo */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-md text-center space-y-8 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            <Activity className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Gerencie solicitações com eficiência</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              O Atende Saúde centraliza e organiza todas as solicitações de atendimento da saúde pública, do protocolo à conclusão.
            </p>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-xl font-extrabold">4.2k</div>
              <div className="text-[10px] text-blue-200 mt-1">Atendimentos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-xl font-extrabold">98%</div>
              <div className="text-[10px] text-blue-200 mt-1">Satisfação</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-xl font-extrabold">24h</div>
              <div className="text-[10px] text-blue-200 mt-1">Resposta</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}