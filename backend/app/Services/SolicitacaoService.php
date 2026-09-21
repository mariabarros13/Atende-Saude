<?php

namespace App\Services;

use App\Models\Solicitacao;
use Exception;
use Illuminate\Support\Str;

class SolicitacaoService
{
    /**
     * Gera um protocolo único no formato ATD-YYYY-XXXXX
     */
    public function gerarProtocolo(): string
    {
        $ano = date('Y');
        do {
            $aleatorio = strtoupper(Str::random(5));
            $protocolo = "ATD-{$ano}-{$aleatorio}";
        } while (Solicitacao::where('protocolo', $protocolo)->exists());

        return $protocolo;
    }

    /**
     * Valida e aplica a transição de status conforme a máquina de estados do edital
     */
    public function atualizarStatus(Solicitacao $solicitacao, string $novoStatus): Solicitacao
    {
        $statusAtual = $solicitacao->status;

        // Regras de transição permitidas
        $transicoesPermitidas = [
            'RECEBIDA'   => ['EM_ANALISE', 'CANCELADA'],
            'EM_ANALISE' => ['AGENDADA', 'CANCELADA'],
            'AGENDADA'   => ['CONCLUIDA', 'CANCELADA'],
            'CONCLUIDA'  => [], // Status final
            'CANCELADA'  => [], // Status final
        ];

        // Verifica se o status atual permite transições
        if (in_array($statusAtual, ['CONCLUIDA', 'CANCELADA'])) {
            throw new Exception("Não é possível alterar o status de uma solicitação que já está {$statusAtual}.", 422);
        }

        // Verifica se a transição solicitada é válida
        if (!in_array($novoStatus, $transicoesPermitidas[$statusAtual] ?? [])) {
            throw new Exception("Transição de status inválida de {$statusAtual} para {$novoStatus}.", 422);
        }

        $solicitacao->status = $novoStatus;
        $solicitacao->save();

        return $solicitacao;
    }
}