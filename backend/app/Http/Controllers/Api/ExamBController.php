<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamBController extends Controller
{
    private function licenseIdB()
    {
        $row = DB::table('license_types')->where('code', 'B')->first(['id']);
        return $row ? (int)$row->id : null;
    }

    private function categoryIdsByName()
    {
        // Expect names from seed data
        $rows = DB::table('question_categories')->get(['id','name']);
        $map = [];
        foreach ($rows as $r) { $map[$r->name] = (int)$r->id; }
        return $map;
    }

    public function variants()
    {
        $variants = [];
        for ($i=1; $i<=20; $i++) { $variants[] = ['id' => $i, 'label' => 'Đề '.$i]; }
        $variants[] = ['id' => 'random', 'label' => 'Đề ngẫu nhiên'];
        return response()->json(['data' => $variants]);
    }

    public function generate(Request $request)
    {
        $licenseId = $this->licenseIdB();
        if (!$licenseId) return response()->json(['error' => 'License B not found'], 400);

        $variant = $request->query('variant');
        $random = $request->boolean('random', false);
        if ($random || !$variant) {
            $seed = random_int(1, 1_000_000_000);
        } else {
            $variant = max(1, min(20, (int)$variant));
            $seed = crc32('hangb-'.$variant);
        }

        $catMap = $this->categoryIdsByName();
        $need = [
            'Khái niệm và quy tắc' => 8,
            'Văn hóa, đạo đức' => 1,
            'Kỹ thuật lái xe' => 1,
            'Cấu tạo và sửa chữa' => 1,
            'Biển báo hiệu' => 9,
            'Sa hình' => 9,
        ];

        $selected = [];
        $excludeIds = [];

        // 1. Pick 1 liability question
        $liability = DB::table('questions as q')
            ->where('q.license_type_id', $licenseId)
            ->where('q.is_active', true)
            ->where('q.is_liability_question', true)
            ->orderByRaw('MOD(q.id * 9301 + ?, 49297)', [$seed])
            ->limit(1)
            ->get(['q.id'])
            ->pluck('id')->map(fn($v)=>(int)$v)->all();
        if (!empty($liability)) {
            $selected = array_merge($selected, $liability);
            $excludeIds = $selected;
        }

        // 2. For each category, pick N (excluding liability already picked)
        foreach ($need as $name => $count) {
            if (!isset($catMap[$name])) continue;
            $catId = $catMap[$name];
            $rows = DB::table('questions as q')
                ->where('q.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->where('q.category_id', $catId)
                ->whereNotIn('q.id', $excludeIds)
                ->orderByRaw('MOD(q.id * 9301 + ?, 49297)', [$seed + $catId])
                ->limit($count)
                ->get(['q.id'])
                ->pluck('id')->map(fn($v)=>(int)$v)->all();
            $selected = array_merge($selected, $rows);
            $excludeIds = $selected;
        }

        // Safety: ensure exactly 30 (may be less if DB missing). Top-up from any remaining B questions.
        if (count($selected) < 30) {
            $topup = DB::table('questions as q')
                ->where('q.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->whereNotIn('q.id', $excludeIds)
                ->orderByRaw('MOD(q.id * 48271 + ?, 99991)', [$seed])
                ->limit(30 - count($selected))
                ->pluck('q.id')->map(fn($v)=>(int)$v)->all();
            $selected = array_merge($selected, $topup);
        }

        // Fetch question details
        $base = DB::table('questions as q')
            ->whereIn('q.id', $selected)
            ->orderByRaw('FIELD(q.id, '.implode(',', array_map('intval', $selected)).')')
            ->get(['q.id','q.question_text','q.image_url','q.is_liability_question','q.explanation']);
        $ids = $base->pluck('id')->all();
        $answers = DB::table('question_answers')
            ->whereIn('question_id', $ids)
            ->orderBy('question_id')
            ->orderBy('sort_order')
            ->orderBy('answer_key')
            ->get(['id','question_id','answer_key','answer_text','is_correct','sort_order']);
        $grouped = [];
        foreach ($answers as $a) { $grouped[$a->question_id][] = $a; }

        $out = [];
        $liabilityIds = [];
        foreach ($base as $q) {
            $opts = $grouped[$q->id] ?? [];
            $options = [];
            $correctIndex = null;
            foreach ($opts as $idx => $opt) {
                $options[] = $opt->answer_text;
                if ($opt->is_correct && $correctIndex === null) $correctIndex = $idx;
            }
            if ($q->is_liability_question) $liabilityIds[] = (int)$q->id;
            $out[] = [
                'id' => (int)$q->id,
                'text' => $q->question_text,
                'image_url' => $q->image_url,
                'is_liability' => (bool)$q->is_liability_question,
                'explanation' => $q->explanation,
                'options' => $options,
                'correctIndex' => $correctIndex,
            ];
        }

        return response()->json([
            'meta' => [
                'license' => 'B',
                'time_limit' => 20 * 60, // seconds
                'total' => count($out),
                'pass_score' => 27,
                'seed' => $seed,
            ],
            'liability_question_ids' => $liabilityIds,
            'questions' => $out,
        ]);
    }
}

