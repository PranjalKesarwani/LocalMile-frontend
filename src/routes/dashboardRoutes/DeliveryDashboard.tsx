import React from 'react'
import NavDelivery from '../../components/delivery/NavDelivery'

const DeliveryDashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
      <NavDelivery />
      <h1 className="text-center text-7xl text-black ">Dashboard-Delivery</h1>


    </div>
  )
}

export default DeliveryDashboard
