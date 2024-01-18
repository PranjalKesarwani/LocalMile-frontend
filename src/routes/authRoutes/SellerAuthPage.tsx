// import React from 'react'
import { Link } from 'react-router-dom'

const SellerAuthPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <h1 className="text-center text-7xl text-black ">Seller Registration Form</h1>
            <Link to={'/seller-dashboard'} className='text-5xl text-slate-800'>Go to seller dashboard</Link>
            <Link to={'/admin-auth'}>Owner of LocalMile!</Link>
            <Link to={'/delivery-auth'}>Are u a delivery guy?</Link>

        </div>
    )
}

export default SellerAuthPage
