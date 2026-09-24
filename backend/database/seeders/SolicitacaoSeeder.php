<?php

namespace Database\Seeders;

use App\Models\Solicitacao;
use Illuminate\Database\Seeder;

class SolicitacaoSeeder extends Seeder
{
    public function run(): void
    {
        $status = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'];
        $descricoes = [
            'Paciente com quadro grave de pneumonia bilateral necessitando internação hospitalar.',
            'Paciente relata febre persistente, tosse e falta de ar há quatro dias; necessita avaliação médica.',
            'Solicitação de exame de sangue para investigação de anemia e acompanhamento clínico.',
            'Paciente precisa de avaliação de rotina para acompanhamento da pressão arterial e ajuste da medicação.',
            'Paciente apresenta dor intensa e limitação de movimento; solicitada consulta com especialista.',
        ];

        for ($i = 0; $i < 25; $i++) {
            Solicitacao::factory()->create([
                'status' => $status[$i % count($status)],
                'descricao' => $descricoes[$i % count($descricoes)],
            ]);
        }
    }
}
