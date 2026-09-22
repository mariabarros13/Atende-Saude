<?php

namespace Database\Seeders;

use App\Models\User; // <-- ADICIONAR ESTA LINHA
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // <-- ADICIONAR ESTA LINHA

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@atendesaude.gov.br'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('12345678'),
            ]
        );

        $this->call(SolicitacaoSeeder::class);
    }
}