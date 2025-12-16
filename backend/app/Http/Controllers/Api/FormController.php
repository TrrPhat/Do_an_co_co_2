<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FormController extends Controller
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
        } catch (\Throwable $e) {
        }
    }

    // POST /api/v1/contacts
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string',
        ]);
        $payload = [
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
            'status' => 'new',
            'created_at' => now(),
            'updated_at' => now(),
        ];
        $id = DB::table('contacts')->insertGetId($payload);
        $this->logActivity($request, 'CREATE', 'contact_public', $id, $payload);
        return response()->json(['success'=>true, 'data'=>['id'=>$id]]);
    }

    // POST /api/v1/registrations
    public function submitRegistration(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'course_id' => 'nullable|integer|exists:courses,id',
            'desired_schedule' => 'nullable|string|max:200',
            'notes' => 'nullable|string',
        ]);
        $payload = [
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'course_id' => $validated['course_id'] ?? null,
            'desired_schedule' => $validated['desired_schedule'] ?? null,
            'status' => 'new',
            'notes' => $validated['notes'] ?? null,
            'registered_at' => now(),
            'updated_at' => now(),
        ];
        $id = DB::table('registrations')->insertGetId($payload);
        $this->logActivity($request, 'CREATE', 'registration_public', $id, $payload);
        return response()->json(['success'=>true, 'data'=>['id'=>$id]]);
    }
}

