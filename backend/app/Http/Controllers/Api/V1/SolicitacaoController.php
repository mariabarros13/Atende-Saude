<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\SolicitacaoResource;
use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use Exception;
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
        $query = Solicitacao::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('categoria')) {
            $query->where('categoria', $request->categoria);
        }
        if ($request->has('prioridade')) {
            $query->where('prioridade', $request->prioridade);
        }

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

        try {
            $solicitacaoAtualizada = $this->solicitacaoService->atualizarStatus(
                $solicitacao,
                $request->validated()['status']
            );

            return new SolicitacaoResource($solicitacaoAtualizada);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
