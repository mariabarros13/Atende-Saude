import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

export function SolicitarAcesso() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  // Campos da Etapa 1
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  // Campos da Etapa 2
  const [cargo, setCargo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      alert('As senhas digitadas não coincidem.');
      return;
    }
    alert('Solicitação de conta criada com sucesso! Aguarde a liberação do seu acesso.');
    navigate('/login');
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-white font-sans antialiased">
      
      {/* LADO ESQUERDO: Painel Azul com Stepper */}
      <div className="bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* Logo Topo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">Atende Saúde</h1>
              <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest">GESTÃO DE ATENDIMENTO</span>
            </div>
          </div>

          <div className="space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Junte-se à equipe de saúde pública</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Crie sua conta para acessar o sistema de gestão de solicitações de atendimento.
            </p>
          </div>

          {/* Stepper Vertical Dinâmico */}
          <div className="space-y-6">
            {/* Passo 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Dados pessoais</h3>
                <p className="text-xs text-blue-200">Nome, e-mail e CPF</p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className={`flex items-start gap-4 transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                step === 2 ? 'bg-white text-blue-600 shadow-md' : 'bg-blue-500/50 border border-blue-400/50 text-blue-200'
              }`}>
                2
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Acesso e função</h3>
                <p className="text-xs text-blue-200">Cargo, unidade e senha</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-200 pt-8">
          Ministério da Saúde · Sistema Público
        </div>
      </div>

      {/* LADO DIREITO: Formulário de 2 Etapas */}
      <div className="lg:col-span-2 flex flex-col justify-center p-8 md:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {step === 1 ? (
          /* ETAPA 1 DE 2 */
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ETAPA 1 DE 2</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Dados pessoais</h2>
              <p className="text-sm text-slate-500">Preencha suas informações básicas</p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Nome completo <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">E-mail institucional <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">CPF <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              Já possui conta?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Entrar
              </Link>
            </div>
          </div>
        ) : (
          /* ETAPA 2 DE 2 */
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ETAPA 2 DE 2</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Acesso e função</h2>
              <p className="text-sm text-slate-500">Configure seu cargo e credenciais de acesso</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Cargo <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
                  >
                    <option value="">Selecione</option>
                    <option value="MEDICO">Médico(a)</option>
                    <option value="ENFERMEIRO">Enfermeiro(a)</option>
                    <option value="ADMINISTRATIVO">Atendente / Administrativo</option>
                    <option value="GESTOR">Gestor de Saúde</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Unidade de Saúde <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: UBS Vila Nova"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Senha <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Confirmar senha <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmarSenha ? 'text' : 'password'}
                    required
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm py-3 px-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Criar minha conta
                </button>
              </div>
            </form>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              Já possui conta?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Entrar
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}