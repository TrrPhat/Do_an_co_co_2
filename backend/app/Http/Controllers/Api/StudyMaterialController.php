<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudyMaterialController extends Controller
{
    // GET /api/v1/materials
    public function index(Request $request)
    {
        $type = $request->query('type'); // tip|experience|law|technique
        $q = trim((string)$request->query('q', ''));
        $page = max(1, (int)$request->query('page', 1));
        $limit = min(50, max(1, (int)$request->query('limit', 12)));
        $offset = ($page - 1) * $limit;

        $base = DB::table('study_materials')
            ->where('is_published', 1)
            ->when($type, function ($qq) use ($type) {
                return $qq->where('material_type', $type);
            })
            ->when($q !== '', function ($qq) use ($q) {
                return $qq->where(function ($w) use ($q) {
                    $w->where('title', 'like', "%$q%")
                      ->orWhere('content', 'like', "%$q%");
                });
            })
            ->orderByDesc('created_at');

        $total = (clone $base)->count();
        $items = $base->offset($offset)->limit($limit)
            ->get(['id','title','image_url','material_type','created_at','content']);

        // Build excerpt
        $data = $items->map(function ($row) {
            $text = strip_tags((string)$row->content);
            $excerpt = mb_substr($text, 0, 160);
            return [
                'id' => (int)$row->id,
                'title' => $row->title,
                'image_url' => $row->image_url,
                'material_type' => $row->material_type,
                'created_at' => $row->created_at,
                'excerpt' => $excerpt . (mb_strlen($text) > 160 ? '…' : ''),
            ];
        })->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'total_pages' => (int)ceil($total / max(1, $limit)),
            ]
        ]);
    }

    // GET /api/v1/materials/{id}
    public function show($id)
    {
        $row = DB::table('study_materials')
            ->where('id', $id)
            ->where('is_published', 1)
            ->first(['id','title','content','material_type','image_url','created_at']);
        if (!$row) return response()->json(['error' => 'Not found'], 404);

        // related (same type)
        $related = DB::table('study_materials')
            ->where('is_published', 1)
            ->where('material_type', $row->material_type)
            ->where('id', '<>', $row->id)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id','title','image_url','created_at']);

        return response()->json([
            'data' => $row,
            'related' => $related
        ]);
    }
}

