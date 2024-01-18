import React from 'react'
import NavAdmin from '../../components/admin/NavAdmin'

const AdminDashboard = () => {
    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <NavAdmin />
            <h1 className="text-center text-7xl text-black ">Dashboard-Admin</h1>


        </div>
    )
}

export default AdminDashboard
