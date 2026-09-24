# 🏥 Atende Saúde — Sistema de Solicitações de Atendimento para Saúde Pública

> **Desafio Técnico Full Stack — Seleção V-Lab (CIn/UFPE)**

Aplicação desenvolvida para registro, triagem e acompanhamento de solicitações de atendimento em unidades de saúde pública.

---

## Tecnologias

![Laravel](https://img.shields.io/badge/Laravel-12-red?logo=laravel)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-green)

---

## Visão Geral

O **Atende Saúde** é uma aplicação Full Stack desenvolvida para organizar o ciclo de vida de solicitações de atendimento em unidades de saúde pública.

O projeto combina uma API versionada em Laravel com uma interface React responsiva, mantendo as regras de negócio centralizadas no backend e oferecendo ao usuário uma experiência clara para acompanhar cada solicitação.

O foco do desafio foi construir uma solução com:

- organização da arquitetura;
- regras de negócio bem definidas;
- documentação completa;
- experiência do usuário consistente;
- facilidade de execução via Docker.

---

## Funcionalidades

- Login com Laravel Sanctum.
- Rotas protegidas.
- Dashboard com indicadores.
- Criação de solicitações.
- Protocolo único automático.
- Listagem paginada.
- Filtros por status, categoria e prioridade.
- Tela de detalhes completa.
- Timeline de auditoria.
- Atualização de status.
- Máquina de estados protegida.
- Justificativa obrigatória para prioridade urgente.
- Skeleton Loading.
- Toasts de feedback.
- Interface responsiva.

---

# Fluxo da Solicitação

A evolução dos atendimentos segue uma máquina de estados centralizada no backend.

```text
RECEBIDA
    │
    ▼
EM_ANALISE
    │
    ▼
AGENDADA
    │
    ▼
CONCLUIDA

ou

CANCELADA
```

### Regras importantes

- `RECEBIDA → EM_ANALISE`
- `EM_ANALISE → AGENDADA`
- `AGENDADA → CONCLUIDA`
- `CANCELADA` pode ocorrer apenas quando permitido pelo fluxo.

A interface remove o botão de alteração quando uma solicitação chega em **CONCLUIDA**, evitando operações inválidas.

Mesmo assim, a proteção definitiva permanece no `SolicitacaoService`, impedindo transições inválidas mesmo que a API seja chamada diretamente.

---

# Stack Tecnológica

| Camada | Tecnologias |
|---------|------------|
| Backend | Laravel 12, PHP 8.3 |
| Banco | PostgreSQL |
| Autenticação | Laravel Sanctum |
| Frontend | React + TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS v4 |
| Comunicação | Axios |
| Navegação | React Router |
| Containers | Docker Compose |
| Testes | PHPUnit, Vitest, React Testing Library |
| Documentação | OpenAPI 3.1 |

---

# Arquitetura

O projeto foi organizado por responsabilidade.

## Estrutura do repositório

```text
backend/
frontend/
docs/
docker-compose.yml
```

## Backend

```text
Controllers
      │
      ▼
SolicitacaoService
      │
      ▼
Form Requests
      │
      ▼
API Resources
      │
      ▼
PostgreSQL
```

### Organização

- Controllers enxutos.
- Service Pattern (`SolicitacaoService`).
- Form Requests para validações.
- API Resources para o contrato público.
- UUID v4 como chave primária.
- Migrations, Seeders e Factories.

## Frontend

```text
src/
├── api/
├── services/
├── types/
├── components/
├── pages/
├── router/
└── tests/
```

### Organização

- `AuthContext` controla autenticação.
- `PrivateRoutes` protege páginas privadas.
- Axios centraliza chamadas e interceptores.
- Components reutilizáveis para StatusBadge, Stepper, Skeleton e Toasts.

---

# Executando com Docker

## Pré-requisitos

- Docker Desktop
- Docker Compose
- Git

## Subindo o ambiente do zero

Na raiz do projeto:

```bash
docker compose up --build -d
```

O backend cria `backend/.env` e gera `APP_KEY` somente quando esses itens ainda não existem. Ele também aplica as migrations antes de iniciar a API. O volume do PostgreSQL é preservado entre reinicializações.

Confira se os três serviços estão ativos:

```bash
docker compose ps
```

O frontend fica disponível em `http://localhost:3000`. Para verificar a API e o banco, execute:

Para validar a API e o banco:

```bash
curl.exe -i http://localhost:8000/api/v1/me
docker compose exec backend php artisan migrate:status
```

Resultado esperado:

GET /api/v1/me sem autenticação retorna 401 Unauthorized com {"message":"Unauthenticated."}.

php artisan migrate:status deve listar todas as migrations como Ran.

Para testar o fluxo autenticado pela primeira vez, crie o usuário e as solicitações de demonstração:

```powershell
docker compose exec backend php artisan db:seed --force
```

Entre no frontend em `http://localhost:3000/login` com `admin@atendesaude.gov.br` e senha `12345678`. O seeder cria dados de demonstração; execute-o uma única vez para evitar duplicar as solicitações.

Para parar os containers sem apagar os dados:

```bash
docker compose down
```

Para apagar também os dados do banco e começar do zero (ação destrutiva):

```bash
docker compose down --volumes
```

### Arquivos de ambiente

Opcionalmente, antes da primeira execução:

- copie `backend/.env.example` para `backend/.env` e ajuste as configurações locais;
- copie `frontend/.env.example` para `frontend/.env`, caso exista.

Nunca versione credenciais reais.

---

# Banco de Dados

O projeto utiliza PostgreSQL com migrations versionadas.

Dentro do container do backend:

```bash
php artisan migrate
php artisan db:seed
```

Para recriar completamente o banco:

```bash
php artisan migrate:fresh --seed
```

---

# Testes

## Backend

```bash
cd backend
php artisan test
```

## Frontend

```bash
cd frontend
npm test
```

### Testes implementados

Já foi implementado teste com:

- Vitest
- React Testing Library

O teste verifica que o campo **Justificativa da Prioridade** aparece quando o usuário seleciona prioridade **URGENTE**, enquanto a validação definitiva permanece protegida pelo backend.

---

# API

A API utiliza o prefixo:

```text
/api/v1
```

## OpenAPI

A especificação está disponível em:

```text
docs/openapi.yaml
```

Ela documenta:

- autenticação Bearer;
- endpoints;
- paginação;
- UUID;
- exemplos;
- respostas;
- máquina de estados;
- schemas reutilizáveis.

A especificação foi validada no **Swagger Editor**.

---

# Regras de Negócio

Algumas regras importantes implementadas:

| Regra | Implementação |
|--------|--------------|
| UUID v4 | Backend |
| Protocolo único | Backend |
| Prioridade urgente exige justificativa | Form Request |
| Status inicial RECEBIDA | Backend |
| Datas automáticas | Backend |
| Máquina de estados | `SolicitacaoService` |
| Botão oculto em CONCLUIDA | Frontend |
| Proteção contra transições inválidas | Backend |

Essa abordagem mantém uma boa experiência para o usuário sem confiar apenas na interface.

---

# Screenshots

> Adicione as imagens em `docs/screenshots/`.

## Dashboard

<AsyncImage query="modern healthcare dashboard web application blue cards chart" aspectRatio="16:9"/>

## Listagem

<AsyncImage query="web application table with filters status priority healthcare requests" aspectRatio="16:9"/>

## Detalhes

<AsyncImage query="healthcare request details page stepper audit timeline web application" aspectRatio="16:9"/>

## Nova Solicitação

<AsyncImage query="healthcare web application form blue interface" aspectRatio="16:9"/>

---

# Diferenciais Técnicos

O projeto foi desenvolvido priorizando boas práticas de arquitetura e experiência do usuário.

### Backend

- Service Pattern.
- API Resources.
- Form Requests.
- UUID público.
- Versionamento da API.
- Regras de negócio centralizadas.

### Frontend

- Skeleton Loading.
- Toasts flutuantes.
- StatusBadge reutilizável.
- Stepper de progresso.
- Timeline de auditoria.
- Empty States.
- Responsividade.

### UX

- ações inválidas não são oferecidas ao usuário;
- feedback imediato durante operações;
- carregamentos suaves;
- navegação protegida.

---

# Decisões Arquiteturais

Algumas decisões importantes tomadas durante o desenvolvimento:

### API Resources

A representação pública da API foi separada da estrutura interna do banco através de `SolicitacaoResource`, mantendo um contrato consistente para o frontend.

### Máquina de Estados

A regra definitiva das transições permanece no backend.

Mesmo ocultando ações inválidas na interface, a API continua protegida contra alterações indevidas.

### Filtros

Os filtros utilizam `filled()` e `where()` no Laravel, enquanto o frontend centraliza todas as chamadas em `services/solicitacoes.ts`.

Essa separação evita duplicação de lógica.

---

# Uso de Inteligência Artificial

Em conformidade com o edital, ferramentas de IA foram utilizadas como apoio durante o desenvolvimento para:

- revisão de código;
- refinamento da documentação;
- auxílio na criação de boilerplates;
- organização da arquitetura;
- apoio na elaboração de dados fictícios para testes.

Todas as decisões arquiteturais, implementação das regras de negócio, validações e testes foram revisados e validados durante o desenvolvimento.

---

# Estrutura Final

```text
.
├── backend/
├── frontend/
├── docs/
│   ├── openapi.yaml
│   └── screenshots/
└── docker-compose.yml
```

---

# Status

✅ Projeto funcional.

Recursos implementados:

- autenticação;
- CRUD completo;
- máquina de estados;
- auditoria;
- documentação OpenAPI;
- testes;
- Docker Compose;
- interface responsiva.

---

# Licença

Este projeto foi desenvolvido exclusivamente como parte do desafio técnico da seleção **V-Lab (CIn/UFPE)**.
