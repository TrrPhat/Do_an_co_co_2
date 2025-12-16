<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class QuestionController extends Controller
{
    // GET /api/v1/categories
    public function categories(Request $request)
    {
        $license = $request->query('license_type_id');

        $query = DB::table('question_categories as c')
            ->leftJoin('questions as q', 'q.category_id', '=', 'c.id')
            ->when($license, fn($q2) => $q2->where('q.license_type_id', $license))
            ->selectRaw('c.id, c.name, COALESCE(COUNT(q.id),0) as question_count')
            ->groupBy('c.id', 'c.name')
            ->orderBy('c.sort_order');

        $data = $query->get();

        return response()->json([ 'data' => $data ]);
    }

    // GET /api/v1/questions?category_id=1&page=1&limit=50
    public function questions(Request $request)
    {
        $categoryId = $request->query('category_id');
        $license = $request->query('license_type_id');
        $page = max(1, (int)$request->query('page', 1));
        $limit = min(600, max(1, (int)$request->query('limit', 60)));
        $offset = ($page - 1) * $limit;
        $liability = $request->boolean('liability');

        $base = DB::table('questions as q')
            ->when($categoryId, fn($q2) => $q2->where('q.category_id', $categoryId))
            ->when($license, fn($q2) => $q2->where('q.license_type_id', $license))
            ->when($liability, fn($q2) => $q2->where('q.is_liability_question', true))
            ->where('q.is_active', true)
            ->orderBy('q.id')
            ->offset($offset)
            ->limit($limit)
            ->get(['q.id','q.question_text','q.image_url','q.is_liability_question','q.explanation']);

        $ids = $base->pluck('id')->all();
        if (empty($ids)) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $answers = DB::table('question_answers')
            ->whereIn('question_id', $ids)
            ->orderBy('question_id')
            ->orderBy('sort_order')
            ->orderBy('answer_key')
            ->get(['id','question_id','answer_key','answer_text','is_correct','sort_order']);

        // group answers by question
        $grouped = [];
        foreach ($answers as $a) {
            $grouped[$a->question_id][] = $a;
        }

        $out = [];
        foreach ($base as $q) {
            $opts = $grouped[$q->id] ?? [];
            $options = [];
            $correctIndex = null;
            foreach ($opts as $idx => $opt) {
                $options[] = $opt->answer_text;
                if ($opt->is_correct && $correctIndex === null) {
                    $correctIndex = $idx; // zero-based
                }
            }
            $out[] = [
                'id' => $q->id,
                'text' => $q->question_text,
                'image_url' => $q->image_url,
                'is_liability' => (bool)$q->is_liability_question,
                'explanation' => $q->explanation,
                'options' => $options,
                'correctIndex' => $correctIndex,
            ];
        }

        // total for pagination (optional)
        $totalQuery = DB::table('questions as q')
            ->when($categoryId, fn($q2) => $q2->where('q.category_id', $categoryId))
            ->when($license, fn($q2) => $q2->where('q.license_type_id', $license))
            ->where('q.is_active', true);
        $total = (int)$totalQuery->count();

        return response()->json(['data' => $out, 'total' => $total, 'page' => $page, 'limit' => $limit]);
    }
}

