<?php

namespace Database\Factories;

use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use Illuminate\Database\Eloquent\Factories\Factory;

class SolicitacaoFactory extends Factory
{
    protected $model = Solicitacao::class;

    public function definition(): array
    {
        $service = new SolicitacaoService();
        $prioridade = fake()->randomElement(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);

        return [
            'protocolo'                => $service->gerarProtocolo(),
            'nome_solicitante'         => fake()->name(),
            'categoria'                => fake()->randomElement(['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']),
            'prioridade'               => $prioridade,
            'status'                   => 'RECEBIDA',
            'descricao'                => fake()->sentence(),
            'justificativa_prioridade' => $prioridade === 'URGENTE' ? fake()->sentence() : null,
        ];
    }
}