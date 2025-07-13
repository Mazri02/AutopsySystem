<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('table_forms', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('email');
        $table->string('ic_number');
        $table->string('phone_number');
        $table->string('ic_number_applicant');
        $table->date('date_registered');
        $table->string('applied_by');
        $table->string('lab_status')->default('Pending');
        $table->string('chemical_status')->default('Pending');
        $table->string('autopsy_status')->default('Pending');
        $table->string('doctor_name');
        $table->string('overall_status')->default('Pending');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_forms');
    }
};
