export function EmptyState({ mensagem = 'Nenhuma solicitação encontrada.' }: { mensagem?: string }) {
  return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>{mensagem}</div>;
}