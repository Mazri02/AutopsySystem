<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::post('/login',[AdminController::class,'login']);
Route::post('/register',[AdminController::class,'register']);
Route::get('/checkReportStatus/{reportId}',[AdminController::class,'checkReportStatus']);
Route::get('/checkReportStatusByIC/{icNumber}',[AdminController::class,'checkReportStatusByIC']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/getUser',[AdminController::class,'getUser']);
    Route::delete('/deleteUser/{id}',[AdminController::class,'deleteUser']);
    Route::post('/createUser',[AdminController::class,'createUser']);
    Route::put('/updateUser/{id}',[AdminController::class,'updateUser']);
    Route::post('/mailApprove',[AdminController::class,'mailApprove']);
    Route::put('/updateStatus/{id}/{status}/{type}',[AdminController::class,'updateStatus']);
    Route::post('/logout',[AdminController::class,'logout']);
});