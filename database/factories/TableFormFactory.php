<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TableFormFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $statuses = ['Pending', 'Completed', 'Rejected'];
        $appliedByOptions = ['Peguam', 'Wakil', 'Polis'];
        $doctorNames = ['Dr. Smith', 'Dr. Johnson', 'Dr. Chee'];
        
        return [
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'full_name' => $this->faker->name,
            'email' => $this->faker->email,
            'ic_number' => $this->faker->numerify('##########'), // Adjust based on your IC number format
            'phone_number' => $this->faker->phoneNumber,
            'ic_number_applicant' => $this->faker->numerify('##########'), // Adjust based on your IC number format
            'date_registered' => $this->faker->date('Y-m-d'),
            'applied_by' => $this->faker->randomElement($appliedByOptions),
            'lab_status' => $this->faker->randomElement($statuses),
            'chemical_status' => $this->faker->randomElement($statuses),
            'autopsy_status' => $this->faker->randomElement($statuses),
            'doctor_name' => $this->faker->randomElement($doctorNames),
            'overall_status' => $this->faker->randomElement($statuses),
        ];
    }
}