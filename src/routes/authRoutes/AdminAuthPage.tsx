import { Link } from 'react-router-dom'


const AdminAuthPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            
            <h1 className="text-center text-7xl text-black ">Admin Auth Page</h1>
            <Link to={'/admin-dashboard'} className='text-5xl text-slate-800'>Go to admin dashboard</Link>



        </div>
    )
}

export default AdminAuthPage
