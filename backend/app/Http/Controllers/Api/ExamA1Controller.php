<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamA1Controller extends Controller
{
    private function licenseIdA1()
    {
        $row = DB::table('license_types')->where('code', 'A1')->first(['id']);
        return $row ? (int)$row->id : null;
    }

    private function categoryIdsByName(): array
    {
        $rows = DB::table('question_categories')->get(['id','name']);
        $map = [];
        foreach ($rows as $r) { $map[$r->name] = (int)$r->id; }
        return $map;
    }

    public function variants()
    {
        $variants = [];
        for ($i=1; $i<=10; $i++) { $variants[] = ['id' => $i, 'label' => 'Đề '.$i]; }
        $variants[] = ['id' => 'random', 'label' => 'Đề ngẫu nhiên'];
        return response()->json(['data' => $variants]);
    }

    public function generate(Request $request)
    {
        $licenseId = $this->licenseIdA1();
        if (!$licenseId) return response()->json(['error' => 'License A1 not found'], 400);

        $variant = $request->query('variant');
        $random = $request->boolean('random', false);
        if ($random || !$variant) {
            $seed = random_int(1, 1_000_000_000);
        } else {
            $variant = max(1, min(10, (int)$variant));
            $seed = crc32('hanga1-'.$variant);
        }

        $catMap = $this->categoryIdsByName();
        $need = [
            'Khái niệm và quy tắc' => 8,
            'Văn hóa, đạo đức' => 1,
            // 'Kỹ thuật lái xe' OR 'Cấu tạo và sửa chữa' => 1 (xử lý riêng)
            'Biển báo hiệu' => 8,
            'Sa hình' => 6,
        ];

        $selected = [];
        $excludeIds = [];

        // 1) Chọn 1 câu điểm liệt trước (thuộc A1 qua pivot)
        $liability = DB::table('questions as q')
            ->join('question_license_types as ql', 'ql.question_id', '=', 'q.id')
            ->where('ql.license_type_id', $licenseId)
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

        // 2) 1 câu từ Kỹ thuật lái xe HOẶC Cấu tạo và sửa chữa
        $techId = $catMap['Kỹ thuật lái xe'] ?? null;
        $repairId = $catMap['Cấu tạo và sửa chữa'] ?? null;
        $pickCat = ($seed % 2 === 0) ? $techId : $repairId; // chọn ngẫu nhiên theo seed
        if ($pickCat) {
            $one = DB::table('questions as q')
                ->join('question_license_types as ql', 'ql.question_id', '=', 'q.id')
                ->where('ql.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->where('q.category_id', $pickCat)
                ->whereNotIn('q.id', $excludeIds)
                ->orderByRaw('MOD(q.id * 15803 + ?, 65537)', [$seed + 17])
                ->limit(1)
                ->pluck('q.id')->map(fn($v)=>(int)$v)->all();
            $selected = array_merge($selected, $one);
            $excludeIds = $selected;
        }

        // 3) Các nhóm còn lại theo $need
        foreach ($need as $name => $count) {
            if (!isset($catMap[$name])) continue;
            $catId = $catMap[$name];
            $rows = DB::table('questions as q')
                ->join('question_license_types as ql', 'ql.question_id', '=', 'q.id')
                ->where('ql.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->where('q.category_id', $catId)
                ->whereNotIn('q.id', $excludeIds)
                ->orderByRaw('MOD(q.id * 9301 + ?, 49297)', [$seed + $catId])
                ->limit($count)
                ->pluck('q.id')->map(fn($v)=>(int)$v)->all();
            $selected = array_merge($selected, $rows);
            $excludeIds = $selected;
        }

        // Tổng cần 25
        if (count($selected) < 25) {
            $topup = DB::table('questions as q')
                ->join('question_license_types as ql', 'ql.question_id', '=', 'q.id')
                ->where('ql.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->whereNotIn('q.id', $excludeIds)
                ->orderByRaw('MOD(q.id * 48271 + ?, 99991)', [$seed])
                ->limit(25 - count($selected))
                ->pluck('q.id')->map(fn($v)=>(int)$v)->all();
            $selected = array_merge($selected, $topup);
        }

        // Fetch details
        // If nothing selected (thiếu dữ liệu), lấy ngẫu nhiên 25 câu A1 để tránh lỗi
        if (count($selected) === 0) {
            $selected = DB::table('questions as q')
                ->join('question_license_types as ql', 'ql.question_id', '=', 'q.id')
                ->where('ql.license_type_id', $licenseId)
                ->where('q.is_active', true)
                ->orderByRaw('MOD(q.id * 48271 + ?, 99991)', [$seed])
                ->limit(25)
                ->pluck('q.id')->map(fn($v)=>(int)$v)->all();
        }

        $query = DB::table('questions as q')->whereIn('q.id', $selected);
        if (count($selected) > 0) {
            $query = $query->orderByRaw('FIELD(q.id, '.implode(',', array_map('intval', $selected)).')');
        } else {
            $query = $query->orderBy('q.id');
        }
        $base = $query->get(['q.id','q.question_text','q.image_url','q.is_liability_question','q.explanation']);
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
                'license' => 'A1',
                'time_limit' => 19 * 60, // seconds
                'total' => count($out),
                'pass_score' => 21,
                'seed' => $seed,
            ],
            'liability_question_ids' => $liabilityIds,
            'questions' => $out,
        ]);
    }
}

