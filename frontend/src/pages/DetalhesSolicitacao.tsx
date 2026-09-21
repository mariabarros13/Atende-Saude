import { Link, useParams } from 'react-router-dom';

export function DetalhesSolicitacao() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/">← Voltar para a listagem</Link>
      <h1 style={{ marginTop: '1rem' }}>Detalhes da Solicitação</h1>
      <p>ID da solicitação: {id}</p>
    </div>
  );
}