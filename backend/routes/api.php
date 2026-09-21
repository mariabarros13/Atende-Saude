<?php

use App\Http\Controllers\Api\V1\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/solicitacoes', [SolicitacaoController::class, 'index']);
    Route::post('/solicitacoes', [SolicitacaoController::class, 'store']);
    Route::get('/solicitacoes/{id}', [SolicitacaoController::class, 'show']);
    Route::patch('/solicitacoes/{id}/status', [SolicitacaoController::class, 'updateStatus']);
});