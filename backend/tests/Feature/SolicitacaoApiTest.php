<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolicitacaoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_deve_criar_uma_solicitacao_com_sucesso()
    {
        $dados = [
            'nome_solicitante' => 'Maria Silva',
            'categoria'        => 'CONSULTA',
            'prioridade'       => 'BAIXA',
            'descricao'        => 'Consulta médica de rotina.',
        ];

        $response = $this->postJson('/api/v1/solicitacoes', $dados);

        $response->assertStatus(201)
                 ->assertJsonPath('data.status', 'RECEBIDA')
                 ->assertJsonStructure(['data' => ['id', 'protocolo', 'created_at']]);
    }

    public function test_deve_exigir_justificativa_se_prioridade_for_urgente()
    {
        $dados = [
            'nome_solicitante' => 'João Souza',
            'categoria'        => 'EXAME',
            'prioridade'       => 'URGENTE',
            'descricao'        => 'Exame urgente.',
        ];

        $response = $this->postJson('/api/v1/solicitacoes', $dados);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['justificativa_prioridade']);
    }

    public function test_deve_impedir_transicao_de_status_invalida()
    {
        $solicitacao = Solicitacao::factory()->create(['status' => 'RECEBIDA']);

        $response = $this->patchJson("/api/v1/solicitacoes/{$solicitacao->id}/status", [
            'status' => 'CONCLUIDA',
        ]);

        $response->assertStatus(422);
    }
}