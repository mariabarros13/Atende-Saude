import { Link } from 'react-router-dom';

export function NovaSolicitacao() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/">← Voltar para a listagem</Link>
      <h1 style={{ marginTop: '1rem' }}>Nova Solicitação</h1>
      <p>Formulário de criação em construção...</p>
    </div>
  );
}