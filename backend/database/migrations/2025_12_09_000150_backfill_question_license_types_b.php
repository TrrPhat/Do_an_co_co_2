<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill pivot for license B from questions.license_type_id
        $bId = DB::table('license_types')->where('code', 'B')->value('id');
        if ($bId) {
            DB::statement('INSERT IGNORE INTO question_license_types (question_id, license_type_id)
                SELECT id, '.$bId.' FROM questions WHERE license_type_id = '.$bId);
        }
    }

    public function down(): void
    {
        $bId = DB::table('license_types')->where('code', 'B')->value('id');
        if ($bId) {
            DB::table('question_license_types')->where('license_type_id', $bId)->delete();
        }
    }
};

