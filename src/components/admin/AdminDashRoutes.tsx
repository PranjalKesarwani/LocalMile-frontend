import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashRoutes = () => {
  return (
    <div className=" w-[22%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">
            <h1 className="text-center pt-3 font-medium  text-[1.5rem]">DASHBOARD-ADMIN</h1>
            <ul className=' flex flex-col gap-5 text-center p-3 uppercase  w-[90%] mx-auto'>
                <li><Link to={'/admin-dashboard'}>Analytics</Link></li>
                
                <hr />
                <li><Link to={'/delivery-manager'}>Delivery Manager</Link></li>
                <hr />
                <li><Link to={'/admin-dashboard/all-requests'}>all requests</Link></li>
              

                <hr />
                <li><Link to={'/admin-dashboard/all-sellers'}>all sellers</Link></li>

                <hr />
            </ul>

          </div>

        </div>
  )
}

export default AdminDashRoutes
