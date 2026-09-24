<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSolicitacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome_solicitante' => ['required', 'string', 'max:255'],
            'categoria'        => ['required', Rule::in(['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'])],
            'prioridade'       => ['required', Rule::in(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'])],
            'descricao'        => ['nullable', 'string'],
            'justificativa_prioridade' => [
                'nullable',
                'string',
                Rule::requiredIf($this->input('prioridade') === 'URGENTE'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nome_solicitante.required' => 'O nome do solicitante é obrigatório.',
            'justificativa_prioridade.required' => 'A justificativa é obrigatória para solicitações urgentes.',
        ];
    }
}
