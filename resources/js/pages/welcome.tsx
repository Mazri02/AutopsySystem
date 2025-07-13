import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Welcome() {
    const [pass, setPass] = useState('');
    const [email, setEmail] = useState('');


    const RegisterAdmin = () => {
        const data = new FormData();
        data.append('pass',pass);
        data.append('email',email);

        axios.post('/api/register',data).then((res) => {
            if(res.status == 200){
                Swal.fire({
                    text: res.data.message || 'Akaun Berjaya Didaftar',
                    position: 'top-right',
                    icon: 'success',
                    toast: true,
                    showConfirmButton:false,
                    timer: 10000,
                    timerProgressBar: true
                })
                setEmail('');
                setPass('');
            }
        }).catch((error) => {
            let errorMessage = 'Ralat semasa mendaftar akaun';
            
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    // Validation errors
                    const errors = error.response.data.errors;
                    if (errors.email) {
                        errorMessage = errors.email[0];
                    } else if (errors.pass) {
                        errorMessage = errors.pass[0];
                    }
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            
            Swal.fire({
                text: errorMessage,
                position: 'top-right',
                icon: 'error',
                toast: true,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true
            });
        })
    }

    const LoginAdmin = () => {
        const data = new FormData();
        data.append('pass',pass);
        data.append('email',email);

        axios.post('/api/login',data).then((res) => {
            if(res.status == 200){
                if(res.data.status != 401){
                    Swal.fire({
                        title: 'Selamat Datang',
                        text: 'Log Masuk Berjaya',
                        position: 'top-right',
                        icon: 'success',
                        toast: true,
                        showConfirmButton:false,
                        timer: 2000,
                        timerProgressBar: true
                    })

                    sessionStorage.setItem('token',res.data.token);
                    router.visit('/dashboard');
                } else {
                    Swal.fire({
                        text: res.data.message,
                        position: 'top-right',
                        icon: 'error',
                        toast: true,
                        showConfirmButton:false,
                        timer: 2000,
                        timerProgressBar: true
                    })
                }
            }
        })
    }

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex flex-col gap-4 items-center justify-center opacity-100 transition-opacity duration-750 p-5 rounded-xl shadow-md starting:opacity-0 border">
                    <h2 className='font-bold'>Autopsy System - Hospital Jasin</h2>
                    <input type="email" className='border p-2' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className='border p-2' placeholder='Kata Laluan' onChange={(e) => setPass(e.target.value)}/>
                    <div className='flex gap-4'>
                        <button className='bg-blue-500 text-white py-2 px-4 rounded-xl hover:cursor-pointer' onClick={LoginAdmin}>Log Masuk</button>
                        <button className='bg-green-500 text-white py-2 px-4 rounded-xl hover:cursor-pointer' onClick={RegisterAdmin}>Daftar Ahli</button>
                    </div>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
