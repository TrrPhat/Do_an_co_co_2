<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function logActivity(Request $request, string $action, string $resourceType, $resourceId = null, $details = null)
    {
        try {
            DB::table('admin_activity_logs')->insert([
                'admin_user_id' => null, // TODO: bind real admin id when auth is added
                'action' => $action,
                'resource_type' => $resourceType,
                'resource_id' => $resourceId,
                'details' => $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // swallow logging errors
        }
    }

    /**
     * Get admin users list with pagination
     */
    public function getAdminUsers(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $status = $request->get('status'); // active/inactive
            $search = $request->get('search');

            $query = DB::table('admin_users')
                ->select('id', 'username', 'email', 'full_name', 'role', 'is_active', 'last_login', 'created_at');

            if ($status !== null) {
                $query->where('is_active', filter_var($status, FILTER_VALIDATE_BOOLEAN));
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('username', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('full_name', 'like', "%$search%");
                });
            }

            $total = $query->count();
            $users = $query->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        try {
            $stats = [
                'total_users' => DB::table('app_users')->count(),
                'total_registrations' => DB::table('registrations')->count(),
                'total_contacts' => DB::table('contacts')->count(),
                'total_questions' => DB::table('questions')->count(),
                'total_exams' => DB::table('exams')->count(),
                'total_courses' => DB::table('courses')->count(),
                'total_traffic_signs' => DB::table('traffic_signs')->count(),
                'total_study_materials' => DB::table('study_materials')->count(),
                'admin_users' => DB::table('admin_users')->count(),
                'active_sessions' => DB::table('user_sessions')->count(),
            ];

            // Get pass rate from exams (avoid division by zero)
            $totalExams = DB::table('exams')->count();
            $passedExams = DB::table('exams')->where('passed', true)->count();
            $passRate = $totalExams > 0 ? ($passedExams / $totalExams) * 100 : 0;
            $stats['pass_rate'] = round($passRate, 2);

            // Get average score (handle null)
            $avgScore = DB::table('exams')->avg('score');
            $stats['average_score'] = $avgScore !== null ? round($avgScore, 2) : 0;

            // Get recent registrations count (last 7 days)
            $stats['recent_registrations'] = DB::table('registrations')
                ->where('registered_at', '>=', now()->subDays(7))
                ->count();

            // Get recent contacts count (last 7 days)
            $stats['recent_contacts'] = DB::table('contacts')
                ->where('created_at', '>=', now()->subDays(7))
                ->count();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get registrations list with pagination
     */
    public function getRegistrations(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $status = $request->get('status');
            $search = $request->get('search');

            $query = DB::table('registrations')
                ->select('registrations.*', 'courses.name as course_name')
                ->leftJoin('courses', 'registrations.course_id', '=', 'courses.id');

            if ($status) {
                $query->where('registrations.status', $status);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('registrations.full_name', 'like', "%$search%")
                        ->orWhere('registrations.email', 'like', "%$search%")
                        ->orWhere('registrations.phone', 'like', "%$search%");
                });
            }

            $total = $query->count();
            $registrations = $query->orderBy('registrations.registered_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $registrations,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get contacts list with pagination
     */
    public function getContacts(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $status = $request->get('status');
            $search = $request->get('search');

            $query = DB::table('contacts');

            if ($status) {
                $query->where('status', $status);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('phone', 'like', "%$search%");
                });
            }

            $total = $query->count();
            $contacts = $query->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $contacts,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get questions list with pagination
     */
    public function getQuestions(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $category = $request->get('category');
            $license = $request->get('license');
            $search = $request->get('search');

            $query = DB::table('questions')
                ->select('questions.*', 'question_categories.name as category_name', 'license_types.name as license_name')
                ->leftJoin('question_categories', 'questions.category_id', '=', 'question_categories.id')
                ->leftJoin('license_types', 'questions.license_type_id', '=', 'license_types.id');

            if ($category) {
                $query->where('questions.category_id', $category);
            }

            if ($license) {
                $query->where('questions.license_type_id', $license);
            }

            if ($search) {
                $query->where('questions.question_text', 'like', "%$search%");
            }

            $total = $query->count();
            $questions = $query->orderBy('questions.created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $questions,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get activity logs
     */
    public function getActivityLogs(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);

            $query = DB::table('admin_activity_logs')
                ->select('admin_activity_logs.*', 'admin_users.username')
                ->leftJoin('admin_users', 'admin_activity_logs.admin_user_id', '=', 'admin_users.id');

            $total = $query->count();
            $logs = $query->orderBy('admin_activity_logs.created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $logs,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update registration status
     */
    public function updateRegistrationStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:new,contacted,paid,studying,completed'
            ]);

            DB::table('registrations')
                ->where('id', $id)
                ->update([
                    'status' => $validated['status'],
                    'updated_at' => now()
                ]);

            $this->logActivity($request, 'UPDATE', 'registration', $id, ['status' => $validated['status']]);

            return response()->json([
                'success' => true,
                'message' => 'Registration status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update contact status
     */
    public function updateContactStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:new,replied,resolved'
            ]);

            DB::table('contacts')
                ->where('id', $id)
                ->update([
                    'status' => $validated['status'],
                    'updated_at' => now()
                ]);

            $this->logActivity($request, 'UPDATE', 'contact', $id, ['status' => $validated['status']]);

            return response()->json([
                'success' => true,
                'message' => 'Contact status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get courses list
     */
    public function getCourses(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);

            $query = DB::table('courses')
                ->select('courses.*', 'license_types.name as license_name')
                ->leftJoin('license_types', 'courses.license_type_id', '=', 'license_types.id');

            $total = $query->count();
            $courses = $query->orderBy('courses.created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $courses,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createCourse(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'license_type_id' => 'nullable|integer|exists:license_types,id',
                'description' => 'nullable|string',
                'duration' => 'nullable|string|max:100',
                'price' => 'nullable|numeric',
                'discount_price' => 'nullable|numeric',
                'is_active' => 'nullable|boolean',
            ]);

            $payload = [
                'name' => $validated['name'],
                'license_type_id' => $validated['license_type_id'] ?? null,
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'price' => $validated['price'] ?? 0,
                'discount_price' => $validated['discount_price'] ?? 0,
                'is_active' => (bool)($validated['is_active'] ?? true),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $id = DB::table('courses')->insertGetId($payload);
            $this->logActivity($request, 'CREATE', 'course', $id, $payload);
            $row = DB::table('courses')->leftJoin('license_types','courses.license_type_id','=','license_types.id')->where('courses.id',$id)->select('courses.*','license_types.name as license_name')->first();
            return response()->json(['success'=>true,'data'=>$row]);
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()],500);
        }
    }

    public function updateCourse(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'license_type_id' => 'nullable|integer|exists:license_types,id',
                'description' => 'nullable|string',
                'duration' => 'nullable|string|max:100',
                'price' => 'nullable|numeric',
                'discount_price' => 'nullable|numeric',
                'is_active' => 'nullable|boolean',
            ]);
            $payload = [
                'name' => $validated['name'],
                'license_type_id' => $validated['license_type_id'] ?? null,
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'price' => $validated['price'] ?? 0,
                'discount_price' => $validated['discount_price'] ?? 0,
                'is_active' => (bool)($validated['is_active'] ?? true),
                'updated_at' => now(),
            ];
            DB::table('courses')->where('id',$id)->update($payload);
            $this->logActivity($request, 'UPDATE', 'course', $id, $payload);
            $row = DB::table('courses')->leftJoin('license_types','courses.license_type_id','=','license_types.id')->where('courses.id',$id)->select('courses.*','license_types.name as license_name')->first();
            return response()->json(['success'=>true,'data'=>$row]);
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()],500);
        }
    }

    public function deleteCourse(Request $request, $id)
    {
        try {
            $before = DB::table('courses')->where('id',$id)->first();
            DB::table('courses')->where('id',$id)->delete();
            $this->logActivity($request, 'DELETE', 'course', $id, $before);
            return response()->json(['success'=>true]);
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()],500);
        }
    }

    /**
     * Get traffic signs list
     */
    public function getTrafficSigns(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $category = $request->get('category');

            $query = DB::table('traffic_signs')
                ->select('traffic_signs.*', 'traffic_sign_categories.name as category_name')
                ->leftJoin('traffic_sign_categories', 'traffic_signs.category_id', '=', 'traffic_sign_categories.id');

            if ($category) {
                $query->where('traffic_signs.category_id', $category);
            }

            $total = $query->count();
            $signs = $query->orderBy('traffic_signs.created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $signs,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get study materials list
     */
    public function getStudyMaterials(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            $type = $request->get('type');

            $query = DB::table('study_materials');

            if ($type) {
                $query->where('material_type', $type);
            }

            $total = $query->count();
            $materials = $query->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $materials,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'page' => $page,
                    'last_page' => ceil($total / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createStudyMaterial(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'material_type' => 'required|in:tip,experience,law,technique',
                'image_url' => 'nullable|string|max:500',
                'sort_order' => 'nullable|integer',
                'is_published' => 'nullable|boolean'
            ]);

            $payload = [
                'title' => $validated['title'],
                'content' => $validated['content'] ?? null,
                'material_type' => $validated['material_type'],
                'image_url' => $validated['image_url'] ?? null,
                'sort_order' => $validated['sort_order'] ?? 0,
                'created_by' => null,
                'is_published' => isset($validated['is_published']) ? (bool)$validated['is_published'] : 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $id = DB::table('study_materials')->insertGetId($payload);
            $this->logActivity($request, 'CREATE', 'study_material', $id, $payload);

            $row = DB::table('study_materials')->where('id', $id)->first();
            return response()->json(['success' => true, 'data' => $row]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateStudyMaterial(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'material_type' => 'required|in:tip,experience,law,technique',
                'image_url' => 'nullable|string|max:500',
                'sort_order' => 'nullable|integer',
                'is_published' => 'nullable|boolean'
            ]);

            $payload = [
                'title' => $validated['title'],
                'content' => $validated['content'] ?? null,
                'material_type' => $validated['material_type'],
                'image_url' => $validated['image_url'] ?? null,
                'sort_order' => $validated['sort_order'] ?? 0,
                'is_published' => isset($validated['is_published']) ? (bool)$validated['is_published'] : 1,
                'updated_at' => now(),
            ];
            DB::table('study_materials')->where('id', $id)->update($payload);
            $this->logActivity($request, 'UPDATE', 'study_material', $id, $payload);

            $row = DB::table('study_materials')->where('id', $id)->first();
            return response()->json(['success' => true, 'data' => $row]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteStudyMaterial($id)
    {
        try {
            $before = DB::table('study_materials')->where('id', $id)->first();
            DB::table('study_materials')->where('id', $id)->delete();
            $this->logActivity($request, 'DELETE', 'study_material', $id, $before);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getLicenseTypes()
    {
        try {
            $rows = DB::table('license_types')->select('id','code','name')->orderBy('id')->get();
            return response()->json(['success' => true, 'data' => $rows]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function createQuestion(Request $request)
    {
        try {
            $validated = $request->validate([
                'question_text' => 'required|string',
                'image_url' => 'nullable|string|max:500',
                'license_type_id' => 'nullable|integer|exists:license_types,id',
                'category_id' => 'nullable|integer|exists:question_categories,id',
                'is_liability_question' => 'nullable|boolean',
                'explanation' => 'nullable|string',
                'is_active' => 'nullable|boolean',
                'answers' => 'required|array|min:1',
                'answers.*.answer_text' => 'required|string',
                'answers.*.is_correct' => 'nullable|boolean',
            ]);

            $payload = [
                'question_text' => $validated['question_text'],
                'image_url' => $validated['image_url'] ?? null,
                'license_type_id' => $validated['license_type_id'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'is_liability_question' => (bool)($validated['is_liability_question'] ?? false),
                'explanation' => $validated['explanation'] ?? null,
                'created_by' => null,
                'is_active' => (bool)($validated['is_active'] ?? true),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $qid = DB::table('questions')->insertGetId($payload);

            // Insert answers
            $answers = $validated['answers'];
            $keyChars = range('A','Z');
            foreach ($answers as $idx => $ans) {
                DB::table('question_answers')->insert([
                    'question_id' => $qid,
                    'answer_key' => $keyChars[$idx] ?? 'A',
                    'answer_text' => $ans['answer_text'],
                    'is_correct' => (bool)($ans['is_correct'] ?? false),
                    'sort_order' => $idx,
                ]);
            }

            $this->logActivity($request, 'CREATE', 'question', $qid, [ 'question' => $payload, 'answers' => $answers ]);

            $row = DB::table('questions')->where('id', $qid)->first();
            return response()->json(['success' => true, 'data' => $row]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateQuestion(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'question_text' => 'required|string',
                'image_url' => 'nullable|string|max:500',
                'license_type_id' => 'nullable|integer|exists:license_types,id',
                'category_id' => 'nullable|integer|exists:question_categories,id',
                'is_liability_question' => 'nullable|boolean',
                'explanation' => 'nullable|string',
                'is_active' => 'nullable|boolean',
                'answers' => 'required|array|min:1',
                'answers.*.answer_text' => 'required|string',
                'answers.*.is_correct' => 'nullable|boolean',
            ]);

            $payload = [
                'question_text' => $validated['question_text'],
                'image_url' => $validated['image_url'] ?? null,
                'license_type_id' => $validated['license_type_id'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'is_liability_question' => (bool)($validated['is_liability_question'] ?? false),
                'explanation' => $validated['explanation'] ?? null,
                'is_active' => (bool)($validated['is_active'] ?? true),
                'updated_at' => now(),
            ];
            DB::table('questions')->where('id', $id)->update($payload);

            // Replace answers
            DB::table('question_answers')->where('question_id', $id)->delete();
            $answers = $validated['answers'];
            $keyChars = range('A','Z');
            foreach ($answers as $idx => $ans) {
                DB::table('question_answers')->insert([
                    'question_id' => $id,
                    'answer_key' => $keyChars[$idx] ?? 'A',
                    'answer_text' => $ans['answer_text'],
                    'is_correct' => (bool)($ans['is_correct'] ?? false),
                    'sort_order' => $idx,
                ]);
            }

            $this->logActivity($request, 'UPDATE', 'question', $id, [ 'question' => $payload, 'answers' => $answers ]);

            $row = DB::table('questions')->where('id', $id)->first();
            return response()->json(['success' => true, 'data' => $row]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteQuestion($id)
    {
        try {
            $before = DB::table('questions')->where('id', $id)->first();
            $beforeAnswers = DB::table('question_answers')->where('question_id', $id)->get();
            DB::table('questions')->where('id', $id)->delete();
            $this->logActivity(request(), 'DELETE', 'question', $id, ['question' => $before, 'answers' => $beforeAnswers]);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getQuestion($id)
    {
        try {
            $q = DB::table('questions as q')
                ->leftJoin('question_categories as c', 'q.category_id', '=', 'c.id')
                ->leftJoin('license_types as l', 'q.license_type_id', '=', 'l.id')
                ->where('q.id', $id)
                ->select('q.*', 'c.name as category_name', 'l.name as license_name')
                ->first();
            if (!$q) return response()->json(['success'=>false,'message'=>'Not found'],404);
            $answers = DB::table('question_answers')
                ->where('question_id', $id)
                ->orderBy('sort_order')
                ->orderBy('answer_key')
                ->get(['id','answer_key','answer_text','is_correct','sort_order']);
            return response()->json(['success'=>true,'data'=>[ 'question'=>$q, 'answers'=>$answers ]]);
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()],500);
        }
    }

    /**
     * Get exam statistics
     */
    public function getExamStats()
    {
        try {
            $stats = [
                'total_exams' => DB::table('exams')->count(),
                'passed_exams' => DB::table('exams')->where('passed', true)->count(),
                'failed_exams' => DB::table('exams')->where('passed', false)->count(),
                'average_score' => round(DB::table('exams')->avg('score'), 2),
                'average_time_spent' => round(DB::table('exams')->avg('time_spent'), 2),
                'by_license_type' => DB::table('exams')
                    ->select('license_types.name', DB::raw('COUNT(*) as count'), DB::raw('AVG(exams.score) as avg_score'))
                    ->leftJoin('exam_types', 'exams.exam_type_id', '=', 'exam_types.id')
                    ->leftJoin('license_types', 'exam_types.license_type_id', '=', 'license_types.id')
                    ->groupBy('license_types.id', 'license_types.name')
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

