<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Rota pública para Autenticação
    Route::post('/login', [AuthController::class, 'login']);

    // Rotas protegidas (Exigem Token Bearer no Header)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::patch('/solicitacoes/{id}/status', [SolicitacaoController::class, 'updateStatus']);
        Route::apiResource('solicitacoes', SolicitacaoController::class);
    });
    
});
