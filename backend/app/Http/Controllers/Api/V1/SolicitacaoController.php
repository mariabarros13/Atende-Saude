<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\SolicitacaoResource;
use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use Illuminate\Http\Request;

class SolicitacaoController extends Controller
{
    protected SolicitacaoService $solicitacaoService;

    public function __construct(SolicitacaoService $solicitacaoService)
    {
        $this->solicitacaoService = $solicitacaoService;
    }

    // Listagem paginada com filtros
    public function index(Request $request)
    {
        $query = Solicitacao::query()
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('categoria'), fn ($query) => $query->where('categoria', $request->input('categoria')))
            ->when($request->filled('prioridade'), fn ($query) => $query->where('prioridade', $request->input('prioridade')));

        $solicitacoes = $query->orderBy('created_at', 'desc')->paginate(10);

        return SolicitacaoResource::collection($solicitacoes);
    }

    // Criar solicitação
    public function store(StoreSolicitacaoRequest $request)
    {
        $dados = $request->validated();
        $dados['protocolo'] = $this->solicitacaoService->gerarProtocolo();
        $dados['status'] = 'RECEBIDA';

        $solicitacao = Solicitacao::create($dados);

        return new SolicitacaoResource($solicitacao);
    }

    // Detalhes de uma solicitação
    public function show(string $id)
    {
        $solicitacao = Solicitacao::findOrFail($id);
        return new SolicitacaoResource($solicitacao);
    }

    // Atualizar status respeitando as regras de transição
    public function updateStatus(UpdateStatusRequest $request, string $id)
    {
        $solicitacao = Solicitacao::findOrFail($id);

        $solicitacaoAtualizada = $this->solicitacaoService->atualizarStatus(
            $solicitacao,
            $request->validated()['status']
        );

        return new SolicitacaoResource($solicitacaoAtualizada);
    }
}
