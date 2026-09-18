# 🏥 AtendeSaúde — Sistema de Solicitações de Atendimento para Saúde Pública

> **Desafio Técnico Full Stack — Seleção V-Lab (CIn / UFPE)**
> Aplicação desenvolvida para registro, triagem e acompanhamento de solicitações de atendimento em unidades de saúde pública.

---

## 📌 1. Visão Geral e Objetivo

O **AtendeSaúde** é uma solução Full Stack moderna e desacoplada projetada para otimizar o encaminhamento e a gestão de solicitações de atendimento (consultas, exames, vacinações e outros serviços) em unidades públicas de saúde.

O objetivo do projeto é fornecer uma interface clara e intuitiva para os cidadãos e operadores da saúde, acompanhada por uma API REST robusta e confiável responsável por aplicar estritamente as regras de negócio, a geração automática de protocolos únicos e o controle de transições de status da triagem.

---

## ⚙️ 2. Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | **React + TypeScript** | SPA com tipagem forte, componentes coesos e navegação fluida |
| **Backend** | **PHP + Laravel** | API REST estruturada, desacoplada e centralizadora das regras do domínio |
| **Banco de Dados** | **PostgreSQL** | Persistência relacional com versionamento via Migrations do Laravel |
| **Infraestrutura** | **Docker & Docker Compose** | Execução integrada e ambiente totalmente reproduzível |
| **Documentação** | **OpenAPI (Swagger)** | Especificação completa dos contratos da API REST |

---

## 📋 3. Modelo de Dados e Regras de Negócio

### 3.1 Entidade Principal: `Solicitacao`
* **`id`**: Identificador único UUID/Auto-incremento.
* **`protocolo`**: Código único gerado automaticamente no momento da criação (ex: `ATD-2026-XXXXX`).
* **`nome_solicitante`**: Nome do cidadão (dados estritamente fictícios).
* **`categoria`**: Enum (`CONSULTA`, `EXAME`, `VACINACAO`, `OUTRO`).
* **`prioridade`**: Enum (`BAIXA`, `MEDIA`, `ALTA`, `URGENTE`).
* **`status`**: Enum (`RECEBIDA`, `EM_ANALISE`, `AGENDADA`, `CONCLUIDA`, `CANCELADA`).
* **`descricao`**: Resumo/detalhes da solicitação.
* **`justificativa_prioridade`**: Texto explicativo (**obrigatório** se a prioridade for `URGENTE`).
* **`created_at` / `updated_at`**: Registros temporais gerenciados automaticamente.

### 3.2 Regras de Negócio e Máquina de Estados
1. **Status Inicial**: Toda solicitação é obrigatoriamente criada com o status `RECEBIDA`.
2. **Geração de Protocolo**: Gerado de forma única e automática no cadastro.
3. **Validação de Urgência**: Se a prioridade selecionada for `URGENTE`, o campo `justificativa_prioridade` é obrigatório.
4. **Fluxo de Transição de Status**:
   * `RECEBIDA` ➔ Permite transição para `EM_ANALISE` ou `CANCELADA`.
   * `EM_ANALISE` ➔ Permite transição para `AGENDADA` ou `CANCELADA`.
   * `AGENDADA` ➔ Permite transição para `CONCLUIDA` ou `CANCELADA`.
   * `CONCLUIDA` / `CANCELADA` ➔ **Status Finais** (não permitem qualquer alteração posterior).

---

## 🏗️ 4. Descrição das Camadas da Aplicação

### 4.1 Backend (Laravel API REST)
* **Validações Seguras**: Uso de *Form Requests* dedicados para sanitarização de dados e retornos HTTP apropriados (`400`, `422`, `404`, etc.).
* **Camada de Serviço / Máquina de Estados**: As regras de transição de status ficam isoladas em uma camada de serviço dedicada (`SolicitacaoService` / `StatusMachine`), mantendo os *Controllers* magros e responsáveis apenas pelo ciclo de requisição/resposta.
* **OpenAPI Spec**: Especificação mantida na raiz do repositório (`/docs/openapi.yaml`).

### 4.2 Frontend (React com TypeScript)
* **Organização por Domínio**: Componentes modulares (UI, Formulários, Cards, Modais).
* **Gestão de Estados Assíncronos**: Trata adequadamente cenários de `Loading`, `Success`, `Error` e `Empty State`.
* **Funcionalidades e Telas**:
  * Dashboard introdutório com métricas agrupadas por status/prioridade.
  * Tabela/Listagem paginada com filtros combinados por Categoria, Prioridade e Status.
  * Formulário de criação com validação dinâmica client-side.
  * Visualização de detalhes com botões inteligentes que exibem apenas as opções válidas de alteração de status.

### 4.3 Banco de Dados (PostgreSQL)
* **Integridade**: Restrições do tipo *unique* no protocolo e campos obrigatórios (`NOT NULL`).
* **Performance**: Índices otimizados para campos frequentemente consultados nos filtros (`status`, `categoria`, `prioridade`).
* **Versionamento**: Gerenciado 100% por Migrations do Laravel, incluindo Seeds/Factories para carga de dados fictícios de testes.

---

## 🧪 5. Testes, Qualidade e Confiabilidade

O projeto adota uma abordagem focada em cenários relevantes e determinísticos:

* **Backend (PHPUnit / Pest)**:
  * Teste unitário/de integração da máquina de estados (garantindo bloqueio de transições inválidas).
  * Teste de validação da obrigatoriedade do campo `justificativa_prioridade` para urgências.
  * Teste de criação e geração única de protocolo.
* **Frontend (Vitest + React Testing Library)**:
  * Teste de integração do formulário de criação.
  * Testes de renderização de estados de carregamento, erro e listagem vazia.

---

## 7. Declaração do Uso de Inteligência Artificial
Em conformidade com as diretrizes do edital, declaramos o uso transparente de ferramentas de IA durante o desenvolvimento:

Planejamento e Arquitetura: Apoio na estruturação do plano de projeto, divisão por fases e escrita da documentação/README.

Geração de Boilerplates: Auxílio na criação de arquivos de configuração iniciais (Docker, TypeScript e Schemas de Migration).

Criação de Dados Fictícios: Suporte na elaboração de dados simulados (seeders/factories) sem incluir qualquer dado pessoal ou clínico real.