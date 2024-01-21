
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import WaitForUserAuth from './routes/WaitForUserAuth';
import ErrorPage from './routes/ErrorPage';
import BuyerAuthPage from './routes/authRoutes/BuyerAuthPage';
import SellerAuthPage from './routes/authRoutes/SellerAuthPage';
import AdminAuthPage from './routes/authRoutes/AdminAuthPage';
import DeliveryAuthPage from './routes/authRoutes/DeliveryAuthPage';
import SellerDashboard from './routes/dashboardRoutes/SellerDashboard';
import AdminDashboard from './routes/dashboardRoutes/AdminDashboard';
import DeliveryDashboard from './routes/dashboardRoutes/DeliveryDashboard';
import BuyerLandingPage from './routes/BuyerLandingPage';

function App() {


  return (
    <>
      <BrowserRouter>


        <Routes>
          <Route path='/' element={<WaitForUserAuth />} />
          <Route path='/seller-dashboard/*' element={<SellerDashboard />} />
          <Route path='/admin-dashboard/*' element={<AdminDashboard />} />
          {/* <Route path='/delivery-dashboard' element={<DeliveryDashboard />} /> */}
          <Route path='/delivery-dashboard/*' element={<DeliveryDashboard />} />
          <Route path='/buyer-auth' element={<BuyerAuthPage />} />
          <Route path='/buyer-landing' element={<BuyerLandingPage />} />
          <Route path='/seller-auth' element={<SellerAuthPage />} />
          <Route path='/admin-auth' element={<AdminAuthPage />} />
          <Route path='/delivery-auth' element={<DeliveryAuthPage />} />
          <Route path='/seller-dashboard' element={<SellerDashboard />} />
          {/* <Route path='/admin-dashboard' element={<AdminDashboard />} /> */}
          <Route path='*' element={<ErrorPage />} />


        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
