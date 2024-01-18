import React from 'react'
import { Link } from 'react-router-dom'

const DeliveryAuthPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <h1 className="text-center text-7xl text-black ">Delivery Auth Page</h1>
            <Link to={'/delivery-dashboard'} className='text-5xl text-slate-800'>Go to delivery dashboard</Link>

          

        </div>
  )
}

export default DeliveryAuthPage
