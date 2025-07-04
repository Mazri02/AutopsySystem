import React, { useState } from 'react';
import HospitalJasin from '../../img/logo.jpg';
import GambarHospitalJasin from '../../img/hospjasin.jpg';
import Government from '../../img/gov.jpg';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function Index() {
  const [reportId, setReportId] = useState('');
  const [checkType, setCheckType] = useState('reportId'); // 'reportId' or 'icNumber'
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');

  // Clear input when switching between check types
  const handleCheckTypeChange = (newType: string) => {
    setCheckType(newType);
    setReportId(''); // Clear the input when switching modes
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkReportStatus();
    }
  };

  const checkReportStatus = async () => {
    const inputValue = reportId.trim();
    
    if (!inputValue) {
      Swal.fire({
        title: 'Ralat',
        text: checkType === 'reportId' ? 'Sila masukkan ID laporan autopsy' : 'Sila masukkan No. IC',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Create SweetAlert2 mixin for toast notifications
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });

    try {
      // Show loading state
      Toast.fire({
        icon: 'info',
        title: 'Memeriksa status laporan...'
      });

      // Choose API endpoint based on check type
      const apiEndpoint = checkType === 'reportId' 
        ? `/api/checkReportStatus/${inputValue}`
        : `/api/checkReportStatusByIC/${inputValue}`;

      // Make API call to check report status
      const response = await axios.get(apiEndpoint);
      const result = response.data;

      if (result.found) {
        const reportData = result.data;
        
        if (reportData.is_ready) {
          Swal.fire({
            title: 'Laporan Siap!',
            html: `
              <div class="text-left">
                <p><strong>Nama:</strong> ${reportData.full_name}</p>
                <p><strong>ID Laporan:</strong> ${reportData.id}</p>
                ${reportData.ic_number ? `<p><strong>No. IC Si Mati:</strong> ${reportData.ic_number}</p>` : ''}
                ${reportData.ic_number_applicant ? `<p><strong>No. IC Pemohon:</strong> ${reportData.ic_number_applicant}</p>` : ''}
                <p><strong>Doktor:</strong> ${reportData.doctor_name}</p>
                <p><strong>Tarikh Mohon:</strong> ${reportData.date_registered}</p>
                <p class="mt-3 text-green-600 font-bold">✅ Laporan autopsy telah siap untuk diambil</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'text-sm'
            }
          });
        } else {
          Swal.fire({
            title: 'Laporan Dalam Proses',
            html: `
              <div class="text-left">
                <p><strong>Nama:</strong> ${reportData.full_name}</p>
                <p><strong>ID Laporan:</strong> ${reportData.id}</p>
                ${reportData.ic_number ? `<p><strong>No. IC Si Mati:</strong> ${reportData.ic_number}</p>` : ''}
                ${reportData.ic_number_applicant ? `<p><strong>No. IC Pemohon:</strong> ${reportData.ic_number_applicant}</p>` : ''}
                <p><strong>Doktor:</strong> ${reportData.doctor_name}</p>
                <p><strong>Status Lab:</strong> ${reportData.lab_status}</p>
                <p><strong>Status Chemical:</strong> ${reportData.chemical_status}</p>
                <p><strong>Status Autopsy:</strong> ${reportData.autopsy_status}</p>
                <p class="mt-3 text-yellow-600 font-bold">⏳ Laporan masih dalam proses</p>
              </div>
            `,
            icon: 'info',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'text-sm'
            }
          });
        }
      } else {
        Toast.fire({
          icon: 'error',
          title: checkType === 'reportId' ? 'ID laporan tidak dijumpai' : 'Tiada laporan dijumpai untuk No. IC ini'
        });
      }

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        Toast.fire({
          icon: 'error',
          title: checkType === 'reportId' ? 'ID laporan tidak dijumpai' : 'Tiada laporan dijumpai untuk No. IC ini'
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Ralat semasa memeriksa status laporan'
        });
      }
    }
  };

  const RegisterAdmin = () => {
    const data = new FormData();
    data.append('pass', pass);
    data.append('email', email);

    axios.post('/api/register', data).then((res) => {
      if (res.status == 200) {
        Swal.fire({
          text: res.data.message || 'Akaun Berjaya Didaftar',
          position: 'top-right',
          icon: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true
        });
        setShowAdminForm(false);
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
    });
  }

  const LoginAdmin = () => {
    const data = new FormData();
    data.append('pass', pass);
    data.append('email', email);

    axios.post('/api/login', data).then((res) => {
      if (res.status == 200) {
        if (res.data.status != 401) {
          Swal.fire({
            title: 'Selamat Datang',
            text: 'Log Masuk Berjaya',
            position: 'top-right',
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });

          sessionStorage.setItem('token', res.data.token);
          router.visit('/dashboard');
        } else {
          Swal.fire({
            text: res.data.message,
            position: 'top-right',
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
        }
      }
    });
  }

  const navigateToDashboard = () => {
    setShowAdminForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Login Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col gap-4 items-center justify-center opacity-100 transition-opacity duration-750 p-5 rounded-xl shadow-md bg-white border max-w-md w-full">
            <div className="flex justify-between w-full">
              <h2 className="font-bold text-lg">Autopsy System - Hospital Jasin</h2>
              <button 
                onClick={() => setShowAdminForm(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <input 
              type="email" 
              className="border p-2 w-full rounded" 
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              className="border p-2 w-full rounded" 
              placeholder="Kata Laluan" 
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="flex gap-4 w-full justify-center">
              <button 
                className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:cursor-pointer hover:bg-blue-600" 
                onClick={LoginAdmin}
              >
                Log Masuk
              </button>
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded-xl hover:cursor-pointer hover:bg-green-600" 
                onClick={RegisterAdmin}
              >
                Daftar Ahli
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logos and Title */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={HospitalJasin} 
                  alt="Hospital Jasin" 
                  className="w-14 h-14 object-contain"
                />
                <img 
                  src={Government} 
                  alt="Government" 
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  Sistem Autopsy Hospital Jasin
                </h1>
                <p className="text-sm text-gray-300 mt-1">
                  Portal Rasmi Pemeriksaan Status Laporan
                </p>
              </div>
            </div>

            {/* Right side - Button */}
            <div>
              <button
                onClick={navigateToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Panel Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left side - Full Background Image (65%) */}
        <div className="w-[65%] relative overflow-hidden">
          <img 
            src={GambarHospitalJasin} 
            alt="Hospital Jasin Building" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          
          {/* Diagonal cut effect */}
          <div 
            className="absolute top-0 right-0 w-32 h-full bg-white"
            style={{
              clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          ></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="container mx-auto px-12 max-w-2xl">
              <div className="text-white space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold leading-tight">
                    Semak Status<br />
                    Laporan Autopsy
                  </h1>
                  <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                    Portal rasmi untuk memeriksa status ketersediaan laporan autopsy Hospital Jasin dengan mudah dan pantas.
                  </p>
                </div>
                
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/25 max-w-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        <strong className="text-white">Penting:</strong> Anda boleh semak status menggunakan ID laporan yang diberikan semasa permohonan atau No. IC pemohon/si mati.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form Section (35%) */}
        <div className="w-[35%] bg-white relative">
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-sm px-8">
              <div className="space-y-8">
                {/* Form Header */}
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Semak Status
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Pilih kaedah untuk memeriksa status ketersediaan laporan
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Radio buttons for check type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Semak Menggunakan:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="checkType"
                          value="reportId"
                          checked={checkType === 'reportId'}
                          onChange={(e) => handleCheckTypeChange(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">ID Laporan Autopsy</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="checkType"
                          value="icNumber"
                          checked={checkType === 'icNumber'}
                          onChange={(e) => handleCheckTypeChange(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">No. Kad Pengenalan</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reportId" className="block text-sm font-semibold text-gray-700 mb-2">
                      {checkType === 'reportId' ? 'ID Laporan Autopsy' : 'No. Kad Pengenalan'}
                    </label>
                    <input
                      type="text"
                      id="reportId"
                      value={reportId}
                      onChange={(e) => setReportId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={checkType === 'reportId' ? 'Contoh: AUT2024001' : 'Contoh: 123456789012'}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium"
                    />
                  </div>

                  <button
                    onClick={checkReportStatus}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Semak Status Laporan
                  </button>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Masa Pemprosesan</h4>
                    <div className="space-y-1 text-xs text-blue-800">
                      <p>Laporan dijangka siap dalam 7-14 hari bekerja</p>
                      <p>Kes kecemasan: 24-48 jam</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Hubungi Kami</h4>
                    <div className="space-y-1 text-xs text-gray-700">
                      <p>Tel: +60 6-5294262</p>
                      <p>Email: hjasin@moh.gov.my</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <h4 className="font-semibold text-gray-200 text-sm">Waktu Operasi</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Isnin - Jumaat: 8:00 AM - 5:00 PM</p>
                <p>Sabtu, Ahad, Hari Kelepasan Am,</p>
                <p>Selepas Waktu Pejabat - Bertugas atas panggilan</p>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h4 className="font-semibold text-gray-200 text-sm">Hubungi Kami</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Tel: +60 6-5294262</p>
                <p>Email: hjasin@moh.gov.my</p>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h4 className="font-semibold text-gray-200 text-sm">Masa Pemprosesan</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Laporan dijangka siap dalam 7-14 hari bekerja</p>
                <p>Kes kecemasan: 24-48 jam</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-500">
              &copy; 2025 Hospital Jasin. Kementerian Kesihatan Malaysia. Hak Cipta Terpelihara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}