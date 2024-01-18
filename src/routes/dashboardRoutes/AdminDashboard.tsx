import React from 'react'
import NavAdmin from '../../components/admin/NavAdmin'

const AdminDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col  items-center justify-center ">
      <NavAdmin />
      <div className=" h-full bg-slate-200 w-full flex items-center justify-between p-2">
        <div className=" w-[22%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">
            <h1 className="text-center pt-3 font-medium  text-[1.5rem]">DASHBOARD</h1>
            <ul className=' flex flex-col gap-5 text-center p-3 uppercase  w-[90%] mx-auto'>
                <li>Analytics</li>
                <hr />
                <li>Delivery Manager</li>
                <hr />
                <li>all requests</li>
                <hr />
                <li>Chats</li>
                <hr />
                <li>all sellers</li>
                <hr />
            </ul>

          </div>

        </div>
        <div className=" w-[78%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">

          </div>
        </div>

      </div>


    </div>
  )
}

export default AdminDashboard
