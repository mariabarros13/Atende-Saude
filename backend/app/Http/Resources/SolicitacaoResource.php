<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitacaoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'protocolo'                => $this->protocolo,
            'nome_solicitante'         => $this->nome_solicitante,
            'categoria'                => $this->categoria,
            'prioridade'               => $this->prioridade,
            'status'                   => $this->status,
            'descricao'                => $this->descricao,
            'justificativa_prioridade' => $this->justificativa_prioridade,
            'created_at'               => $this->created_at?->toISOString(),
            'updated_at'               => $this->updated_at?->toISOString(),
        ];
    }
}
