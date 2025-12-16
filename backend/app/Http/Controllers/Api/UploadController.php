<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class UploadController extends Controller
{
    private function logActivity(Request $request, string $action, string $resourceType, $resourceId = null, $details = null)
    {
        try {
            DB::table('admin_activity_logs')->insert([
                'admin_user_id' => null,
                'action' => $action,
                'resource_type' => $resourceType,
                'resource_id' => $resourceId,
                'details' => $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {}
    }

    // POST /api/v1/admin/upload
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120', // 5MB
            'folder' => 'nullable|string|max:50',
        ]);
        $folder = preg_replace('/[^a-zA-Z0-9_-]/','', $request->input('folder','questions')) ?: 'questions';
        $path = $request->file('file')->store($folder, 'public');
        $url = asset('storage/'.$path);
        $this->logActivity($request, 'UPLOAD', 'file', null, ['path'=>$path,'url'=>$url]);
        return response()->json(['success'=>true,'url'=>$url,'path'=>$path]);
    }
}

