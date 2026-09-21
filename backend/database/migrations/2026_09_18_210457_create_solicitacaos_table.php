<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('solicitacoes', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->string('protocolo')->unique();
        $table->string('nome_solicitante');
        $table->enum('categoria', ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']);
        $table->enum('prioridade', ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);
        $table->enum('status', ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'])->default('RECEBIDA');
        $table->text('descricao');
        $table->text('justificativa_prioridade')->nullable();
        $table->timestamps();

        // Índices otimizados para os filtros da API REST
        $table->index(['status', 'categoria', 'prioridade']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacaos');
    }
};
