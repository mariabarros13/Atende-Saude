<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->text('descricao')->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('solicitacoes')->whereNull('descricao')->update(['descricao' => '']);

        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->text('descricao')->nullable(false)->change();
        });
    }
};
