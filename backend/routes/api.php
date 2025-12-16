<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ExamBController;
use App\Http\Controllers\Api\ExamA1Controller;
use App\Http\Controllers\Api\StudyMaterialController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\UploadController;

Route::get('/ping', fn() => response()->json(['ok' => true]));

Route::prefix('v1')->group(function () {
    // Data browsing
    Route::get('/categories', [QuestionController::class, 'categories']);
    Route::get('/questions', [QuestionController::class, 'questions']);

    // Exams - Hạng B
    Route::get('/exams/hang-b', [ExamBController::class, 'variants']);
    Route::get('/exams/hang-b/generate', [ExamBController::class, 'generate']);

    // Exams - Hạng A1
    Route::get('/exams/hang-a1', [ExamA1Controller::class, 'variants']);
    Route::get('/exams/hang-a1/generate', [ExamA1Controller::class, 'generate']);

    // Study materials
    Route::get('/materials', [StudyMaterialController::class, 'index']);
    Route::get('/materials/{id}', [StudyMaterialController::class, 'show']);

    // Public forms and courses
    Route::get('/courses', [AdminController::class, 'getCourses']);
    Route::post('/contacts', [FormController::class, 'submitContact']);
    Route::post('/registrations', [FormController::class, 'submitRegistration']);

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Admin endpoints
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
        Route::get('/registrations', [AdminController::class, 'getRegistrations']);
        Route::get('/contacts', [AdminController::class, 'getContacts']);
        Route::get('/questions', [AdminController::class, 'getQuestions']);
        Route::post('/questions', [AdminController::class, 'createQuestion']);
        Route::get('/questions/{id}', [AdminController::class, 'getQuestion']);
        Route::put('/questions/{id}', [AdminController::class, 'updateQuestion']);
        Route::delete('/questions/{id}', [AdminController::class, 'deleteQuestion']);
        Route::get('/activity-logs', [AdminController::class, 'getActivityLogs']);
        Route::get('/courses', [AdminController::class, 'getCourses']);
        Route::post('/courses', [AdminController::class, 'createCourse']);
        Route::put('/courses/{id}', [AdminController::class, 'updateCourse']);
        Route::delete('/courses/{id}', [AdminController::class, 'deleteCourse']);
        Route::get('/traffic-signs', [AdminController::class, 'getTrafficSigns']);
        Route::get('/study-materials', [AdminController::class, 'getStudyMaterials']);
        Route::post('/study-materials', [AdminController::class, 'createStudyMaterial']);
        Route::put('/study-materials/{id}', [AdminController::class, 'updateStudyMaterial']);
        Route::delete('/study-materials/{id}', [AdminController::class, 'deleteStudyMaterial']);
        Route::get('/exam-stats', [AdminController::class, 'getExamStats']);
        Route::get('/users', [AdminController::class, 'getAdminUsers']);
        Route::get('/activity-logs', [AdminController::class, 'getActivityLogs']);
        Route::get('/license-types', [AdminController::class, 'getLicenseTypes']);
        Route::post('/upload', [UploadController::class, 'upload']);
        
        Route::put('/registrations/{id}/status', [AdminController::class, 'updateRegistrationStatus']);
        Route::put('/contacts/{id}/status', [AdminController::class, 'updateContactStatus']);
    });
});
