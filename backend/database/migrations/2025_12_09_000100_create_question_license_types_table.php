<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_license_types', function (Blueprint $table) {
            $table->id();
            $table->integer('question_id')->index(); 
            $table->integer('license_type_id')->index(); 
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['question_id','license_type_id'], 'uq_question_license');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->foreign('license_type_id')->references('id')->on('license_types')->onDelete('cascade');
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_license_types');
    }
};

