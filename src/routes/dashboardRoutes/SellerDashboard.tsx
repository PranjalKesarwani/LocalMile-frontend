import React from 'react'
import NavSeller from '../../components/seller/NavSeller'

const SellerDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
      <NavSeller />
      <h1 className="text-center text-7xl text-black ">Dashboard-Seller</h1>


    </div>
  )
}

export default SellerDashboard
