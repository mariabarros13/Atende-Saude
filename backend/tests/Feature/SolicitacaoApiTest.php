<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SolicitacaoApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Sanctum::actingAs(User::factory()->create());
    }

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

        $response->assertStatus(409);
    }

    public function test_deve_filtrar_solicitacoes_por_status(): void
    {
        Solicitacao::factory()->create(['status' => 'EM_ANALISE']);
        Solicitacao::factory()->create(['status' => 'RECEBIDA']);

        $response = $this->getJson('/api/v1/solicitacoes?status=EM_ANALISE');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'EM_ANALISE');
    }

    public function test_nao_deve_permitir_reabrir_solicitacao_concluida(): void
    {
        $solicitacao = Solicitacao::factory()->create(['status' => 'CONCLUIDA']);

        $response = $this->patchJson("/api/v1/solicitacoes/{$solicitacao->id}/status", [
            'status' => 'EM_ANALISE',
        ]);

        $response->assertStatus(409)
            ->assertJsonPath('message', 'Transição de status não permitida.');
    }
}
