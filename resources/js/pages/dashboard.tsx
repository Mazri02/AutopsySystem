  import { useReactTable, getCoreRowModel, ColumnDef, flexRender, RowExpanding } from '@tanstack/react-table'
  import axios from 'axios'
  import HospitalJasin from '../../img/logo.jpg'
  import Government from '../../img/gov.jpg'
  import React, { useEffect, useState } from 'react'
  import {
    BsArrowLeft,
    BsArrowRight,
    BsCalendar,
    BsCheck,
    BsCreditCard,
    BsDoorOpen,
    BsDoorOpenFill,
    BsEnvelope,
    BsHospital,
    BsPencil,
    BsPerson,
    BsPersonFill,
    BsPhone,
    BsPlus,
    BsTrash,
    BsX,
  } from 'react-icons/bs';
  import { TableForm } from '@/types/table-form';
  import Swal from 'sweetalert2';
  import withReactContent from 'sweetalert2-react-content';
import { router } from '@inertiajs/react'
import { LoaderPinwheel } from 'lucide-react'

  interface FormData {
    full_name: string;
    ic_number_applicant: string;
    ic_number: string;
    email: string;
    phone_number: string;
    date_registered: string;
    applied_by: string;
    doctor_name: string;
  }

  interface FormsProps {
    data: FormData;
    setFormData: (key: keyof FormData, value: string) => void;
  }

  function Forms({ data, setFormData }: FormsProps) {
    // Create local state that initializes with the passed data
    const [localData, setLocalData] = useState<FormData>(data);

    // Update both local and parent state
    const handleChange = (key: keyof FormData, value: string) => {
      const newData = { ...localData, [key]: value };
      setLocalData(newData);
      setFormData(key, value);
    };

    return (
      <div className='flex items-center gap-2 flex-col w-full'>
        <p className='text-[1.15em] font-bold mb-4'>Borang Pendaftaran Autopsy</p>

        <div className='flex gap-2 justify-center flex-col w-full'>
          <div className='border flex'>
            <BsPerson className='mx-2 my-auto'/>
            <input 
              type="text" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="Nama Pemohon" 
              value={localData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsCreditCard className='mx-2 my-auto'/>
            <input 
              type="text" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="No. IC Pemohon"
              value={localData.ic_number_applicant}
              onChange={(e) => handleChange('ic_number_applicant', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsCreditCard className='mx-2 my-auto'/>
            <input 
              type="text" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="No. IC Si Mati"
              value={localData.ic_number}
              onChange={(e) => handleChange('ic_number', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsEnvelope className='mx-2 my-auto'/>
            <input 
              type="email" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="Email Pemohon"
              value={localData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsPhone className='mx-2 my-auto'/>
            <input 
              type="tel" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="No. Tel. Pemohon"
              value={localData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsCalendar className='mx-2 my-auto'/>
            <input 
              type="date" 
              className='w-full px-2 py-2 text-[.8em]' 
              placeholder="Tarikh Memohon"
              value={localData.date_registered}
              onChange={(e) => handleChange('date_registered', e.target.value)}
            />
          </div>
          <div className='border flex'>
            <BsPersonFill className='mx-2 my-auto'/>
            <select 
              className='text-[.8em] w-full px-2 py-2'
              value={localData.applied_by}
              onChange={(e) => handleChange('applied_by', e.target.value)}
            >
              <option value="" disabled hidden>Dimohon Oleh</option>
              <option value="Waris">Waris</option>
              <option value="Peguam">Peguam</option>
              <option value="Majikan">Majikan</option>
              <option value="Polis">Polis</option>
            </select>
          </div>
          <div className='border flex'>
            <BsHospital className='mx-2 my-auto'/>
            <select 
              className='text-[.8em] w-full px-2 py-2'
              value={localData.doctor_name}
              onChange={(e) => handleChange('doctor_name', e.target.value)}
            >
              <option value="" disabled hidden>Doktor Bertugas</option>
              <option value="Dr. Zaleha">Dr. Zaleha</option>
              <option value="Dr. Chee">Dr. Chee</option>
              <option value="Prof. Madya">Prof. Madya</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  export default function Dashboard() {
    const [data, setData] = React.useState<TableForm[]>([]);
    const [page, setPage] = React.useState(1);
    const [status, setStatus] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [total, setTotal] = React.useState(0);
    const [length, setLength] = React.useState(0);
    const [loading, isLoading] = React.useState(false);
    const [formData, setFormData] = useState<FormData>({
      full_name: '',
      ic_number_applicant: '',
      ic_number: '',
      email: '',
      phone_number: '',
      date_registered: '',
      applied_by: '',
      doctor_name: ''
    });

    const setFormField = (key: keyof FormData, value: string) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };

    const columns: ColumnDef<TableForm>[] = [
      {
        accessorKey: 'id',
        header: '',
        cell: (info:any) => {
          return (
            <div className='flex gap-2'>
              <BsTrash className="hover:cursor-pointer" onClick={() => handleDelete(info.getValue())}/>
              <BsPencil className="hover:cursor-pointer" onClick={() => openForm(info.row.original)}/>
              {info.row.original.overall_status == "Completed" && <BsEnvelope onClick={() => sendMail(info.row.original.email)} className="hover:cursor-pointer"/>}
            </div>
          )
        },
        footer: props => props.column.id,
      },
      {
        accessorKey: 'full_name',
        header: 'Nama Pemohon',
        cell: (info:any) => <div className='line-clamp-1'>{info.getValue()}</div>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'ic_number_applicant',
        header: 'IC Pemohon',
        cell: (info:any) => (<div className='text-center'>{info.getValue()}</div>),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'lab_status',
        header: 'Lab',
        cell: (info: any) => {
          const value = info.getValue();
          const colorMap:any = {
            Completed: 'bg-green-500',
            Pending: 'bg-yellow-500',
            Rejected: 'bg-red-500',
          };
          const bgClass = colorMap[value] || 'bg-gray-500';
          
          return (
            <div className={`${bgClass} text-white text-center py-1 px-2 rounded-xl font-bold flex justify-between align-center`}>
              <div className='my-auto'>{value}</div>
              <div className='flex'>
                {(value == "Completed" || value == "Pending") && <BsX onClick={() => updateStatus(info.row.original.id,"Rejected","lab")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
                {(value == "Rejected" || value == "Pending") && <BsCheck onClick={() => updateStatus(info.row.original.id,"Completed","lab")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
              </div>
            </div>
          );
        },
        footer: props => props.column.id,
      },
      {
        accessorKey: 'chemical_status',
        header: 'Chemical',
        cell: (info: any) => {
          const value = info.getValue();
          const colorMap:any = {
            Completed: 'bg-green-500',
            Pending: 'bg-yellow-500',
            Rejected: 'bg-red-500',
          };
          const bgClass = colorMap[value] || 'bg-gray-500';
          
          return (
            <div className={`${bgClass} text-white text-center py-1 px-2 rounded-xl font-bold flex justify-between align-center`}>
              <div className='my-auto'>{value}</div>
              <div className='flex'>
                {(value == "Completed" || value == "Pending") && <BsX onClick={() => updateStatus(info.row.original.id,"Rejected","chemical")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
                {(value == "Rejected" || value == "Pending") && <BsCheck onClick={() => updateStatus(info.row.original.id,"Completed","chemical")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
              </div>
            </div>
          );
        },
        footer: props => props.column.id,
      },
      {
        accessorKey: 'autopsy_status',
        header: 'Autopsy',
        cell: (info: any) => {
          const value = info.getValue();
          const colorMap:any = {
            Completed: 'bg-green-500',
            Pending: 'bg-yellow-500',
            Rejected: 'bg-red-500',
          };
          const bgClass = colorMap[value] || 'bg-gray-500';
          
          return (
            <div className={`${bgClass} text-white text-center py-1 px-2 rounded-xl font-bold flex justify-between align-center`}>
              <div className='my-auto'>{value}</div>
              <div className='flex'>
                {(value == "Completed" || value == "Pending") && <BsX onClick={() => updateStatus(info.row.original.id,"Rejected","autopsy")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
                {(value == "Rejected" || value == "Pending") && <BsCheck onClick={() => updateStatus(info.row.original.id,"Completed","autopsy")} className='text-white my-auto w-5 h-5 hover:cursor-pointer'/>}
              </div>
            </div>
          );
        },
        footer: props => props.column.id,
      },
      {
        accessorKey: 'applied_by',
        header: 'Dimohon Oleh',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'doctor_name',
        header: 'Doktor',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'overall_status',
        header: 'Status',
        cell: (info: any) => {
          const value = info.getValue();
          const colorMap:any = {
            Completed: 'bg-green-500',
            Pending: 'bg-yellow-500',
            Rejected: 'bg-red-500',
          };
          const bgClass = colorMap[value] || 'bg-gray-500';
          
          return (
            <div className={`${bgClass} text-white text-center py-1 px-2 rounded-xl font-bold`}>
              {value}
            </div>
          );
        },
        footer: props => props.column.id,
      },
    ];

    const updateStatus = (id:string, status:string,type:string) =>{
      axios.put('/api/updateStatus/'+id+"/"+status+"/"+type).then((res) => {
        if(res.status == 200){
          Swal.fire({
            text: 'Status Berjaya Diubah',
            position: 'top-right',
            icon: 'success',
            toast: true,
            showConfirmButton:false,
            timer: 3000,
            timerProgressBar: true
          })
          loadData();
        }
      })
    }

    const sendMail = (email:string) =>{
      const data = new FormData();
      data.append('email',email);
      Swal.fire({
        text: 'Email sedang dihantar...',
        position: 'top-right',
        icon: 'info',
        toast: true,
        showConfirmButton:false,
      })

          
      axios.post('/api/mailApprove',data).then((res) => {
        if(res.status == 200){
          Swal.fire({
            text: 'Email telah Dihantar',
            position: 'top-right',
            icon: 'success',
            toast: true,
            showConfirmButton:false,
            timer: 10000,
            timerProgressBar: true
          })
          loadData();
        }
      })
    }

    const handleDelete = (id:string) => {
      axios.delete(`/api/deleteUser/`+id).then((res) => {
        if(res.status == 200) {
          Swal.fire({
            text: 'Data Berjaya Dipadam',
            position: 'top-right',
            icon: 'success',
            toast: true,
            showConfirmButton:false,
            timer: 3000,
            timerProgressBar: true
          })
          loadData();
        }
      })
    }


    const openForm = (data?: any | null) => {
      const openSwal = withReactContent(Swal);
      
      const initialFormData = (data.full_name) ? {
        full_name: data.full_name || '',
        ic_number_applicant: data.ic_number_applicant || '',
        ic_number: data.ic_number || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        date_registered: data.date_registered || '',
        applied_by: data.applied_by || '',
        doctor_name: data.doctor_name || ''
      } : {
        full_name: '',
        ic_number_applicant: '',
        ic_number: '',
        email: '',
        phone_number: '',
        date_registered: '',
        applied_by: '',
        doctor_name: ''
      };

      // Update the state for consistency (though we won't rely on this for the form)
      setFormData(initialFormData);

      const FormWithState = () => (
        <Forms 
          data={initialFormData} 
          setFormData={(key, value) => {
            // Update both the local form data and the component state
            initialFormData[key as keyof FormData] = value;
            setFormField(key, value);
          }} 
        />
      );

      openSwal.fire({
        html: <FormWithState />,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        customClass: {
          popup: '!w-[30%]',
          actions: 'text-[.85em] flex-row-reverse !mr-4'
        },
        confirmButtonText: (data.full_name) ? 'Kemaskini' : 'Hantar',
        cancelButtonText: 'Batal',
        preConfirm: () => {
          const emptyFields = Object.entries(initialFormData)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

          if (emptyFields.length > 0) {
            Swal.showValidationMessage(`Sila isi semua ruangan`);
            return false;
          }
          
          return initialFormData;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const apiCall = (data.full_name) 
            ? axios.put(`/api/updateUser/${data.id}`, result.value) 
            : axios.post('/api/createUser', result.value);

          apiCall.then((res) => {
            if(res.status == 200) {
              Swal.fire({
                text: (data.full_name) ? 'Data Berjaya Dikemaskini' : 'Data Berjaya Ditambah',
                position: 'top-right',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
              loadData();
            }
          }).catch(error => {
            Swal.fire({
              text: 'Ralat: ' + error.message,
              position: 'top-right',
              icon: 'error',
              toast: true,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
          });
        }
      });
    }

    const logout = () => {
      axios.post(`/api/logout/`).then((res) => {
        if(res.status == 200) {
          Swal.fire({
            text: 'Log Keluar Berjaya',
            position: 'top-right',
            icon: 'success',
            toast: true,
            showConfirmButton:false,
            timer: 3000,
            timerProgressBar: true
          })

          sessionStorage.clear()
          router.visit('/')
        }
      })
    }
    
    useEffect(() => {
      loadData();
    },[search,page,status])

    const loadData = () => {
      const data = new FormData();
      data.append('search', search);
      data.append('status', status);

      isLoading(true);
      axios.post(`/api/getUser?page=${page}`, data)
        .then((res) => {
          if (res.status === 200) {
            setData(res.data.data);
            setTotal(res.data.last_page)
            setLength(res.data.total)
            isLoading(false)
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })

    return (
      <div className="p-2 h-[100vh] w-full bg-[#f0f0f0]">
        <div className='overflow-auto flex justify-center flex-wrap flex-col my-2 p-6 rounded-xl w-[95%] mx-auto bg-white' style={{boxShadow:"0px 0px 10px 5px rgba(0,0,0,0.25)"}}>
          <div className='mb-2 flex flex-wrap align-center justify-between'>
            <div className='flex gap-5'>
              <img src={HospitalJasin} className='w-[4em]'/>
              <img src={Government} className='w-[4em]'/>
            </div>
            <div className='flex'>
              <button className='my-auto rounded-md mr-2 hover:cursor-pointer flex text-[.8em] p-2 text-white bg-red-500' onClick={logout}><BsDoorOpenFill className='my-auto'/> Log Keluar</button>
              <button className='my-auto rounded-md mr-2 hover:cursor-pointer flex text-[.8em] p-2 text-white bg-blue-500' onClick={openForm}><BsPlus className='my-auto'/> Tambah Borang</button>
              <input type='text' className='border rounded-xl p-2 text-[.85em] my-auto' placeholder='Cari Nama Pemohon' onChange={(e) => setSearch(e.target.value)}/>
              <select className='border text-[.85em] mx-2 p-2 rounded-xl my-auto' onChange={(e) => setStatus(e.target.value)}>
                <option value="">Lihat Semua</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className='flex justify-center flex-wrap align-center my-auto'>
              <BsArrowLeft className='my-auto hover:cursor-pointer' onClick={() => {
                if(page > 1) setPage(page - 1)}
              }/>
              <div className='mx-2 text-[.85em]'>
                Page <span className='font-bold'>{page}</span> of {total} | {length} Results
              </div>
              <BsArrowRight className='my-auto hover:cursor-pointer' onClick={() => {
                if(page < total) setPage(page + 1)
              }}/>
            </div>
          </div>
          <table className='border-l border-r border-black'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='py-2 px-6 text-center border border-black bg-[#646E79] text-white text-[.8em]'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map(row => (
                <tr key={row.id} className='hover:bg-[#c0c0c0] text-[.8em]'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='py-2 px-4 border-b border-black'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )) : <tr><td colSpan={columns.length} className='text-center py-2 px-4 border-b border-black py-[2em]'>{loading ? <><LoaderPinwheel className='mx-auto w-[3em] h-[3em] my-2'/>Mengambil Data...</> : <><BsX className='mx-auto w-[3em] h-[3em]'/>Tiada Data Dijumpai</>}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )
  }