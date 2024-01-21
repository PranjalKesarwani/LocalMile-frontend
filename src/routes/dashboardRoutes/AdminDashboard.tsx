import React from 'react'
import NavAdmin from '../../components/admin/NavAdmin'
import { Link, Route, Routes } from 'react-router-dom'
import AnalyticsAdmin from '../../components/admin/AnalyticsAdmin'
import DeliveryAdmin from '../../components/admin/DeliveryAdmin'
import RequestsAdmin from '../../components/admin/RequestsAdmin'
import AllSellersAdmin from '../../components/admin/AllSellersAdmin'

const AdminDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col  items-center justify-center ">
      <NavAdmin />
      <div className=" h-full bg-slate-200 w-full flex items-center justify-between p-2">
        <div className=" w-[22%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">
            <h1 className="text-center pt-3 font-medium  text-3xl">DASHBOARD-ADMIN</h1>
            <ul className=' flex flex-col gap-5 text-center p-3 uppercase  w-[90%] text-2xl mx-auto mt-12'>
                <li><Link to={'/admin-dashboard'}>Analytics</Link></li>
                
                <hr />
                <li><Link to={'/admin-dashboard/delivery-manager'}>Delivery Manager</Link></li>
                <hr />
                <li><Link to={'/admin-dashboard/all-requests'}>all requests</Link></li>
              

                <hr />
                <li><Link to={'/admin-dashboard/all-sellers'}>all sellers</Link></li>

                <hr />
            </ul>

          </div>

        </div>
        <div className=" w-[78%] h-full px-2 py-3 ">
        <Routes>
            <Route path='/' element={<AnalyticsAdmin />} />
            <Route path='/delivery-manager' element={<DeliveryAdmin />} />
            <Route path='/all-requests' element={<RequestsAdmin />} />
            <Route path='/all-sellers' element={<AllSellersAdmin />} />
          </Routes>
        </div>

      </div>


    </div>
  )
}

export default AdminDashboard
