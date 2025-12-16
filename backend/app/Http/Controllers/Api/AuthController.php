<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    private function userFromToken(Request $request)
    {
        $auth = $request->header('Authorization');
        $token = null;
        if ($auth && str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);
        }
        if (!$token) {
            $token = $request->query('token') ?: $request->input('token');
        }
        if (!$token) return null;
        $user = DB::table('app_users')->where('api_token', $token)->first();
        return $user;
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:app_users,email',
            'password' => 'required|string|min:6'
        ]);

        $token = Str::random(60);

        $id = DB::table('app_users')->insertGetId([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'api_token' => $token,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $user = DB::table('app_users')->where('id', $id)->first(['id','name','email','created_at']);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = DB::table('app_users')->where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Thông tin đăng nhập không đúng'], 401);
        }

        $token = Str::random(60);
        DB::table('app_users')->where('id', $user->id)->update(['api_token' => $token, 'updated_at' => now()]);

        $safeUser = DB::table('app_users')->where('id', $user->id)->first(['id','name','email','created_at']);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $safeUser,
        ]);
    }

    public function me(Request $request)
    {
        $user = $this->userFromToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }
        $safeUser = DB::table('app_users')->where('id', $user->id)->first(['id','name','email','created_at']);
        return response()->json(['success' => true, 'user' => $safeUser]);
    }

    public function logout(Request $request)
    {
        $user = $this->userFromToken($request);
        if ($user) {
            DB::table('app_users')->where('id', $user->id)->update(['api_token' => null, 'updated_at' => now()]);
        }
        return response()->json(['success' => true]);
    }
}

