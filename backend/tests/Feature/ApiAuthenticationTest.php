<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiAuthenticationTest extends TestCase
{
    public function test_visitante_nao_autenticado_recebe_401_json_na_api(): void
    {
        $response = $this->getJson('/api/v1/me');

        $response->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_api_sem_cabecalho_accept_nao_tenta_redirecionar_para_login_web(): void
    {
        $response = $this->get('/api/v1/me');

        $response->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }
}
