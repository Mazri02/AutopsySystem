<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TableForm;
use App\Models\User;
use App\Mail\ApproveForm;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller{
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        $request->session()->forget('user');
        
        return response()->json([
            'status' => 200,
            'message' => 'Successfully logged out'
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'pass' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && hash('sha256', $request->pass) == $user->password) {
            $user->tokens()->delete();
            
            $token = $user->createToken('autopsy-system')->plainTextToken;
            $request->session()->put('user', $user);

            return response()->json([
                'status' => 200,
                'token' => $token,
                'user' => session('user')
            ]);
        }

        return response()->json([
            'status' => 401, 
            'message' => 'Maklumat Tidak Sah'
        ], 401);
    }

    public function register(Request $req){
        User::create([
            'email' => $req->email,
            'password' => hash('sha256',$req->pass),
        ]);
    }

    public function getUser(Request $req){
        $tableForm = new TableForm();
        
        if($req->search){
            $tableForm = $tableForm->where('full_name', 'like', '%'.$req->search.'%');
        }

        if($req->status){
            $tableForm = $tableForm->where('overall_status', $req->status);
        }

        return $tableForm->paginate(9);
    }

    public function deleteUser($id){
        TableForm::where('id', $id)->delete();
    }

    public function createUser(Request $req){
        TableForm::create([
            'full_name' => $req->full_name,
            'ic_number' => $req->ic_number,
            'ic_number_applicant' => $req->ic_number_applicant,
            'phone_number' => $req->phone_number,
            'email' => $req->email,
            'date_registered' => $req->date_registered,
            'applied_by' => $req->applied_by,
            'lab_status' => 'Pending',
            'chemical_status' => 'Pending',
            'autopsy_status' => 'Pending',
            'doctor_name' => $req->doctor_name,
            'overall_status' => 'Pending',
        ]);
    }   

    public function updateUser($id, Request $req){
        TableForm::where('id', $id)->update([
            'full_name' => $req->full_name,
            'ic_number' => $req->ic_number,
            'ic_number_applicant' => $req->ic_number_applicant,
            'phone_number' => $req->phone_number,
            'email' => $req->email,
            'date_registered' => $req->date_registered,
            'applied_by' => $req->applied_by,
            'doctor_name' => $req->doctor_name,
        ]);
    }

    public function mailApprove(Request $req){
        Mail::to($req->email)->send(new ApproveForm());
    }

    public function updateStatus($id,$status,$type){
        if($type == "lab"){
            TableForm::where('id', $id)->update([
                'lab_status' => $status,
            ]);
        }

        if($type == 'chemical'){
            TableForm::where('id', $id)->update([
                'chemical_status' => $status,
            ]);
        }

        if($type == 'autopsy'){
            TableForm::where('id', $id)->update([
                'autopsy_status' => $status,
            ]);
        }

        $this->checkStatus($id,$status);
    }

    public function checkStatus($id,$status){
        $labStatus = TableForm::where('id',$id)->pluck('lab_status')->first();
        $chemicalStatus = TableForm::where('id',$id)->pluck('chemical_status')->first();
        $autopsyStatus = TableForm::where('id',$id)->pluck('autopsy_status')->first();

        if($labStatus == "Completed" && $chemicalStatus == "Completed" && $autopsyStatus == "Completed"){
            TableForm::where('id', $id)->update([
                'overall_status' => "Completed",
            ]);
        } else if($labStatus == "Rejected" && $chemicalStatus == "Rejected" && $autopsyStatus == "Rejected"){
            TableForm::where('id', $id)->update([
                'overall_status' => "Rejected",
            ]);
        } else {
            TableForm::where('id', $id)->update([
                'overall_status' => "Pending",
            ]);
        }

        return $status;
    }
}
