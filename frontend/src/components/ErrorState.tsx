export function ErrorState({ mensagem }: { mensagem: string }) {
  return <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>{mensagem}</div>;
}