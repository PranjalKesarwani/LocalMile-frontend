import { Link, Route, Routes } from 'react-router-dom'
import NavDelivery from '../../components/delivery/NavDelivery'
import PendingOrders from '../../components/delivery/PendingOrders'
import CompletedOrders from '../../components/delivery/CompletedOrders'
import TotalOrders from '../../components/delivery/TotalOrders'
import CancelledOrders from '../../components/delivery/CancelledOrders'
import ReturnedOrders from '../../components/delivery/ReturnedOrders'

const DeliveryDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col  items-center justify-center ">
      <NavDelivery />
      <div className=" h-full bg-slate-200 w-full flex items-center justify-between p-2">
        <div className=" w-[22%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">
            <h1 className="text-center pt-3 font-medium  text-[1.5rem]">DASHBOARD-DELIVERY</h1>
            <ul className=' flex flex-col gap-5 text-center p-3 uppercase  w-[90%] mx-auto'>
              <li><Link to={'/delivery-dashboard/pending-orders'}>Pending Orders</Link></li>

              <hr />
              <li> <Link to={'/delivery-dashboard/completed-orders'}>Completed Orders</Link></li>
              <hr />
              <li> <Link to={'/delivery-dashboard/cancelled-orders'}>Cancelled Orders</Link></li>
              <hr />

              <li> <Link to={'/delivery-dashboard/returned-orders'}>Returned Orders</Link></li>

              <hr />
              <li> <Link to={'/delivery-dashboard/total-orders'}>Total Orders</Link></li>

              <hr />
            </ul>

          </div>

        </div>
        <div className=" w-[78%] h-full px-2 py-3 ">
          <Routes>
            <Route path='/pending-orders' element={<PendingOrders />} />
            <Route path='/completed-orders' element={<CompletedOrders />} />
            <Route path='/total-orders' element={<TotalOrders />} />
            <Route path='/cancelled-orders' element={<CancelledOrders />} />
            <Route path='/returned-orders' element={<ReturnedOrders />} />
          </Routes>
        </div>

      </div>


    </div>
  )
}

export default DeliveryDashboard
