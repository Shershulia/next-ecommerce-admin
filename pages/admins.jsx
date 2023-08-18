import React, {useEffect, useState} from 'react';
import {Layout, Spinner} from "@/components";
import axios from "axios";
import Swal from "sweetalert2";
import {prettyDate} from "@/lib/date";

const AdminsPage = () => {
    const [email,setEmail] = useState('');
    const [adminEmails,setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const addAdmin =(ev)=>{
        ev.preventDefault();
        Swal.fire({
            title: `Do you want to add this email ${email} to admins?`,
            showCancelButton: true,
            confirmButtonText: 'Add',
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await axios.post('/api/admins',{email}).then(res=>{
                    Swal.fire({
                        title:'Admin Created',
                        icon:"success",
                    })
                }).catch(err=>{
                    console.log(err);
                    Swal.fire({
                        title:'Error!',
                        text:err.message,
                        icon:"error",
                    })
                });
                }

            setEmail('');
            loadAdmins();
        })
    }

    function loadAdmins(){
        setIsLoading(true);
        axios.get('/api/admins').then(res=>{
            setAdminEmails(res.data);
            setIsLoading(false);
        })
    }
    useEffect(()=>{
        loadAdmins();
    },[])
    const deleteAdmin =  async (id,name)=> {
        Swal.fire({
            title: `Do you want to delete the admin email ${name}?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await axios.delete(`/api/admins?id=${id}`);
                await Swal.fire('Deleted!', '', 'success');
                loadAdmins();
            }
        })


    }
    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Add new admin</h2>
            <form onSubmit={(ev)=>addAdmin(ev)}>
                <div class='flex gap-2'>
                    <input placeholder={'google email'}
                           className={'mb-0'}
                           value={email}
                           onChange={(ev)=>setEmail(ev.target.value)}/>
                    <button
                    type={"submit"}
                        className='btn-primary py-1 whitespace-nowrap'>
                        Add admin
                    </button>
                </div>

            </form>
            <h2>Existing admins</h2>
            <table className={'basic'}>
                <thead>
                <tr>
                    <th className={'text-left'}>Admin google email</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className={'py-4'}>
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {adminEmails.length>0 && adminEmails.map(adminEmail=>(
                        <tr key={adminEmail._id}>
                            <td>{adminEmail.email}</td>
                            <td>{adminEmail.createdAt && prettyDate(adminEmail.createdAt)}</td>
                            <td>
                                <div className={'w-full flex justify-center'}>
                                    <button className={'btn-red'} onClick={()=>{deleteAdmin(adminEmail._id,adminEmail.email)}}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default AdminsPage;