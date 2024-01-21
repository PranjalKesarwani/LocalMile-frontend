import NavSeller from '../../components/seller/NavSeller';
import { Link, Route, Routes } from 'react-router-dom';
import AnalyticsSeller from '../../components/seller/AnalyticsSeller';
import PushItems from '../../components/seller/PushItems';
import AllItems from './AllItems';
import Orders from './Orders';
import Chats from './Chats';

const SellerDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col  items-center justify-center ">
      <NavSeller />
      <div className=" h-full bg-slate-200 w-full flex items-center justify-between p-2">
        <div className=" w-[22%] h-full px-2 py-3 ">
          <div className="w-full h-full bg-white rounded-lg ">
            <h1 className="text-center pt-3 font-medium  text-3xl">DASHBOARD</h1>
            <ul className=' flex flex-col gap-5 text-center p-3 uppercase  w-[90%] mx-auto text-2xl mt-12'>
              <li><Link to={'/seller-dashboard'}>Analytics</Link></li>

              <hr />

              <li><Link to={'/seller-dashboard/push-items'}>Push Items</Link></li>
              <hr />

              <li><Link to={'/seller-dashboard/all-items'}>All Items</Link></li>

              <hr />
              <li><Link to={'/seller-dashboard/chats'}>Chats</Link></li>

              <hr />
              <li><Link to={'/seller-dashboard/orders'}>Orders</Link></li>
              <hr />
            </ul>

          </div>

        </div>
        <div className=" w-[78%] h-full px-2 py-3 ">
          <Routes>
            <Route path='/' element={<AnalyticsSeller />} />
            <Route path='/push-items' element={<PushItems />} />
            <Route path='/all-items' element={<AllItems />} />
            <Route path='/chats' element={<Chats />} />
            <Route path='/orders' element={<Orders />} />
          </Routes>

        </div>

      </div>


    </div>
  )
}

export default SellerDashboard
